import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideTranslocoScope } from '@jsverse/transloco';
import { TuiSkeleton } from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

import {
  AdditionalServicesComponent,
  AutoPartsComponent,
  CargoPickerComponent,
  DocumentsComponent,
  OrderTabsComponent,
  OtherCargoComponent,
  PackagingComponent,
  ParcelsComponent,
} from './components';
import { cargoSwitchAnimation } from './delivery-details.animations';
import { DeliveryDetailsFacade } from './delivery-details.facade';
import type { OrderDataKeys } from './delivery-details.types';
import type { Order, OrderValidationState, DeliveryDetailsViewModel } from './types';
import { CargoType } from './types';

@Component({
  selector: 'app-delivery-details',
  imports: [
    AsyncPipe,
    OrderTabsComponent,
    CargoPickerComponent,
    ParcelsComponent,
    AutoPartsComponent,
    OtherCargoComponent,
    DocumentsComponent,
    AdditionalServicesComponent,
    PackagingComponent,
    TuiSkeleton,
  ],
  templateUrl: './delivery-details.component.html',
  styleUrl: './delivery-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideTranslocoScope({
      scope: 'features/delivery/delivery-details',
      alias: 'deliveryDetails',
    }),
  ],
  animations: [cargoSwitchAnimation],
  host: {
    class: 'block mt-16',
  },
})
export class DeliveryDetailsComponent implements OnInit {
  vm$!: Observable<DeliveryDetailsViewModel>;

  protected readonly MAX_ORDERS = 1;
  protected readonly CargoType = CargoType;

  private readonly deliveryDetailsFacade = inject(DeliveryDetailsFacade);

  ngOnInit(): void {
    this.vm$ = this.deliveryDetailsFacade.getViewModel();
  }

  addOrder(): void {
    this.deliveryDetailsFacade.addOrder();
  }

  removeOrder(orderId: string): void {
    this.deliveryDetailsFacade.removeOrder(orderId);
  }

  setActiveOrder(orderId: string): void {
    this.deliveryDetailsFacade.setActiveOrder(orderId);
  }

  setCargoType(orderId: string, cargoType: CargoType): void {
    this.deliveryDetailsFacade.setCargoType(orderId, cargoType);
  }

  updateOrderData(orderId: string, type: OrderDataKeys, data: Order[OrderDataKeys]): void {
    this.deliveryDetailsFacade.updateOrderData(orderId, type, data);
  }

  updateOrderValidation(orderId: string, type: keyof OrderValidationState, isValid: boolean) {
    this.deliveryDetailsFacade.updateOrderValidation(orderId, type, isValid);
  }
}
