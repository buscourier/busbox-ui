import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  inject,
  type OnInit,
  ViewChild,
} from '@angular/core';
import { TuiButton, type TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';

import { OrdersFacade } from '../../orders.facade';
import { InvoiceViewerService } from '../../services/invoice-viewer.service';
import type { OrderInfo, OrdersViewModel } from '../../types';

@Component({
  selector: 'app-order-invoice-dialog',
  imports: [AsyncPipe, TuiButton],
  templateUrl: './order-invoice-dialog.component.html',
  styleUrl: './order-invoice-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderInvoiceDialogComponent implements OnInit {
  @ViewChild('invoiceContainer', { static: false }) invoiceContainer!: ElementRef;

  readonly context = injectContext<TuiDialogContext<string, string>>();

  vm$!: Observable<OrdersViewModel>;

  isGenerating = false;

  private readonly ordersFacade = inject(OrdersFacade);
  private readonly invoiceViewer = inject(InvoiceViewerService);

  handlePrint(order: OrderInfo): void {
    this.isGenerating = true;

    this.invoiceViewer
      .generateAndShowPdf(
        this.invoiceContainer.nativeElement,
        order,
        `Накладная №${order.order_id}`,
        {
          // options
          autoDownload: true,
          downloadLabel: 'Скачать накладную',
          generationOptions: {
            filename: `Накладная_${order.order_id}.pdf`,
            quality: 0.95,
            scale: 2.5,
          },
        },
      )
      .subscribe({
        next: () => {
          console.log('PDF viewer открыт');
          this.isGenerating = false;
        },
        error: (error) => {
          console.error('Ошибка при открытии PDF:', error);
          this.isGenerating = false;
        },
        complete: () => {
          console.log('PDF viewer закрыт');
          this.isGenerating = false;
        },
      });
  }

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

  handleClose(): void {
    // Implement close logic
    // this.router.navigate(['/orders']);
  }
}
