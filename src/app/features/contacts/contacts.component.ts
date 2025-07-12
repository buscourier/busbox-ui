import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  type OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, type Observable, shareReplay } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { BreakpointService } from '@core/services/breakpoint.service';

import { MapComponent } from '@shared/components/map';
import { LocationsFacade } from '@shared/store';
import type { MapPoint, Office, PickupCity } from '@shared/types';

import { PointType } from '@contacts/types';

import { FilterComponent, type Filter } from './components/filter';
import { PointDetailsComponent } from './components/point-details';
import { PointListComponent } from './components/point-list';

export interface QueryParams {
  cityId: string | null;
  pointType: string | null;
  pointId: string | null;
}

export const QUERY_PARAMS = {
  CITY_ID: 'cityId',
  POINT_TYPE: 'pointType',
  POINT_ID: 'pointId',
} as const;

@Component({
  selector: 'app-contacts',
  imports: [
    MapComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    FilterComponent,
    PointDetailsComponent,
    PointListComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent implements OnInit {
  private readonly breakpointService = inject(BreakpointService);
  private readonly locationsFacade = inject(LocationsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  cities$!: Observable<PickupCity[]>;
  points$!: Observable<Office[]>;
  filteredPoints$!: Observable<Office[]>;

  initialCity$ = new BehaviorSubject<PickupCity | null>(null);
  initialPoint$ = new BehaviorSubject<PointType | null>(null);
  activePoint$ = new BehaviorSubject<Office | null>(null);

  // Сигналы для состояния
  readonly activeTabIndex = signal(0);

  readonly mobileTabs = [
    { label: 'На карте', value: 'map' },
    { label: 'Списком', value: 'list' },
  ];

  ngOnInit(): void {
    this.cities$ = this.locationsFacade.getPickupCities();
    this.points$ = this.locationsFacade.getOffices();

    this.initializeUrl();

    this.filteredPoints$ = combineLatest({
      points: this.points$,
      params: this.route.queryParams,
    }).pipe(
      map(({ points, params }) => {
        const cityId = params['cityId'] as string;
        const pointType = params['pointType'] as PointType;

        let filteredPoints = points;

        if (cityId) {
          filteredPoints = filteredPoints.filter((point) => point.office_id === cityId);
        }

        switch (pointType) {
          case PointType.GIVE:
            return filteredPoints.filter((point) => point.give === '1');
          case PointType.GET:
            return filteredPoints.filter((point) => point.get === '1');
          case PointType.OFFICE:
            return filteredPoints.filter((point) => point.office_id === '1');
          case PointType.ANY:
          default:
            return filteredPoints;
        }
      }),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  // private initializeUrl(): void {
  //   const queryParams = this.route.snapshot.queryParams;
  //
  //   const { cityId, pointType, pointId } = queryParams;
  //
  //   this.initialPoint$.next(pointType || PointType.ANY);
  //
  //   if (cityId) {
  //     this.initCityFromUrl(cityId);
  //   } else {
  //     this.initialCity$.next(null);
  //   }
  //
  //   if (pointId) {
  //     this.initPointFromUrl(pointId);
  //   } else {
  //     this.activePoint$.next(null);
  //   }
  // }

  private initializeUrl(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((queryParams) => {
      const { cityId, pointType, pointId } = queryParams;

      // Обновляем тип фильтра
      this.initialPoint$.next(pointType || PointType.ANY);

      // Обновляем город
      if (cityId) {
        this.initCityFromUrl(cityId);
      } else {
        this.initialCity$.next(null);
      }

      // Обновляем выбранную точку
      if (pointId) {
        this.initPointFromUrl(pointId);
      } else {
        this.activePoint$.next(null);
      }
    });
  }

  private updateUrlWithFilter(filter: Filter): void {
    const queryParams: Partial<QueryParams> = {};

    queryParams[QUERY_PARAMS.CITY_ID] = filter.city ? filter.city.office_id : null;

    if (filter.point && filter.point !== PointType.ANY) {
      queryParams[QUERY_PARAMS.POINT_TYPE] = filter.point;
    }

    if (filter.point && filter.point === PointType.ANY) {
      queryParams[QUERY_PARAMS.POINT_TYPE] = null;
    }

    this.updateUrl(queryParams);
  }

  private updateUrl(params: Partial<QueryParams>): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: false,
    });
  }

  setFilter(filter: Filter): void {
    this.updateUrlWithFilter(filter);
    // this.onCloseDetails();
  }

  private initCityFromUrl(id: string): void {
    this.cities$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((cities) => {
      const city = cities.find((city) => city.office_id === id);

      if (city) {
        this.initialCity$.next(city);
      }
    });
  }

  private initPointFromUrl(id: string): void {
    this.points$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((points) => {
      const point = points.find((point) => point.id === id);

      if (point) {
        this.activePoint$.next(point);
      }
    });
  }

  readonly shouldShowList = computed(() => {
    const isMobile = this.breakpointService.isMobile();
    return !isMobile || this.activeTabIndex() === 1;
  });

  // Методы
  setActiveTab(index: number): void {
    this.activeTabIndex.set(index);
  }

  getMapPoints(points: Office[] | null): MapPoint[] {
    if (!(points && points.length)) return [];

    return points.map((point) => ({
      geo_x: point.geo_x,
      geo_y: point.geo_y,
    }));
  }

  onPointSelect(pointId: string) {
    this.updateUrl({ pointId });
  }

  onCloseDetails(): void {
    this.updateUrl({ pointId: null });
    this.activePoint$.next(null);
  }
}
