import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, type TuiDialogContext, TuiScrollbar } from '@taiga-ui/core';
import { TuiButtonLoading, TuiSkeleton } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';

import { OrdersFacade } from '../../orders.facade';
import type { OrdersViewModel } from '../../types';

@Component({
  selector: 'app-order-details-dialog',
  imports: [AsyncPipe, TuiButton, TuiButtonLoading, TuiScrollbar, TuiSkeleton],
  templateUrl: './order-details-dialog.component.html',
  styleUrl: './order-details-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsDialogComponent implements OnInit {
  readonly context = injectContext<TuiDialogContext<string, string>>();

  vm$!: Observable<OrdersViewModel>;

  private readonly ordersFacade = inject(OrdersFacade);

  protected get orderId(): string {
    return this.context.data;
  }

  ngOnInit(): void {
    this.vm$ = this.ordersFacade.getViewModel();

    this.ordersFacade.loadOrderDetails(this.orderId);
  }

  cancelOrder(orderId: string): void {
    this.ordersFacade.cancelOrder(orderId.toString());
  }

  getSkeletonArray(): number[] {
    return Array(24).fill(0);
  }
}
