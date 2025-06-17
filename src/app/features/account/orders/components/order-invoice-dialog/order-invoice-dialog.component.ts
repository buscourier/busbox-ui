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

import { BarcodeService } from '@core/services/barcode.service';
import { QrCodeService } from '@core/services/qr-code.service';

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
  qrCodeUrl = '';
  barcodeUrl = '';

  private readonly ordersFacade = inject(OrdersFacade);
  private readonly invoiceViewer = inject(InvoiceViewerService);
  private readonly qrCodeService = inject(QrCodeService);
  private barcodeService = inject(BarcodeService);

  handlePrint(order: OrderInfo): void {
    this.isGenerating = true;

    this.invoiceViewer
      .generateAndShowPdf(
        this.invoiceContainer.nativeElement,
        order,
        `Накладная №${order.order_id}`,
        {
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

    this.generateQrCode();
    this.generateBarcode();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ru-RU');
  }

  isPayerSender = computed(() => true);
  isCashPayment = computed(() => true);

  handleClose(): void {
    // Implement close logic
    // this.router.navigate(['/orders']);
  }

  private async generateQrCode(): Promise<void> {
    try {
      this.qrCodeUrl = await this.qrCodeService.generateQrCodeWithTheme(this.orderId, 'invoice', {
        size: 100,
        errorCorrectionLevel: 'high',
      });
    } catch (error) {
      console.error('Ошибка генерации QR-кода:', error);
    }
  }

  private async generateBarcode(): Promise<void> {
    try {
      this.barcodeUrl = await this.barcodeService.generateBarcodeWithTheme(this.orderId, 'invoice');
    } catch (error) {
      console.error('Ошибка генерации Bar-кода:', error);
    }
  }
}
