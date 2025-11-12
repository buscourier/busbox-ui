import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { DeliveryCity, PickupCity } from '@shared/types';

import type { AuthResponse } from '@auth/types';

import type { AutoParts, Order, Parcels } from '@delivery/delivery-details/types';
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
  currentUser: AuthResponse | null;
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
  sending_date: number;
  start_city: string;
  end_city: string;
}

interface SenderFields {
  sender_name: string;
  sender_phone: string;
  sender_passport: string;
  sender_id?: string;
  sender_company?: string;
  sender_type?: string;
}

const AUTO_PARTS_EXT_TYPE = '24';

@Injectable({
  providedIn: 'root',
})
export class BookingService extends DeliveryBaseService {
  submitOrder(booking: Booking): Observable<BookingResult> {
    const requestData = this.mapToRequestData(booking);

    return this.http.post<OrderResponse>(`${this.baseUrl}/order/`, requestData).pipe(
      map((response) => ({
        orderId: response.order_id,
        sendingDate: response.sending_date,
        startCity: response.start_city,
        endCity: response.end_city,
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
      currentUser,
    } = data;

    const { sender } = departure!;
    const { recipient } = destination!;

    let senderFields: SenderFields = {
      sender_name: sender!.fullName,
      sender_phone: sender!.phone,
      sender_passport: sender!.documentNumber,
    };

    if (currentUser) {
      senderFields = {
        ...senderFields,
        sender_id: currentUser.id,
        sender_company: currentUser.user_name,
        sender_type: currentUser.user_type,
      };
    }

    let cargoTypeId: string | null = null;

    if (order.cargoType === CargoType.PARCELS || order.cargoType === CargoType.AUTO_PARTS) {
      cargoTypeId = CargoTypeId.PARCELS;
    } else {
      cargoTypeId = order.cargoType ? CargoTypeId[order.cargoType] : null;
    }

    return {
      start_city: pickupCity!.id,
      end_city: deliveryCity!.id,
      sending_date: departureDate,
      ...senderFields,
      recipient_name: recipient!.fullName,
      recipient_phone: recipient!.phone,
      orders: [
        {
          cargo_type: cargoTypeId,
          cargo_type_ext: order.cargoType === CargoType.AUTO_PARTS ? AUTO_PARTS_EXT_TYPE : null,
          cargo_count: this.getCargoQuantity(order),
          dimensions:
            order.cargoType === CargoType.PARCELS
              ? this.mapParcelsDimensions(order.parcels)
              : order.cargoType === CargoType.AUTO_PARTS
                ? this.mapAutoPartsDimensions(order.autoParts)
                : null,
          services: this.getServices(order, pickupCourier, deliveryCourier),
        },
      ],
      note,
      // server: 'test',
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

  mapAutoPartsDimensions(data: AutoParts | null): ParcelDimensions[] | null {
    if (!data?.items.length) return null;

    return data.items.map((item) => ({
      count: item.params.quantity,
      weight: item.params.weight,
      width: item.params.dimensions.width,
      height: item.params.dimensions.height,
      length: item.params.dimensions.length,
    }));
  }
}
