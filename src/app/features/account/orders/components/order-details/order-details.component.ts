import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { TuiButton, type TuiDialogContext, TuiScrollbar } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';

import { OrdersFacade } from '../../orders.facade';
import type { OrdersViewModel } from '../../types';

@Component({
  selector: 'app-order-details',
  imports: [AsyncPipe, TuiScrollbar, TuiButton, TuiButtonLoading],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsComponent implements OnInit {
  readonly context = injectContext<TuiDialogContext<string, string>>();

  vm$!: Observable<OrdersViewModel>;

  private readonly ordersFacade = inject(OrdersFacade);

  protected get orderId(): string {
    return this.context.data;
  }

  ngOnInit(): void {
    this.vm$ = this.ordersFacade.getViewModel();

    this.ordersFacade.loadOrder(this.orderId);
  }

  cancelOrder(): void {
    this.ordersFacade.cancelOrder();
  }
}
