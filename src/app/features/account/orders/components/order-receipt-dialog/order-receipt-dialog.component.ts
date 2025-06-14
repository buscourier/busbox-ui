import { AsyncPipe } from '@angular/common';
import { computed, type ElementRef, type OnInit, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, type TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';

import { OrdersFacade } from '../../orders.facade';
import { PdfViewerService } from '../../services/pdf-viewer.service';
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

  isGenerating = false;

  private readonly ordersFacade = inject(OrdersFacade);
  private readonly pdfService = inject(PdfViewerService);

  // async handlePrint(order: OrderInfo) {
  //   if (!order || !this.invoiceContainer) {
  //     alert('Данные для печати не найдены');
  //     return;
  //   }
  //
  //   try {
  //     this.isGeneratingPdf = true;
  //
  //     const filename = `Накладная_${order.order_id}.pdf`;
  //
  //     const result = await this.pdfService.generateInvoicePDF(
  //       this.invoiceContainer.nativeElement,
  //       order,
  //       {
  //         filename,
  //       },
  //     );
  //
  //     console.log('result', result);
  //   } catch (error) {
  //     console.error('Ошибка при создании PDF:', error);
  //     alert('Не удалось создать PDF. Попробуйте еще раз.');
  //   } finally {
  //     this.isGeneratingPdf = false;
  //   }
  // }

  handlePrint(order: OrderInfo): void {
    this.isGenerating = true;

    this.pdfService
      .generateAndShowPdf(
        this.invoiceContainer.nativeElement,
        order,
        {
          filename: `Накладная_${order.order_id}.pdf`,
          quality: 0.95,
          scale: 2.5,
        },
        {
          label: `Накладная №${order.order_id}`,
          autoDownload: true,
          downloadLabel: 'Скачать накладную',
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
          // Показать toast с ошибкой
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
