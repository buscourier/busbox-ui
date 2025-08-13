import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { cn } from '@core/utils';

import { type OrderStatus, OrderStatusCode } from '@tracking/order-tracking.service';

@Component({
  selector: 'app-timeline',
  imports: [DatePipe],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  @Input({ required: true }) statusList!: OrderStatus[];
  @Input({ required: true }) orderNumber!: string;

  @HostBinding('class')
  readonly hostClass = cn(`flex flex-col gap-8 sm:gap-10`);

  protected readonly cn = cn;

  getStatusColor(charcode: string): string {
    switch (charcode) {
      case OrderStatusCode.ORDER_READY:
      case OrderStatusCode.ORDER_DELIVERED:
        return `border-blue-500 bg-blue-300`;
      case OrderStatusCode.ORDER_FAILURE:
      case OrderStatusCode.ORDER_CANCELED:
        return `border-red-500 bg-red-300`;
      default:
        return `border-yellow-500 bg-yellow-300`;
    }
  }
}
