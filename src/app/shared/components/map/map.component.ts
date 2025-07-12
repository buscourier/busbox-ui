import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularYandexMapsModule, type YaEvent } from 'angular8-yandex-maps';

import type { MapPoint } from '@shared/types';

@Component({
  selector: 'app-map',
  imports: [AngularYandexMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
  @Input({ required: true }) points!: MapPoint[];
  // @Input() currentPoint!: MapPoint;
  @Input() zoom = 12;
  @Input() disableDefaultUI = true;
  @Input() gestureHandling!: boolean;
  @Input() scrollwheel!: boolean;
  @Input() disableScrollZoom = false;
  @Input() hintContent = null;
  @Input() balloonContent = null;

  @Output() pointSelect = new EventEmitter<MapPoint>();

  isLoading = true;

  zoomControlParameters: ymaps.control.IZoomControlParameters = {
    options: {
      position: {
        bottom: 50,
        right: 25,
      },
    },
  };

  placemarkProperties: ymaps.IPlacemarkProperties = {
    hintContent: 'Hint content',
    balloonContent: 'Baloon content',
  };

  placemarkOptions: ymaps.IPlacemarkOptions = {
    iconLayout: 'default#image',
    iconImageHref: '/assets/icons/map-point.svg',
    iconImageSize: [32, 32],
  };

  zoomScroll({ event }: YaEvent<ymaps.Map>) {
    if (this.disableScrollZoom) {
      event.preventDefault();
    }
  }

  ready() {
    this.isLoading = false;
  }

  selectPoint(point: MapPoint) {
    this.pointSelect.emit(point);
  }
}
