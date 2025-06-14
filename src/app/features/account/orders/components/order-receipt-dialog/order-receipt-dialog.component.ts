import { AsyncPipe } from '@angular/common';
import { computed, type ElementRef, type OnInit, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, type TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';

import { OrdersFacade } from '../../orders.facade';
import { PdfGeneratorService } from '../../services/pdf-generator.service';
import type { OrderInfo, OrdersViewModel } from '../../types';

@Component({
  selector: 'app-order-receipt-dialog',
  imports: [AsyncPipe, TuiButton],
  templateUrl: './order-receipt-dialog.component.html',
  styleUrl: './order-receipt-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderReceiptDialogComponent implements OnInit {
  @ViewChild('invoiceContainer', { static: false }) invoiceContainer!: ElementRef;

  readonly context = injectContext<TuiDialogContext<string, string>>();

  vm$!: Observable<OrdersViewModel>;

  isGeneratingPdf = false;

  private readonly ordersFacade = inject(OrdersFacade);
  private readonly pdfService = inject(PdfGeneratorService);

  async handlePrint(order: OrderInfo) {
    if (!order || !this.invoiceContainer) {
      alert('Данные для печати не найдены');
      return;
    }

    try {
      this.isGeneratingPdf = true;

      const filename = `Накладная_${order.order_id}.pdf`;

      await this.pdfService.generateInvoicePDF(this.invoiceContainer.nativeElement, order, {
        filename,
      });
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Не удалось создать PDF. Попробуйте еще раз.');
    } finally {
      this.isGeneratingPdf = false;
    }
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
