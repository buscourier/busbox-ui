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
  private barcodeService = inject(BarcodeService);

  handlePrint(order: OrderInfo): void {
    this.isGenerating = true;

    this.invoiceViewer
      .generateAndShowPdf(
        this.invoiceContainer.nativeElement,
        order,
        `Накладная №${order.order_id}`,
        {
          autoDownload: false,
          downloadLabel: 'Скачать накладную',
          customActions: this.actionsTemplate,
          generationOptions: {
            filename: `Накладная_${order.order_id}.pdf`,
            quality: 0.95,
            scale: 2.5,
          },
        },
      )
      .subscribe({
        next: () => {
          this.isGenerating = false;
        },
        error: (error) => {
          console.error('Ошибка при открытии PDF:', error);
          this.isGenerating = false;
        },
        complete: () => {
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
    console.log('pdfUrl', pdfUrl);
    this.invoiceViewer.downloadPdf(pdfUrl, `Накладная_${this.orderId}.pdf`);
  }

  printPdf(pdfUrl: string): void {
    this.invoiceViewer.printPdf(pdfUrl);
  }
}
