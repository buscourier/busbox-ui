import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { DeliveryCity, PickupCity } from '@shared/types';

import type { Order, Parcels } from '@delivery/delivery-details/types';
import { CargoType, CargoTypeId } from '@delivery/delivery-details/types';
import { DeliveryBaseService } from '@delivery/services';
import type { Courier } from '@delivery/types';

import type { BookingResult, Departure, Destination } from '../types';

interface Booking {
  pickupCity: PickupCity | null;
  pickupCourier: Courier | null;
  deliveryCity: DeliveryCity | null;
  deliveryCourier: Courier | null;
  departureDate: string | null;
  departure: Departure | null;
  destination: Destination | null;
  order: Order;
  note: string;
}

interface ParcelDimensions {
  count: number;
  weight: number;
  width: number;
  height: number;
  length: number;
}

interface OrderResponse {
  order_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService extends DeliveryBaseService {
  submitOrder(booking: Booking): Observable<BookingResult> {
    const requestData = this.mapToRequestData(booking);

    return this.http.post<OrderResponse>(`${this.baseUrl}/order/`, requestData).pipe(
      map((response) => ({
        orderId: response.order_id,
      })),
    );
  }

  private mapToRequestData(data: Booking) {
    const {
      pickupCity,
      deliveryCity,
      departureDate,
      departure,
      destination,
      order,
      note,
      pickupCourier,
      deliveryCourier,
    } = data;

    const { sender } = departure!;
    const { recipient } = destination!;

    return {
      start_city: pickupCity!.id,
      end_city: deliveryCity!.id,
      sending_date: departureDate,
      sender_name: sender!.fullName,
      sender_phone: sender!.phone,
      sender_passport: sender!.documentNumber,
      recipient_name: recipient!.fullName,
      recipient_phone: recipient!.phone,
      orders: [
        {
          cargo_type: order.cargoType ? CargoTypeId[order.cargoType] : null,
          cargo_count: this.getCargoQuantity(order),
          dimensions:
            order.cargoType === CargoType.PARCELS ? this.mapParcelsDimensions(order.parcels) : null,
          services: this.getServices(order, pickupCourier, deliveryCourier),
        },
      ],
      note,
      server: 'test',
    };
  }

  mapParcelsDimensions(data: Parcels | null): ParcelDimensions[] | null {
    if (!data?.items.length) return null;

    return data.items.map((item) => ({
      count: item.quantity,
      weight: item.weight,
      width: item.dimensions.width,
      height: item.dimensions.height,
      length: item.dimensions.length,
    }));
  }
}
