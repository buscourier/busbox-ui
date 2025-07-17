import { HostBinding, type OnChanges, type SimpleChanges } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import type { YaReadyEvent } from 'angular8-yandex-maps';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';

import { cn } from '@core/utils';

import type { MapPoint } from '@shared/types';

type AnimationType = 'point' | 'bounds' | 'zoom' | null;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [AngularYandexMapsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnChanges {
  private destroyRef = inject(DestroyRef);

  @Input({ required: true }) points: MapPoint[] = [];
  @Input() activePoint: MapPoint | null = null;
  @Input() zoom = 12;
  @Input() center: [number, number] | null = null;
  @Input() disableScrollZoom = false;
  @Input() animationDuration = 800;
  @Input() autoFitBounds = true;

  @Output() pointSelect = new EventEmitter<MapPoint>();
  @Output() mapReady = new EventEmitter<ymaps.Map>();
  @Output() boundsChange = new EventEmitter<number[][]>();

  @HostBinding('class') get hostClasses(): string {
    return cn(`relative block w-full h-full rounded-lg overflow-hidden bg-gray-50`);
  }

  isLoading = signal(true);
  currentZoom = signal(this.zoom);
  private animationState = signal<AnimationType>(null);

  private map: ymaps.Map | null = null;
  private isMapReady = false;
  private boundsChangeHandler?: () => void;
  private animationTimeoutId?: ReturnType<typeof setTimeout>;

  private static readonly ANIMATION_RATIOS = {
    PAN: 0.7,
    ZOOM: 0.3,
  } as const;

  private static readonly BUFFERS = {
    AFTER_PAN: 100,
    AFTER_ZOOM: 100,
    ANIMATION_TIMEOUT: 1000,
  } as const;

  private static readonly DEFAULT_CENTER: [number, number] = [55.751952, 37.600739];
  private static readonly ZOOM_LIMITS = { MIN: 1, MAX: 19 } as const;
  private static readonly DEFAULT_MARGIN = [40, 40, 40, 40];

  readonly mapState: ymaps.IMapState = {
    behaviors: ['default'],
    controls: [],
  };

  mapCenter = computed(() => {
    if (this.center) return this.center;
    if (this.activePoint) return [this.activePoint.lat, this.activePoint.lng];
    if (this.points.length) return this.calculateCenter();
    return MapComponent.DEFAULT_CENTER;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isMapReady) return;

    if (changes['activePoint'] && this.activePoint) {
      void this.handleActivePointChange();
    }

    if (changes['points'] && this.points.length && this.autoFitBounds) {
      void this.handlePointsChange();
    }

    if (changes['zoom']) {
      this.currentZoom.set(this.zoom);
    }
  }

  async onMapReady(event: YaReadyEvent<ymaps.Map>): Promise<void> {
    this.map = event.target;
    this.isMapReady = true;
    this.isLoading.set(false);

    this.setupMapBehaviors();
    this.setupEventListeners();

    this.mapReady.emit(this.map);

    await this.delay(200);
    await this.initializeMapView();
  }

  onPointClick(point: MapPoint): void {
    if (this.isAnimating()) {
      console.log('Animation in progress, ignoring click');
      return;
    }

    this.pointSelect.emit(point);

    if (this.activePoint?.id !== point.id) {
      void this.animateToPoint(point, {
        zoom: Math.max(this.currentZoom(), 14),
        type: 'point',
      });
    }
  }

  zoomIn(levels = 2): void {
    if (!this.canAnimate()) return;
    const newZoom = Math.min(this.currentZoom() + levels, MapComponent.ZOOM_LIMITS.MAX);
    this.animateZoom(newZoom, 'zoom');
  }

  zoomOut(levels = 2): void {
    if (!this.canAnimate()) return;
    const newZoom = Math.max(this.currentZoom() - levels, MapComponent.ZOOM_LIMITS.MIN);
    this.animateZoom(newZoom, 'zoom');
  }

  async fitMapBounds(margin = MapComponent.DEFAULT_MARGIN): Promise<void> {
    if (!this.canAnimate() || !this.points.length) return;

    this.startAnimation('bounds');

    const bounds = this.calculateBounds();

    this.map!.setBounds(bounds, {
      checkZoomRange: true,
      duration: this.animationDuration,
      zoomMargin: margin,
    });

    await this.delay(this.animationDuration + MapComponent.BUFFERS.AFTER_ZOOM);
    this.finishAnimation();
  }

  private setupMapBehaviors(): void {
    if (this.disableScrollZoom) {
      this.map!.behaviors.disable('scrollZoom');
    }
  }

  private setupEventListeners(): void {
    this.boundsChangeHandler = () => {
      const bounds = this.map?.getBounds();
      if (bounds) {
        this.boundsChange.emit(bounds);
      }
    };

    this.map!.events.add('boundschange', this.boundsChangeHandler);

    this.destroyRef.onDestroy(() => {
      if (this.boundsChangeHandler) {
        this.map?.events.remove('boundschange', this.boundsChangeHandler);
      }
      if (this.animationTimeoutId) {
        clearTimeout(this.animationTimeoutId);
      }
    });
  }

  private async initializeMapView(): Promise<void> {
    if (this.activePoint) {
      await this.animateToPoint(this.activePoint, { type: 'point' });
    } else if (this.points.length && this.autoFitBounds) {
      await this.fitMapBounds();
    }
  }

  private async handleActivePointChange(): Promise<void> {
    if (!this.isAnimating()) {
      await this.animateToPoint(this.activePoint!, { type: 'point' });
    }
  }

  private async handlePointsChange(): Promise<void> {
    await this.delay(100);
    if (!this.isAnimating()) {
      await this.fitMapBounds();
    }
  }

  private async animateToPoint(
    point: MapPoint,
    options: { zoom?: number; duration?: number; type: AnimationType } = {
      type: 'point',
    },
  ): Promise<void> {
    if (!this.canAnimate()) return;

    const { zoom, duration = this.animationDuration, type } = options;
    const panDuration = duration * MapComponent.ANIMATION_RATIOS.PAN;
    const zoomDuration = duration * MapComponent.ANIMATION_RATIOS.ZOOM;

    this.startAnimation(type);

    this.map!.panTo([point.lat, point.lng], {
      flying: true,
      duration: panDuration,
    });

    await this.delay(panDuration);

    if (zoom !== undefined && zoom !== this.currentZoom()) {
      this.animateZoom(zoom, type, zoomDuration);
      await this.delay(zoomDuration + MapComponent.BUFFERS.AFTER_ZOOM);
    } else {
      await this.delay(MapComponent.BUFFERS.AFTER_PAN);
    }

    this.finishAnimation();
  }

  private animateZoom(zoom: number, type: AnimationType, duration = this.animationDuration): void {
    if (!this.map) return;

    this.map.setZoom(zoom, { duration });
    this.currentZoom.set(zoom);
  }

  private startAnimation(type: AnimationType): void {
    if (this.animationTimeoutId) {
      clearTimeout(this.animationTimeoutId);
    }

    this.animationState.set(type);

    this.animationTimeoutId = setTimeout(() => {
      console.warn('Animation timeout, forcing finish');
      this.finishAnimation();
    }, this.animationDuration + MapComponent.BUFFERS.ANIMATION_TIMEOUT);
  }

  private finishAnimation(): void {
    if (this.animationTimeoutId) {
      clearTimeout(this.animationTimeoutId);
      this.animationTimeoutId = undefined;
    }

    this.animationState.set(null);
    this.syncZoomState();
  }

  private isAnimating(): boolean {
    return this.animationState() !== null;
  }

  private canAnimate(): boolean {
    return this.isMapReady && !!this.map;
  }

  private syncZoomState(): void {
    const currentMapZoom = this.map?.getZoom();
    if (currentMapZoom !== undefined && currentMapZoom !== this.currentZoom()) {
      this.currentZoom.set(currentMapZoom);
    }
  }

  private calculateCenter(): [number, number] {
    if (!this.points.length) return MapComponent.DEFAULT_CENTER;

    const sumLat = this.points.reduce((sum, p) => sum + p.lat, 0);
    const sumLng = this.points.reduce((sum, p) => sum + p.lng, 0);

    return [sumLat / this.points.length, sumLng / this.points.length];
  }

  private calculateBounds(): number[][] {
    if (this.points.length === 1) {
      const p = this.points[0];
      const delta = 0.01;
      return [
        [p.lat - delta, p.lng - delta],
        [p.lat + delta, p.lng + delta],
      ];
    }

    const lats = this.points.map((p) => p.lat);
    const lngs = this.points.map((p) => p.lng);

    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
  }

  getPlacemarkOptions(point: MapPoint): ymaps.IPlacemarkOptions {
    const isActive = this.activePoint?.id === point.id;

    return {
      iconLayout: 'default#image',
      iconImageHref: isActive
        ? '/assets/icons/map-point-active.svg'
        : '/assets/icons/map-point.svg',
      iconImageSize: isActive ? [40, 40] : [32, 32],
      iconImageOffset: isActive ? [-20, -40] : [-16, -32],
      zIndex: isActive ? 1000 : 100,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
