import { AsyncPipe } from '@angular/common';
import { computed, type OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, type TuiDialogContext, TuiLoader } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';

import { OrdersFacade } from '../../orders.facade';
import type { OrdersViewModel } from '../../types';

@Component({
  selector: 'app-order-receipt-dialog',
  imports: [TuiLoader, AsyncPipe, TuiButton],
  templateUrl: './order-receipt-dialog.component.html',
  styleUrl: './order-receipt-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderReceiptDialogComponent implements OnInit {
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

  getQrCodeUrl(orderId: number): string {
    return `https://api.busbox.guru/qrcode/?chl=https://xn--80abnt4abdr6f.xn--p1ai/find-order?id=${orderId}`;
  }

  getBarcodeUrl(orderId: number): string {
    return `https://api.busbox.guru/barcode/?code=${orderId}`;
  }

  // Date formatting
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ru-RU');
  }

  isPayerSender = computed(() => true);
  isCashPayment = computed(() => true);

  // Event handlers
  handlePrint(): void {
    window.print();
  }

  handleClose(): void {
    // Implement close logic
    // this.router.navigate(['/orders']);
  }
}
