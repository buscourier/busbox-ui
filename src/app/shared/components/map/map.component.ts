import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  type OnChanges,
  Output,
  signal,
  type SimpleChanges,
} from '@angular/core';
import { AngularYandexMapsModule, type YaReadyEvent } from 'angular8-yandex-maps';

import type { MapPoint } from '@shared/types';

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
  @Input() animationDuration = 500;
  @Input() autoFitBounds = true;

  @Output() pointSelect = new EventEmitter<MapPoint>();
  @Output() mapReady = new EventEmitter<ymaps.Map>();
  @Output() boundsChange = new EventEmitter<number[][]>();

  isLoading = signal(true);
  currentZoom = signal(this.zoom);

  mapCenter = computed(() => {
    if (this.center) return this.center;
    if (this.activePoint) return [this.activePoint.lat, this.activePoint.lng];
    if (this.points.length) return this.calculateCenter();
    return [55.751952, 37.600739];
  });

  private map: ymaps.Map | null = null;
  private isMapReady = false;
  private boundsChangeHandler?: () => void;

  readonly mapState: ymaps.IMapState = {
    behaviors: ['default'],
    controls: [],
  };

  readonly zoomControlParameters: ymaps.control.IButtonParameters = {
    options: {
      position: { bottom: 70, right: 15 },
      size: 'small',
    },
  };

  readonly zoomOutControlParameters: ymaps.control.IButtonParameters = {
    options: {
      position: { bottom: 45, right: 15 },
      size: 'small',
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activePoint'] && this.activePoint && this.isMapReady) {
      this.animateToPoint(this.activePoint);
    }

    if (changes['points'] && this.points.length && this.isMapReady && this.autoFitBounds) {
      this.fitMapBounds();
    }

    if (changes['zoom']) {
      this.currentZoom.set(this.zoom);
    }
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>): void {
    this.map = event.target;
    this.isMapReady = true;
    this.isLoading.set(false);

    if (this.disableScrollZoom) {
      this.map.behaviors.disable('scrollZoom');
    }

    this.boundsChangeHandler = () => {
      const bounds = this.map?.getBounds();
      if (bounds) {
        this.boundsChange.emit(bounds);
      }
    };

    this.map.events.add('boundschange', this.boundsChangeHandler);

    this.mapReady.emit(this.map);

    if (this.points.length && this.autoFitBounds) {
      setTimeout(() => this.fitMapBounds(), 100);
    }

    this.destroyRef.onDestroy(() => {
      if (this.boundsChangeHandler) {
        this.map?.events.remove('boundschange', this.boundsChangeHandler);
      }
    });
  }

  onPointClick(point: MapPoint): void {
    this.pointSelect.emit(point);
    this.animateToPoint(point, { zoom: Math.max(this.currentZoom(), 14) });
  }

  zoomIn(levels = 2): void {
    if (!this.isMapReady || !this.map) return;

    const newZoom = Math.min(this.map.getZoom() + levels, 19);
    this.animateZoom(newZoom);
  }

  zoomOut(levels = 2): void {
    if (!this.isMapReady || !this.map) return;

    const newZoom = Math.max(this.map.getZoom() - levels, 1);
    this.animateZoom(newZoom);
  }

  animateToPoint(point: MapPoint, options: { zoom?: number; duration?: number } = {}): void {
    if (!this.isMapReady || !this.map) return;

    const { zoom, duration = this.animationDuration } = options;

    try {
      this.map.panTo([point.lat, point.lng], {
        flying: true,
        duration,
      });

      if (zoom !== undefined) {
        this.animateZoom(zoom, duration * 0.6);
      }

      setTimeout(() => this.syncZoomState(), duration + 100);
    } catch (error) {
      console.warn('Ошибка анимации карты:', error);
    }
  }

  fitMapBounds(margin = [20, 20, 20, 20]): void {
    if (!this.isMapReady || !this.map || !this.points.length) return;

    try {
      const bounds = this.calculateBounds();
      this.map.setBounds(bounds, {
        checkZoomRange: true,
        duration: this.animationDuration,
        zoomMargin: margin,
      });

      setTimeout(() => this.syncZoomState(), this.animationDuration + 100);
    } catch (error) {
      console.warn('Ошибка подгонки границ:', error);
    }
  }

  onMapWheel(event: WheelEvent): void {
    if (this.disableScrollZoom) {
      event.preventDefault();
    }
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

  private animateZoom(zoom: number, duration = this.animationDuration): void {
    if (!this.map) return;

    this.map.setZoom(zoom, { duration });
    this.currentZoom.set(zoom);
  }

  private syncZoomState(): void {
    const currentMapZoom = this.map?.getZoom();
    if (currentMapZoom !== undefined && currentMapZoom !== this.currentZoom()) {
      this.currentZoom.set(currentMapZoom);
    }
  }

  private calculateCenter(): [number, number] {
    if (!this.points.length) return [55.751952, 37.600739];

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
}
