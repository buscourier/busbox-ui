import { AsyncPipe } from '@angular/common';
import { HostBinding, type OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, type Observable, pairwise, startWith } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';

import { BreakpointService } from '@core/services/breakpoint.service';
import { CONTACT_INFO } from '@core/tokens';
import { cn } from '@core/utils';

import { MapComponent } from '@shared/components/map';
import { LocationsFacade } from '@shared/store';
import type { MapPoint, Office, PickupCity } from '@shared/types';

import { OfficeType } from '@contacts/types';

import {
  ContactInfoComponent,
  MobileTabsComponent,
  OfficeDetailsComponent,
  OfficeListComponent,
} from './components';
import { FilterComponent, type Filter } from './components/filter';

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

interface UrlState {
  cityId: string | null;
  officeType: OfficeType;
  officeId: string | null;
}

interface PageState {
  cities: PickupCity[];
  offices: Office[];
  urlState: UrlState;
  selectedCity: PickupCity | null;
  selectedOffice: Office | null;
  filteredOffices: Office[];
  mapPoints: MapPoint[];
  selectedMapPoint: MapPoint | null;
}

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
    MobileTabsComponent,
    ContactInfoComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent implements OnInit {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      `w-full md:h-[675px] md:pt-8`,
      `md:grid md:grid-cols-[400px_1fr] md:grid-rows-[auto_500px] md:content-start md:gap-2.5`,
    );
  }

  protected readonly breakpoint = inject(BreakpointService);
  protected readonly contact = inject(CONTACT_INFO);

  private readonly locationsFacade = inject(LocationsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly mobileTabIndex$ = this.route.queryParams.pipe(
    map((params) => {
      const tab = params['tab'];
      return tab === 'list' ? 1 : 0;
    }),
    startWith(0),
  );

  private readonly pageState$: Observable<PageState> = combineLatest({
    cities: this.locationsFacade.getPickupCities(),
    offices: this.locationsFacade.getOffices(),
    queryParams: this.route.queryParams,
  }).pipe(
    filter(({ cities, offices }) => cities.length > 0 && offices.length > 0),
    map(({ cities, offices, queryParams }) => {
      const urlState: UrlState = {
        cityId: queryParams['cityId'] || null,
        officeType: queryParams['officeType'] || OfficeType.ANY,
        officeId: queryParams['officeId'] || null,
      };

      const selectedCity = urlState.cityId
        ? cities.find((city) => city.office_id === urlState.cityId) || null
        : null;

      const filteredOffices = this.filterOffices(offices, urlState);

      const selectedOffice = urlState.officeId
        ? offices.find((office) => office.id === urlState.officeId) || null
        : null;

      const mapPoints = filteredOffices.map((office) => ({
        id: office.id,
        lat: office.geo_x,
        lng: office.geo_y,
      }));

      // Point of selected office
      const selectedMapPoint = selectedOffice
        ? {
            id: selectedOffice.id,
            lat: selectedOffice.geo_x,
            lng: selectedOffice.geo_y,
          }
        : null;

      return {
        cities,
        offices,
        urlState,
        selectedCity,
        selectedOffice,
        filteredOffices,
        mapPoints,
        selectedMapPoint,
      };
    }),
    shareReplay(1),
    takeUntilDestroyed(this.destroyRef),
  );

  readonly cities$ = this.pageState$.pipe(map((state) => state.cities));
  readonly initialCity$ = this.pageState$.pipe(map((state) => state.selectedCity));
  readonly initialOfficeType$ = this.pageState$.pipe(map((state) => state.urlState.officeType));
  readonly activeOffice$ = this.pageState$.pipe(map((state) => state.selectedOffice));
  readonly filteredOffices$ = this.pageState$.pipe(map((state) => state.filteredOffices));
  readonly mapPoints$ = this.pageState$.pipe(map((state) => state.mapPoints));
  readonly selectedMapPoint$ = this.pageState$.pipe(map((state) => state.selectedMapPoint));

  ngOnInit(): void {
    this.setupOfficeDetailsClose();
  }

  private setupOfficeDetailsClose(): void {
    this.pageState$
      .pipe(
        map((state) => ({
          cityId: state.urlState.cityId,
          officeType: state.urlState.officeType,
        })),
        distinctUntilChanged((a, b) => a.cityId === b.cityId && a.officeType === b.officeType),
        startWith(null),
        pairwise(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([prev, curr]) => {
        if (prev !== null && curr !== null) {
          const currentOfficeId = this.route.snapshot.queryParams['officeId'];
          if (currentOfficeId) {
            this.updateUrl({ officeId: null });
          }
        }
      });
  }

  private filterOffices(offices: Office[], urlState: UrlState): Office[] {
    let filtered = offices;

    if (urlState.cityId) {
      filtered = filtered.filter((office) => office.office_id === urlState.cityId);
    }

    switch (urlState.officeType) {
      case OfficeType.GIVE:
        return filtered.filter((office) => office.give === '1');
      case OfficeType.GET:
        return filtered.filter((office) => office.get === '1');
      case OfficeType.OFFICE:
        return filtered.filter((office) => office.office_id === '1');
      case OfficeType.ANY:
      default:
        return filtered;
    }
  }

  private updateUrl(params: Partial<QueryParams>): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: false,
    });
  }

  onMobileTabChange(tab: string): void {
    this.router.navigate([], {
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  setFilter(filter: Filter): void {
    const queryParams: Partial<QueryParams> = {
      [QUERY_PARAMS.CITY_ID]: filter.city ? filter.city.office_id : null,
      [QUERY_PARAMS.OFFICE_TYPE]:
        filter.officeType && filter.officeType !== OfficeType.ANY ? filter.officeType : null,
    };

    this.updateUrl(queryParams);
  }

  onOfficeSelect(officeId: string): void {
    this.updateUrl({ [QUERY_PARAMS.OFFICE_ID]: officeId });
  }

  onCloseDetails(): void {
    this.updateUrl({ [QUERY_PARAMS.OFFICE_ID]: null });
  }
}
