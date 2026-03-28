import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideTranslocoScope, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TuiDropdownMobile, TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TUI_IS_MOBILE, type TuiStringHandler } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiError,
  TuiHint,
  TuiIcon,
  TuiTextfield,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import {
  TuiChevron,
  TuiComboBox,
  type TuiConfirmData,
  TuiFieldErrorContentPipe,
  TuiFilterByInputPipe,
  TuiSelectDirective,
} from '@taiga-ui/kit';
import {
  TUI_CONFIRM,
  TUI_VALIDATION_ERRORS,
  TuiCheckbox,
  TuiDataListWrapper,
  TuiFieldErrorPipe,
  TuiSkeleton,
} from '@taiga-ui/kit';
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

import { type DeliveryCity, FormControlStatus, type Office, type PickupCity } from '@shared/types';

import { CourierDetailsComponent } from '@delivery/base/courier-details';
import { DeliveryDetailsFacade } from '@delivery/delivery-details';
import type { CourierDetails } from '@delivery/types';

import { deliveryPointValidationErrors } from './delivery-point.constants';
import { DeliveryPointFacade } from './delivery-point.facade';
import type {
  DeliveryPointControlValues,
  DeliveryPointForm,
  ResetConfig,
} from './delivery-point.types';
import { DeliveryPointTabType, type DeliveryPointViewModel } from './types';

@Component({
  selector: 'app-delivery-point',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiDataListWrapper,
    TuiError,
    TuiFieldErrorPipe,
    CourierDetailsComponent,
    TuiCheckbox,
    TuiSkeleton,
    TuiIcon,
    TranslocoPipe,
    TuiFieldErrorContentPipe,
    TuiHint,
    TuiButton,
    TuiChevron,
    TuiComboBox,
    TuiDropdownMobile,
    TuiFilterByInputPipe,
    TuiTextfieldComponent,
    TuiTextfield,
    TuiSelectDirective,
  ],
  templateUrl: './delivery-point.component.html',
  styleUrl: './delivery-point.component.css',
  animations: [fadeSlideAnimation],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: deliveryPointValidationErrors,
      deps: [TranslocoService],
    },
    provideTranslocoScope({
      scope: 'features/delivery/delivery-point',
      alias: 'deliveryPoint',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryPointComponent implements OnInit {
  vm$!: Observable<DeliveryPointViewModel>;
  form!: DeliveryPointForm;
  protected readonly TabType = DeliveryPointTabType;
  protected stringifyCity: TuiStringHandler<PickupCity> = (x) => `${x.name}`;
  protected stringifyOffice: TuiStringHandler<Office> = (x) => `${x.address}`;
  protected readonly isMobile = inject(TUI_IS_MOBILE);

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogs = inject(TuiResponsiveDialogService);
  private readonly deliveryPointFacade = inject(DeliveryPointFacade);
  private readonly deliveryDetailsFacade = inject(DeliveryDetailsFacade);
  private transloco = inject(TranslocoService);

  get city(): FormControl<DeliveryCity | null> {
    return this.form.controls.city;
  }

  get office(): FormControl<Office | null> {
    return this.form.controls.office;
  }

  get courierDetails(): FormControl<CourierDetails | null> {
    return this.form.controls.courierDetails;
  }

  get busPickup(): FormControl<boolean> {
    return this.form.controls.busPickup;
  }

  ngOnInit(): void {
    this.vm$ = this.deliveryPointFacade.getViewModel();

    this.initForm();
    this.setupFormSync();
    this.setupStoreSync();
    this.setupFormState();
    this.syncFormWithStore();
  }

  onTabChange(activeTabId: DeliveryPointTabType): void {
    this.deliveryPointFacade.setActiveTab(activeTabId);
  }

  private initForm(): void {
    this.form = this.fb.group({
      city: this.fb.control<DeliveryCity | null>(null, [Validators.required]),
      office: this.fb.control<Office | null>(null, [Validators.required]),
      courierDetails: this.fb.control<CourierDetails | null>(null, [Validators.required]),
      busPickup: this.fb.control<boolean>(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
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

  private setupTabChangeReset(): void {
    this.vm$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((vm) => vm.activeTab?.id),
        distinctUntilChanged(),
        filter(Boolean),
        map((tabId) => this.getResetConfig(tabId)),
      )
      .subscribe(({ controls, reset }) => {
        controls.forEach((control) => control.reset());
        reset();
      });
  }

  private setupFormSync(): void {
    this.city.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean),
        withLatestFrom(
          this.vm$.pipe(map((vm) => vm.cities.selected)),
          this.deliveryDetailsFacade.isActiveOrderValid(),
        ),
        switchMap(([newCity, currentCity, isActiveOrderValid]) => {
          if (!currentCity || newCity.id === currentCity.id) {
            return of({ newCity, currentCity, isConfirmed: true });
          }

          if (!isActiveOrderValid) {
            return of({ newCity, currentCity, isConfirmed: true });
          }

          return this.confirmNewCity().pipe(
            map((isConfirmed) => ({ newCity, currentCity, isConfirmed })),
          );
        }),
      )
      .subscribe(({ newCity, currentCity, isConfirmed }) => {
        if (isConfirmed) {
          this.deliveryPointFacade.selectCity(newCity);
        } else {
          this.city.patchValue(currentCity, { emitEvent: false });
        }
      });

    this.office.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe((office) => this.deliveryPointFacade.selectOffice(office));

    this.courierDetails.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe((courierDetails) => this.deliveryPointFacade.updateCourierDetails(courierDetails));

    this.busPickup.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((enabled) => this.deliveryPointFacade.setBusPickup(enabled));
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
        tap((courierDetails) => this.patchFormControl('courierDetails', courierDetails)),
      ),
      this.vm$.pipe(
        map((vm) => vm.busPickup),
        distinctUntilChanged(),
        tap((enabled) => this.patchFormControl('busPickup', enabled)),
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

          const isValid = status === FormControlStatus.VALID;

          return { isValid, status };
        }),
        distinctUntilChanged(
          (prev, curr) => prev.isValid === curr.isValid && prev.status === curr.status,
        ),
      )
      .subscribe(({ status }) => {
        return this.deliveryPointFacade.setFormState(
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

  private getRequiredControls(activeTabId: DeliveryPointTabType | null): FormControl[] {
    const tabControl =
      activeTabId === DeliveryPointTabType.OFFICE
        ? this.office
        : activeTabId === DeliveryPointTabType.BUS
          ? this.busPickup
          : this.courierDetails;

    return [this.city, tabControl];
  }

  private patchFormControl<K extends keyof DeliveryPointControlValues>(
    controlName: K,
    value: DeliveryPointControlValues[K],
  ): void {
    const control = this.form.controls[controlName] as FormControl<DeliveryPointControlValues[K]>;

    if (control.value !== value) {
      control.patchValue(value, { emitEvent: false });
    }
  }

  private getResetConfig(tabId: DeliveryPointTabType): ResetConfig {
    switch (tabId) {
      case DeliveryPointTabType.OFFICE:
        return {
          controls: [this.courierDetails, this.busPickup],
          reset: () => {
            this.deliveryPointFacade.resetCourierDetails();
            this.deliveryPointFacade.setBusPickup(false);
          },
        };
      case DeliveryPointTabType.COURIER:
        return {
          controls: [this.office, this.busPickup],
          reset: () => {
            this.deliveryPointFacade.resetOffice();
            this.deliveryPointFacade.setBusPickup(false);
          },
        };
      case DeliveryPointTabType.BUS:
        return {
          controls: [this.courierDetails, this.office],
          reset: () => {
            this.deliveryPointFacade.resetCourierDetails();
            this.deliveryPointFacade.resetOffice();
            this.deliveryPointFacade.setBusPickup(true);
          },
        };
      default:
        throw new Error(`${this.transloco.translate('deliveryPoint.errors.tabType')}: ${tabId}`);
    }
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
