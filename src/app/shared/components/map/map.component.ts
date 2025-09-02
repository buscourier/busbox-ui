import type { SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
import { Input, ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';
import { TuiBadge } from '@taiga-ui/kit';
import type { YMap, LngLat, YMapFeature, YMapHotspot, YMapMarker } from '@yandex/ymaps3-types';
import {
  YMapComponent,
  YMapControlsDirective,
  YMapDefaultFeaturesLayerDirective,
  YMapDefaultSchemeLayerDirective,
  YMapHintDirective,
  YMapMarkerDirective,
  YMapZoomControlDirective,
  type YReadyEvent,
} from 'angular-yandex-maps-v3';

import { BreakpointDirective } from '@core/directives';

import type { Office } from '@shared/types';

type LngLatBounds = [LngLat, LngLat];

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    YMapComponent,
    YMapDefaultSchemeLayerDirective,
    YMapControlsDirective,
    YMapZoomControlDirective,
    YMapDefaultFeaturesLayerDirective,
    YMapMarkerDirective,
    YMapHintDirective,
    BreakpointDirective,
    TuiBadge,
  ],
  host: {
    class: `block h-full`,
  },
})
export class MapComponent implements OnChanges {
  /** Input points to render as markers */
  @Input({ required: true }) points: Office[] = [];
  @Input({ required: true }) selectedPoint: Office | null = null;

  /** Automatically fit all points when they change */
  @Input() autoFit = true;

  /** Fixed margins (in px) for the map viewport: [top, right, bottom, left] */
  @Input() margin: [number, number, number, number] = [80, 20, 80, 20];

  /** Extra padding ratio around bounds (relative to width/height) */
  @Input() fitPaddingRatio = 0.08;

  /** Duration (ms) for fit animation */
  @Input() fitDuration = 700;

  /** Duration (ms) for focusing on a point */
  @Input() focusDuration = 700;

  /** Zoom level when focusing on a point; null = keep current zoom */
  @Input() focusZoom: number | null = 16;

  @Input() autoFitToSelected = true;

  /** Emits the id of a focused point */
  @Output() focusPoint = new EventEmitter<string>();

  private map: YMap | null = null;

  /** Map hint: extract tooltip text from feature/marker properties */
  onHint = (o?: YMapFeature | YMapMarker | YMapHotspot) => {
    if (o?.properties?.['type'] === 'custom-marker') {
      return o.properties;
    }
    return null;
  };

  ngOnChanges(changes: SimpleChanges): void {
    // Apply margin if it was changed
    if (changes['margin'] && this.map) this.map.setMargin(this.margin);

    // Auto-fit when points change
    if (changes['points'] && this.autoFit) this.scheduleFitAll();

    if (changes['selectedPoint'] && this.autoFitToSelected) {
      this.handleSelectedPointChange(changes['selectedPoint']);
    }
  }

  onMapReady(e: YReadyEvent<YMap>) {
    this.map = e.entity;
    this.map.setMargin(this.margin); // apply fixed margins
    this.scheduleFitAll(); // initial fit to points
  }

  private handleSelectedPointChange(change: SimpleChange): void {
    const newPoint = change.currentValue;
    const prevPoint = change.previousValue;

    if (newPoint && newPoint !== prevPoint) {
      this.onFocusPoint(newPoint);
    }
  }

  /** Called when a custom marker is clicked */
  onFocusPoint(p: Office): void {
    if (!this.map) return;

    this.map.update({
      location: {
        center: [p.lng, p.lat],
        zoom: this.focusZoom ?? 16,
        duration: this.focusDuration,
        easing: 'ease-in-out',
      },
    });

    this.focusPoint.emit(p.id);
  }

  // ---------- helpers ----------

  /** Schedule auto-fit with requestAnimationFrame (waits for layout) */
  private scheduleFitAll() {
    if (!this.map || !this.points?.length) return;
    requestAnimationFrame(() => this.fitAll(this.points, this.fitDuration));
  }

  /** Fit map viewport to all points */
  private fitAll(points: Office[], duration = 600) {
    if (!this.map || !points?.length) return;
    const raw = this.computeBounds(points);
    if (!raw) return;
    const padded = this.padBounds(raw, this.fitPaddingRatio);
    this.map.update({ location: { bounds: padded, duration } });
  }

  /** Compute bounding box for all points */
  private computeBounds(points: Office[]): LngLatBounds | null {
    if (!points?.length) return null;

    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;
    for (const p of points) {
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
    }

    // Single point: create a small bbox around it so zoom is not too close
    if (minLng === maxLng && minLat === maxLat) {
      const δ = 0.01;
      return [
        [minLng - δ, minLat - δ],
        [maxLng + δ, maxLat + δ],
      ];
    }
    return [
      [minLng as number, minLat as number],
      [maxLng as number, maxLat as number],
    ];
  }

  /** Expand bbox by ratio to add padding around points */
  private padBounds([sw, ne]: LngLatBounds, r = 0.08): LngLatBounds {
    const [minLng, minLat] = sw;
    const [maxLng, maxLat] = ne;
    const dLng = (maxLng - minLng) * r;
    const dLat = (maxLat - minLat) * r;
    return [
      [minLng - dLng, minLat - dLat],
      [maxLng + dLng, maxLat + dLat],
    ];
  }
}
