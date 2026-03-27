import { AsyncPipe, DOCUMENT } from '@angular/common';
import { afterNextRender, HostBinding, type OnInit, signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import type { TuiStringHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiPopup, TuiTextfield, TuiTextfieldComponent } from '@taiga-ui/core';
import {
  TuiBadge,
  TuiChevron,
  TuiDataListWrapperComponent,
  TuiDrawer,
  TuiSelectDirective,
} from '@taiga-ui/kit';
import { filter, type Observable, pairwise, startWith } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';

import { BreakpointService } from '@core/services/breakpoint.service';
import { CONTACT_INFO } from '@core/tokens';
import { cn } from '@core/utils';

import { MapComponent } from '@shared/components/map';
import { PageLayoutComponent } from '@shared/layouts/page-layout';
import type { Office } from '@shared/types';

import { LocationsFacade } from '@store';

import { OfficeType } from '@contacts/types';

import { ContactInfoComponent, OfficeDetailsComponent } from './components';
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
  offices: Office[];
  urlState: UrlState;
  selectedOffice: Office | null;
  filteredOffices: Office[];
}

@Component({
  selector: 'app-contacts',
  imports: [
    MapComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    FilterComponent,
    OfficeDetailsComponent,
    ContactInfoComponent,
    TuiDrawer,
    TuiPopup,
    TuiButton,
    TuiIcon,
    TuiBadge,
    TuiChevron,
    TuiDataListWrapperComponent,
    TuiDropdownMobile,
    TuiSelectDirective,
    TuiTextfieldComponent,
    TuiTextfield,
    PageLayoutComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent implements OnInit {
  private readonly doc = inject(DOCUMENT);

  @HostBinding('class') get hostClasses(): string {
    return cn(`flex h-[calc(100vh-160px)] w-full`);
  }

  scrollTop = 0;

  constructor() {
    afterNextRender(() => {
      const win = this.doc.defaultView;
      if (!win) return;

      const handleScroll = () => {
        this.scrollTop = win.pageYOffset || this.doc.documentElement.scrollTop;
      };

      win.addEventListener('scroll', handleScroll, { passive: true });

      this.destroyRef.onDestroy(() => {
        win.removeEventListener('scroll', handleScroll);
      });
    });
  }

  protected selectedOffice = new FormControl<Office | null>(null);
  protected readonly breakpoint = inject(BreakpointService);
  protected readonly contact = inject(CONTACT_INFO);
  protected readonly detailsOpen = signal(false);

  private readonly locationsFacade = inject(LocationsFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly pageState$: Observable<PageState> = combineLatest({
    offices: this.locationsFacade.getOffices(),
    queryParams: this.route.queryParams,
  }).pipe(
    filter(({ offices }) => offices.length > 0),
    map(({ offices, queryParams }) => {
      const urlState: UrlState = {
        cityId: queryParams['cityId'] || null,
        officeType: queryParams['officeType'] || OfficeType.ANY,
        officeId: queryParams['officeId'] || null,
      };

      const filteredOffices = this.filterOffices(offices, urlState);

      const selectedOffice = urlState.officeId
        ? offices.find((office) => office.id === urlState.officeId) || null
        : null;

      return {
        offices,
        urlState,
        selectedOffice,
        filteredOffices,
      };
    }),
    shareReplay(1),
    takeUntilDestroyed(this.destroyRef),
  );

  readonly initialOfficeType$ = this.pageState$.pipe(map((state) => state.urlState.officeType));
  readonly offices$ = this.pageState$.pipe(map((state) => state.offices));
  readonly filteredOffices$ = this.pageState$.pipe(map((state) => state.filteredOffices));

  ngOnInit(): void {
    this.selectedOffice.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((office) => {
        if (office) {
          this.onOfficeSelect(office.id);
        }
      });

    // this.setupOfficeDetailsClose();
    this.setupSelectedOfficeSync();
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

  private setupSelectedOfficeSync(): void {
    this.pageState$
      .pipe(
        map((state) => state.selectedOffice),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((selectedOffice) => {
        this.selectedOffice.setValue(selectedOffice, { emitEvent: false });
      });
  }

  private filterOffices(offices: Office[], urlState: UrlState): Office[] {
    const filtered = offices;

    // if (urlState.cityId) {
    //   filtered = filtered.filter((office) => office.office_id === urlState.cityId);
    // }

    switch (urlState.officeType) {
      case OfficeType.GIVE:
        return filtered.filter((office) => office.give === '1' && office.get === '1');
      case OfficeType.GET:
        return filtered.filter((office) => office.get === '1' && office.give === '0');
      // case OfficeType.OFFICE:
      //   return filtered.filter((office) => office.office_id === '1');
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

  setFilter(filter: Filter): void {
    const queryParams: Partial<QueryParams> = {
      [QUERY_PARAMS.CITY_ID]: filter.city ? filter.city.office_id : null,
      [QUERY_PARAMS.OFFICE_TYPE]:
        filter.officeType && filter.officeType !== OfficeType.ANY ? filter.officeType : null,
      [QUERY_PARAMS.OFFICE_ID]: null,
    };

    this.updateUrl(queryParams);
  }

  onOfficeSelect(officeId: string): void {
    this.updateUrl({ [QUERY_PARAMS.OFFICE_ID]: officeId });
  }

  onCloseDetails(): void {
    // this.updateUrl({ [QUERY_PARAMS.OFFICE_ID]: null, [QUERY_PARAMS.OFFICE_TYPE]: null });
    this.updateUrl({ [QUERY_PARAMS.OFFICE_ID]: null });
  }

  closeDetails(): void {
    this.detailsOpen.set(false);
  }

  onMapPointFocus(id: string) {
    this.onOfficeSelect(id);
  }

  protected stringify: TuiStringHandler<Office> = (x) => `${x.name} (${x.address})`;
}
