import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  type OnDestroy,
  type OnInit,
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

import { OfficeType } from '@contacts/types';

import { FilterComponent, type Filter } from './components/filter';
import { OfficeDetailsComponent } from './components/office-details';
import { OfficeListComponent } from './components/office-list';

export interface QueryParams {
  cityId: string | null;
  officeType: string | null;
  officeId: string | null;
}

export const QUERY_PARAMS = {
  CITY_ID: 'cityId',
  OFFICE_TYPE: 'officeType',
  OFFICE_ID: 'officeId',
} as const;

@Component({
  selector: 'app-contacts',
  imports: [
    MapComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    FilterComponent,
    OfficeListComponent,
    OfficeDetailsComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent implements OnInit, OnDestroy {
  private readonly breakpointService = inject(BreakpointService);
  private readonly locationsFacade = inject(LocationsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  cities$!: Observable<PickupCity[]>;
  offices$!: Observable<Office[]>;
  filteredOffices$!: Observable<Office[]>;

  initialCity$ = new BehaviorSubject<PickupCity | null>(null);
  initialOfficeType$ = new BehaviorSubject<OfficeType | null>(null);
  activeOffice$ = new BehaviorSubject<Office | null>(null);

  // Cached result
  private _cachedMapPoints: MapPoint[] = [];
  private _lastOfficesRef: Office[] | null = null;

  readonly mobileTabs = [
    { label: 'На карте', value: 'map' },
    { label: 'Списком', value: 'list' },
  ];

  ngOnInit(): void {
    this.cities$ = this.locationsFacade.getPickupCities();
    this.offices$ = this.locationsFacade.getOffices();

    this.initializeUrl();

    this.filteredOffices$ = combineLatest({
      offices: this.offices$,
      params: this.route.queryParams,
    }).pipe(
      map(({ offices, params }) => {
        const cityId = params['cityId'] as string;
        const officeType = params['officeType'] as OfficeType;

        let filteredOffices = offices;

        if (cityId) {
          filteredOffices = filteredOffices.filter((office) => office.office_id === cityId);
        }

        switch (officeType) {
          case OfficeType.GIVE:
            return filteredOffices.filter((office) => office.give === '1');
          case OfficeType.GET:
            return filteredOffices.filter((office) => office.get === '1');
          case OfficeType.OFFICE:
            return filteredOffices.filter((office) => office.office_id === '1');
          case OfficeType.ANY:
          default:
            return filteredOffices;
        }
      }),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  // private initializeUrl(): void {
  //   const queryParams = this.route.snapshot.queryParams;
  //
  //   const { cityId, officeType, officeId } = queryParams;
  //
  //   this.initialPoint$.next(officeType || PointType.ANY);
  //
  //   if (cityId) {
  //     this.initCityFromUrl(cityId);
  //   } else {
  //     this.initialCity$.next(null);
  //   }
  //
  //   if (officeId) {
  //     this.initPointFromUrl(officeId);
  //   } else {
  //     this.activePoint$.next(null);
  //   }
  // }

  private initializeUrl(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((queryParams) => {
      const { cityId, officeType, officeId } = queryParams;

      this.initialOfficeType$.next(officeType || OfficeType.ANY);

      if (cityId) {
        this.initCityFromUrl(cityId);
      } else {
        this.initialCity$.next(null);
      }

      if (officeId) {
        this.initOfficeFromUrl(officeId);
      } else {
        this.activeOffice$.next(null);
      }
    });
  }

  private updateUrlWithFilter(filter: Filter): void {
    const queryParams: Partial<QueryParams> = {};

    queryParams[QUERY_PARAMS.CITY_ID] = filter.city ? filter.city.office_id : null;

    if (filter.officeType && filter.officeType !== OfficeType.ANY) {
      queryParams[QUERY_PARAMS.OFFICE_TYPE] = filter.officeType;
    }

    if (filter.officeType && filter.officeType === OfficeType.ANY) {
      queryParams[QUERY_PARAMS.OFFICE_TYPE] = null;
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

  private initOfficeFromUrl(id: string): void {
    this.offices$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((offices) => {
      const office = offices.find((office) => office.id === id);

      if (office) {
        this.activeOffice$.next(office);
      }
    });
  }

  getMapPoints(offices: Office[] | null): MapPoint[] {
    if (offices === this._lastOfficesRef) {
      return this._cachedMapPoints;
    }

    this._lastOfficesRef = offices;
    this._cachedMapPoints =
      offices?.map((office) => ({
        id: office.id,
        lat: office.geo_x,
        lng: office.geo_y,
      })) || [];

    return this._cachedMapPoints;
  }

  getMapPoint(office: Office | null): MapPoint | null {
    if (!office) return null;

    return {
      id: office.id,
      lat: office.geo_x,
      lng: office.geo_y,
    };
  }

  onOfficeSelect(officeId: string) {
    this.updateUrl({ officeId });
  }

  onCloseDetails(): void {
    this.updateUrl({ officeId: null });
    this.activeOffice$.next(null);
  }

  ngOnDestroy() {
    this._cachedMapPoints = [];
    this._lastOfficesRef = null;
  }
}
