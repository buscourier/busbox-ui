import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideTranslocoScope, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TuiDropdownMobile, TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TUI_IS_MOBILE, TuiDay, type TuiStringHandler } from '@taiga-ui/cdk';
import { TuiAlertService, TuiButton, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiComboBox,
  type TuiConfirmData,
  TuiFieldErrorContentPipe,
  TuiFilterByInputPipe,
  TuiInputDate,
  TuiSelect,
  TuiSkeleton,
} from '@taiga-ui/kit';
import { TUI_CONFIRM, TUI_VALIDATION_ERRORS, TuiDataListWrapper } from '@taiga-ui/kit';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  merge,
  of,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fadeSlideAnimation } from '@core/animations';

import type { Office, PickupCity } from '@shared/types';
import { FormControlStatus } from '@shared/types';

import { CourierDetailsComponent } from '@delivery/base/courier-details';
import { DeliveryPointFacade } from '@delivery/delivery-point';
import type { CourierDetails } from '@delivery/types';

import { pickupPointValidationErrors } from './pickup-point.constants';
import { PickupPointFacade } from './pickup-point.facade';
import type { PickupPointControlValues, PickupPointForm, ResetConfig } from './pickup-point.types';
import { PickupPointTabType, type PickupPointViewModel } from './types';

@Component({
  selector: 'app-pickup-point',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiDataListWrapper,
    CourierDetailsComponent,
    TuiSkeleton,
    TuiIcon,
    TuiHint,
    TranslocoPipe,
    TuiButton,
    TuiFieldErrorContentPipe,
    TuiTextfield,
    TuiChevron,
    TuiComboBox,
    TuiFilterByInputPipe,
    TuiDropdownMobile,
    TuiSelect,
    TuiInputDate,
  ],
  templateUrl: './pickup-point.component.html',
  styleUrl: './pickup-point.component.css',
  animations: [fadeSlideAnimation],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: pickupPointValidationErrors,
      deps: [TranslocoService],
    },
    provideTranslocoScope({
      scope: 'features/delivery/pickup-point',
      alias: 'pickupPoint',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PickupPointComponent implements OnInit {
  vm$!: Observable<PickupPointViewModel>;
  form!: PickupPointForm;
  protected readonly TabType = PickupPointTabType;
  protected stringifyCity: TuiStringHandler<PickupCity> = (x) => `${x.name}`;
  protected stringifyOffice: TuiStringHandler<Office> = (x) => `${x.address}`;
  protected readonly isMobile = inject(TUI_IS_MOBILE);
  protected readonly today = TuiDay.currentLocal();
  protected readonly min = new TuiDay(this.today.year, this.today.month, this.today.day);

  private readonly alerts = inject(TuiAlertService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogs = inject(TuiResponsiveDialogService);
  private readonly pickupPointFacade = inject(PickupPointFacade);
  private deliveryPointFacade = inject(DeliveryPointFacade);
  private transloco = inject(TranslocoService);

  get city(): FormControl<PickupCity | null> {
    return this.form.controls.city;
  }

  get office(): FormControl<Office | null> {
    return this.form.controls.office;
  }

  get courierPoint(): FormControl<CourierDetails | null> {
    return this.form.controls.courierPoint;
  }

  get departureDate(): FormControl<string | null> {
    return this.form.controls.departureDate;
  }

  get minDate(): TuiDay {
    return TuiDay.currentLocal();
  }

  ngOnInit(): void {
    this.vm$ = this.pickupPointFacade.getViewModel();
    this.pickupPointFacade.init();

    this.initForm();
    this.setupFormSync();
    this.setupStoreSync();
    this.setupFormState();
    this.syncFormWithStore();
    this.setupErrorHandling();
  }

  onTabChange(activeTabId: PickupPointTabType): void {
    this.pickupPointFacade.setActiveTab(activeTabId);
  }

  private initForm(): void {
    this.form = this.fb.group({
      city: this.fb.control<PickupCity | null>(null, [Validators.required]),
      office: this.fb.control<Office | null>(null, Validators.required),
      courierPoint: this.fb.control<CourierDetails | null>(null, Validators.required),
      departureDate: this.fb.control<string | null>(null, Validators.required),
    });

    this.vm$
      .pipe(
        map((vm) => vm.cities),
        map((cities) => cities.items.length > 0),
        distinctUntilChanged(),
        tap((hasCities) =>
          hasCities
            ? this.city.enable({ emitEvent: false })
            : this.city.disable({ emitEvent: false }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.setupTabChangeReset();
  }

  private setupErrorHandling(): void {
    this.vm$
      .pipe(
        map((vm) => vm.error),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((error) => {
        if (error.hasAnyError) {
          this.showErrorNotification(
            this.transloco.translate('features.delivery.pickupPoint.errors.loading'),
          );
        }
      });
  }

  private setupTabChangeReset(): void {
    this.vm$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((vm) => vm.activeTab?.id),
        distinctUntilChanged(),
        filter(Boolean),
        map((tabId) => this.getResetConfig(tabId)),
      )
      .subscribe(({ control, reset }) => {
        control.reset();
        reset();
      });
  }

  private setupFormSync(): void {
    this.city.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean),
        withLatestFrom(
          this.pickupPointFacade.getSelectedCity(),
          this.deliveryPointFacade.isFormValid(),
        ),
        switchMap(([newCity, currentCity, isDeliveryFormValid]) => {
          if (!currentCity || newCity.id === currentCity.id) {
            return of({ newCity, currentCity, isConfirmed: true });
          }

          if (!isDeliveryFormValid) {
            return of({ newCity, currentCity, isConfirmed: true });
          }

          return this.confirmNewCity().pipe(
            map((isConfirmed) => ({ newCity, currentCity, isConfirmed })),
          );
        }),
      )
      .subscribe(({ newCity, currentCity, isConfirmed }) => {
        if (isConfirmed) {
          this.pickupPointFacade.selectCity(newCity);
        } else {
          this.city.patchValue(currentCity, { emitEvent: false });
        }
      });

    this.office.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe((office) => {
        this.pickupPointFacade.selectOffice(office);
      });

    this.courierPoint.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe((courierDetails) => {
        this.pickupPointFacade.updateCourierDetails(courierDetails);
      });

    this.departureDate.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe((date) => {
        this.pickupPointFacade.setDepartureDate(date);
      });
  }

  private setupStoreSync(): void {
    merge(
      this.vm$.pipe(
        map((vm) => vm.cities.selected),
        distinctUntilChanged(),
        tap((city) => this.patchFormControl('city', city)),
      ),
      this.vm$.pipe(
        map((vm) => vm.offices.selected),
        distinctUntilChanged(),
        tap((office) => this.patchFormControl('office', office)),
      ),
      this.vm$.pipe(
        map((vm) => vm.courierDetails),
        distinctUntilChanged(),
        tap((courierPoint) => this.patchFormControl('courierPoint', courierPoint)),
      ),
      this.vm$.pipe(
        map((vm) => vm.departureDate),
        distinctUntilChanged(),
        tap((date) => this.patchFormControl('departureDate', date)),
      ),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private setupFormState(): void {
    const formChanges$ = this.form.statusChanges.pipe(startWith(this.form.status));
    const tabChanges$ = this.vm$.pipe(
      map((vm) => vm.activeTab?.id),
      filter(Boolean),
    );

    combineLatest([formChanges$, tabChanges$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(([, activeTabId]) => {
          const requiredControls = this.getRequiredControls(activeTabId);

          const hasPending = requiredControls.some((control) => control.pending);
          const hasDisabled = requiredControls.some((control) => control.disabled);

          let status;

          if (hasDisabled) {
            status = FormControlStatus.DISABLED;
          } else if (hasPending) {
            status = FormControlStatus.PENDING;
          } else {
            status = requiredControls.every((control) => control.valid)
              ? FormControlStatus.VALID
              : FormControlStatus.INVALID;
          }

          return { status };
        }),
        distinctUntilChanged((prev, curr) => prev.status === curr.status),
      )
      .subscribe(({ status }) => {
        return this.pickupPointFacade.setFormState(
          status,
          this.form.pristine,
          this.form.touched,
          this.form.dirty,
        );
      });
  }

  private syncFormWithStore(): void {
    this.vm$
      .pipe(
        map((vm) => vm.form),
        distinctUntilChanged(
          (prev, curr) =>
            prev.pristine === curr.pristine &&
            prev.touched === curr.touched &&
            prev.dirty === curr.dirty,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((formStatus) => {
        if (formStatus.pristine && !this.form.pristine) {
          this.form.markAsPristine();
        }
        if (!formStatus.touched && this.form.touched) {
          this.form.markAsUntouched();
        }
        if (!formStatus.dirty && this.form.dirty) {
          this.form.markAsPristine();
        }
      });
  }

  private getRequiredControls(activeTabId: PickupPointTabType | null): FormControl[] {
    const baseControls = [this.city, this.departureDate];
    const tabControl = activeTabId === PickupPointTabType.OFFICE ? this.office : this.courierPoint;

    return [...baseControls, tabControl];
  }

  private patchFormControl<K extends keyof PickupPointControlValues>(
    controlName: K,
    value: PickupPointControlValues[K],
  ): void {
    const control = this.form.controls[controlName] as FormControl<PickupPointControlValues[K]>;

    if (control.value !== value) {
      control.patchValue(value, { emitEvent: false });
    }
  }

  private getResetConfig(tabId: PickupPointTabType): ResetConfig {
    switch (tabId) {
      case PickupPointTabType.OFFICE:
        return {
          control: this.courierPoint,
          reset: () => this.pickupPointFacade.resetCourierDetails(),
        };
      case PickupPointTabType.COURIER:
        return {
          control: this.office,
          reset: () => this.pickupPointFacade.resetOffice(),
        };
      default:
        throw new Error(
          `${this.transloco.translate('features.delivery.pickupPoint.errors.tabType')}: ${tabId}`,
        );
    }
  }

  private showErrorNotification(message: string): void {
    this.alerts
      .open(message, {
        label: this.transloco.translate('common.alert.labels.error'),
        autoClose: 0,
        appearance: 'error',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private confirmNewCity(): Observable<boolean> {
    const confirmData: TuiConfirmData = {
      content: this.transloco.translate('confirm.messages.orderDeletion'),
      yes: this.transloco.translate('confirm.buttons.yes'),
      no: this.transloco.translate('confirm.buttons.no'),
    };

    return this.dialogs.open<boolean>(TUI_CONFIRM, {
      label: this.transloco.translate('confirm.labels.areYouSure'),
      size: 's',
      data: confirmData,
    });
  }
}
