import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  type OnInit,
} from '@angular/core';
import { FormBuilder, type FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiLabel, TuiSelect, TuiTextfield } from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiChevron,
  TuiDataListWrapperComponent,
  TuiStringifyContentPipe,
  TuiStringifyPipe,
} from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

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
    TuiLabel,
    TuiSelect,
    TuiStringifyContentPipe,
    TuiTextfield,
    ReactiveFormsModule,
    TuiStringifyPipe,
    TuiButton,
    TuiButtonLoading,
  ],
  templateUrl: './route-selector.component.html',
  styleUrl: './route-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteSelectorComponent implements OnInit {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      'theme-yellow mx-auto block',

      'lg:max-w-[375px]',
      'lg:before:absolute lg:before:top-[140px] lg:before:right-[-62px]',
      'lg:before:-z-10 lg:before:h-[360px] lg:before:w-[600px]',
      "lg:before:bg-[url('./assets/images/home-bus.jpg')]",
      'lg:before:bg-size-[600px_360px] lg:before:bg-no-repeat',

      'xl:absolute xl:top-0 xl:right-0 xl:h-[1190px]',

      'xl:before:top-[142px] xl:before:right-[-205px] xl:before:w-[810px] xl:before:bg-size-[810px_360px]',
    );
  }

  form!: RouteSelectorForm;

  pickupCities$!: Observable<PickupCity[]>;
  deliveryCities$!: Observable<DeliveryCity[]>;

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly locationsFacade = inject(LocationsFacade);

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
      'class="mx-auto w-auto w-full min-w-[360px] max-w-md rounded-md bg-yellow-500 p-12 pb-14',
      'md:mx-0 md:max-w-full md:basis-1/2 md:p-11 md:pb-12',
      'xl:sticky xl:top-22 xl:left-0 xl:z-10',
    );
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      pickupCity: this.fb.control<PickupCity | null>(null),
      deliveryCity: this.fb.control<DeliveryCity | null>(null),
    });
  }

  private initializeCities(): void {
    this.pickupCities$ = this.locationsFacade.getPickupCities();
    this.deliveryCities$ = this.locationsFacade.getDeliveryCities();
  }

  onSubmit() {
    console.log('routes submit');
  }
}
