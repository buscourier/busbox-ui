import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CargoType, CargoTypeId, type Order } from '@delivery/delivery-details/types';
import type {
  CalculationRequestParams,
  OrderAmountParams,
  TotalAmount,
  TotalAmountParams,
} from '@delivery/delivery-summary/types';
import { DeliveryBaseService } from '@delivery/services';
import type { Courier } from '@delivery/types';

@Injectable({
  providedIn: 'root',
})
export class DeliverySummaryService extends DeliveryBaseService {
  calculateTotalAmount(params: TotalAmountParams): Observable<TotalAmount> {
    return forkJoin(
      params.orders.map((order) =>
        this.calculateOrderAmount({
          pickupCityId: params.pickupCityId,
          deliveryCityId: params.deliveryCityId,
          pickupCourier: params.pickupCourier,
          deliveryCourier: params.deliveryCourier,
          order,
        }),
      ),
    ).pipe(
      map((results) => ({
        price: results.reduce((sum, { price }) => sum + +price, 0),
      })),
    );
  }

  calculateOrderAmount(params: OrderAmountParams): Observable<TotalAmount> {
    const servicesIds = this.getServicesIds(
      params.order,
      params.pickupCourier,
      params.deliveryCourier,
    );

    return params.order.cargoType === CargoType.PARCELS
      ? this.calculateParcelsAmount(params, servicesIds)
      : this.calculateCargoAmount(params, servicesIds);
  }

  private calculateParcelsAmount(
    params: OrderAmountParams,
    servicesIds: string[],
  ): Observable<TotalAmount> {
    if (!params.order.parcels?.items.length) {
      return of({ price: 0 });
    }

    return forkJoin([
      this.calculateParcelsWithoutServices(params),
      this.makeCalculationRequest({
        pickupCityId: params.pickupCityId,
        deliveryCityId: params.deliveryCityId,
        cargo: '0',
        servicesIds,
        weight: 0,
        dimensions: 0,
      }),
    ]).pipe(
      map((results) => ({
        price: results.reduce((sum, { price }) => sum + price, 0),
      })),
    );
  }

  private calculateCargoAmount(
    params: OrderAmountParams,
    servicesIds: string[],
  ): Observable<TotalAmount> {
    const order = params.order;

    return this.makeCalculationRequest({
      pickupCityId: params.pickupCityId,
      deliveryCityId: params.deliveryCityId,
      cargo: order.cargoType
        ? `${CargoTypeId[order.cargoType]}, ${this.getCargoQuantity(order)}`
        : '',
      servicesIds,
      weight: 0,
      dimensions: 0,
    });
  }

  private calculateParcelsWithoutServices(params: OrderAmountParams): Observable<TotalAmount> {
    const parcels = params.order.parcels!.items;

    return forkJoin(
      parcels.map((parcelItem) => {
        const dimensions =
          parcelItem.dimensions.width + parcelItem.dimensions.height + parcelItem.dimensions.length;

        return this.makeCalculationRequest({
          pickupCityId: params.pickupCityId,
          deliveryCityId: params.deliveryCityId,
          cargo: params.order.cargoType ? CargoTypeId[params.order.cargoType] : '',
          servicesIds: null,
          weight: parcelItem.weight,
          dimensions,
        }).pipe(map(({ price }) => price * parcelItem.quantity));
      }),
    ).pipe(
      map((prices) => ({
        price: prices.reduce((sum, price) => sum + price, 0),
      })),
    );
  }

  private getServicesIds(
    order: Order,
    pickupCourier: Courier | null,
    deliveryCourier: Courier | null,
  ): string[] {
    const services = this.getServices(order, pickupCourier, deliveryCourier);

    return services.map((service) => service.id);
  }

  private makeCalculationRequest(params: CalculationRequestParams): Observable<TotalAmount> {
    return this.http.get<TotalAmount>(
      `${this.baseUrl}/calc/${params.pickupCityId}/${params.deliveryCityId}/` +
        `${params.cargo}/${params.servicesIds}/${params.weight}/${params.dimensions}`,
    );
  }
}
