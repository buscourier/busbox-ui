import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  inject,
  type OnInit,
  type TemplateRef,
  ViewChild,
} from '@angular/core';
import { TuiButton, type TuiDialogContext, TuiIcon } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';

import { BarcodeService } from '@core/services/barcode.service';
import { QrCodeService } from '@core/services/qr-code.service';

import { PageFormat, PageOrientation } from '@shared/types';

import { OrdersFacade } from '../../orders.facade';
import { InvoiceViewerService } from '../../services/invoice-viewer.service';
import type { OrderInfo, OrdersViewModel } from '../../types';

@Component({
  selector: 'app-order-invoice-dialog',
  imports: [AsyncPipe, TuiButton, TuiIcon, TuiSkeleton],
  templateUrl: './order-invoice-dialog.component.html',
  styleUrl: './order-invoice-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderInvoiceDialogComponent implements OnInit {
  @ViewChild('invoiceContainer', { static: false }) invoiceContainer!: ElementRef;
  @ViewChild('actions', { static: true }) actionsTemplate!: TemplateRef<unknown>;

  readonly context = injectContext<TuiDialogContext<string, string>>();

  vm$!: Observable<OrdersViewModel>;

  isGenerating = false;
  qrCodeUrl = '';
  barcodeUrl = '';

  private readonly ordersFacade = inject(OrdersFacade);
  private readonly invoiceViewer = inject(InvoiceViewerService);
  private readonly qrCodeService = inject(QrCodeService);
  private readonly barcodeService = inject(BarcodeService);

  async handlePrint(orderData: OrderInfo): Promise<void> {
    if (!this.invoiceContainer?.nativeElement) {
      console.error('Invoice container not found');
      return;
    }

    this.isGenerating = true;

    try {
      const copyLabels = ['Оригинал', 'Оригинал', 'Оригинал'];

      this.invoiceViewer
        .generateAndShowPdf(
          this.invoiceContainer.nativeElement,
          orderData,
          `Накладная №${this.orderId}`,
          {
            generationOptions: {
              generation: {
                filename: `invoice_${this.orderId}.pdf`,
                showProgress: true,
                format: PageFormat.A4,
                orientation: PageOrientation.PORTRAIT,
              },
              copies: {
                copyLabels,
                addSeparators: true,
              },
            },
            autoDownload: true,
            customActions: this.actionsTemplate,
          },
        )
        .subscribe({
          next: () => {
            console.log('PDF for print generated successfully');
          },
          error: (error) => {
            console.error('Error generating PDF for print:', error);
          },
          complete: () => {
            this.isGenerating = false;
          },
        });
    } catch (error) {
      console.error('Error preparing PDF for print:', error);
      this.isGenerating = false;
    }
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
    this.context.completeWith('');
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

  downloadPdf(pdfUrl: string): void {
    this.invoiceViewer.downloadPdf(pdfUrl, `Накладная_${this.orderId}.pdf`);
  }

  printPdf(pdfUrl: string): void {
    this.invoiceViewer.printPdf(pdfUrl);
  }
}
