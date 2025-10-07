import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, type FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TUI_IS_MOBILE, type TuiStringHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapperComponent,
  TuiFilterByInputPipe,
  TuiSelect,
} from '@taiga-ui/kit';
import { distinctUntilChanged, type Observable, tap } from 'rxjs';
import { filter } from 'rxjs/operators';

import { cn } from '@core/utils';

import { LocationsFacade } from '@shared/store';
import type { DeliveryCity, PickupCity } from '@shared/types';

import type { RouteSelectorForm } from './route-selector.types';

@Component({
  selector: 'app-route-selector',
  imports: [
    AsyncPipe,
    FormsModule,
    TuiChevron,
    TuiDataListWrapperComponent,
    TuiTextfield,
    ReactiveFormsModule,
    TuiButton,
    TuiDropdownMobile,
    TuiComboBox,
    TuiFilterByInputPipe,
    TuiSelect,
  ],
  templateUrl: './route-selector.component.html',
  styleUrl: './route-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteSelectorComponent implements OnInit {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      'theme-yellow block flex-grow',

      'lg:max-w-[425px] xl:w-full xl:p-4',
      'lg:before:absolute lg:before:top-[140px] lg:before:right-[-62px]',
      'lg:before:-z-10 lg:before:h-[360px] lg:before:w-[600px]',
      "lg:before:bg-[url('./assets/images/home-bus.jpg')]",
      'lg:before:bg-size-[600px_360px] lg:before:bg-no-repeat',

      'xl:absolute xl:top-0 xl:right-0 xl:h-[1190px]',

      'xl:before:top-[142px] xl:before:right-[-155px] xl:before:w-[810px] xl:before:bg-size-[810px_380px]',
    );
  }

  form!: RouteSelectorForm;

  pickupCities$!: Observable<PickupCity[]>;
  deliveryCities$!: Observable<DeliveryCity[]>;

  protected stringify: TuiStringHandler<PickupCity | DeliveryCity> = (x) => `${x.name}`;
  protected readonly isMobile = inject(TUI_IS_MOBILE);

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly locationsFacade = inject(LocationsFacade);
  private readonly router = inject(Router);

  get pickupCity(): FormControl<PickupCity | null> {
    return this.form.controls.pickupCity;
  }

  get deliveryCity(): FormControl<DeliveryCity | null> {
    return this.form.controls.deliveryCity;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeCities();
  }

  getFormClasses(): string {
    return cn(
      'class="min-w-[360px] rounded-md bg-yellow-500 p-8 pb-10 md:p-6 md:pb-8 lg:p-8 lg:pb-12',
      'md:mx-0 md:max-w-full md:basis-1/2',
      'xl:sticky xl:top-22 xl:left-0 xl:z-10',
    );
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      pickupCity: this.fb.control<PickupCity | null>(null),
      deliveryCity: this.fb.control<DeliveryCity | null>({ value: null, disabled: true }),
    });
  }

  private initializeCities(): void {
    this.pickupCities$ = this.locationsFacade.getPickupCities();
    this.deliveryCities$ = this.locationsFacade.getDeliveryCities();

    this.pickupCity.valueChanges
      .pipe(
        filter(Boolean),
        distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
        tap((city) => this.onPickupCityChange(city)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private onPickupCityChange(city: PickupCity): void {
    this.locationsFacade.loadDeliveryCities(city.id);
    this.resetDeliveryCity();
  }

  private resetDeliveryCity(): void {
    this.deliveryCity.reset();

    if (this.deliveryCity.disabled) {
      this.deliveryCity.enable({ emitEvent: false });
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    const { pickupCity, deliveryCity } = this.form.getRawValue();

    if (pickupCity && deliveryCity) {
      this.router.navigate(['/delivery/calculator'], {
        queryParams: {
          pickupCityId: pickupCity.id,
          deliveryCityId: deliveryCity.id,
        },
      });
    }
  }
}
