import { isPlatformBrowser } from '@angular/common';
import {
  type ElementRef,
  type OnChanges,
  type OnInit,
  type SimpleChanges,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter,
  ViewChild,
  inject,
  DestroyRef,
  Component,
  type AfterViewInit,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiTable, TuiTableCell, TuiTableDirective, TuiTableHead } from '@taiga-ui/addon-table';
import type { TuiContext, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiScrollbarDirective, TuiTextfield } from '@taiga-ui/core';
import {
  TuiButtonSelect,
  TuiDataListWrapperComponent,
  TuiPagination,
  TuiSkeleton,
} from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { debounceTime, distinctUntilChanged, filter, fromEvent } from 'rxjs';

import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../constants';
import type { OrderListViewModel, PaginationViewModel } from '../../types';

@Component({
  selector: 'app-order-list',
  imports: [
    TuiCurrencyPipe,
    TuiPagination,
    TuiTableCell,
    TuiTableDirective,
    TuiTableHead,
    TuiTable,
    TuiSkeleton,
    FormsModule,
    TuiDataListWrapperComponent,
    ReactiveFormsModule,
    TuiTextfield,
    TuiTextfieldControllerModule,
    TuiButton,
    TuiButtonSelect,
    TuiScrollbarDirective,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input({ required: true }) list!: OrderListViewModel;
  @Input({ required: true }) pagination!: PaginationViewModel;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() openOrder = new EventEmitter<string>();
  @Output() exportToExcel = new EventEmitter<void>();

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  showLeftFade = false;
  showRightFade = false;

  columns = [
    'order_id',
    'date',
    'sender_name',
    'recipient_name',
    'start_city',
    'end_city',
    'order_price',
    'status',
    'print',
  ];

  protected readonly PAGE_SIZE_OPTIONS = PAGE_SIZE_OPTIONS;
  protected readonly content: TuiStringHandler<TuiContext<number>> = ({ $implicit }) =>
    `По ${$implicit} на странице`;

  pageSize = new FormControl(DEFAULT_PAGE_SIZE);

  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.setupPageSizeChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && this.pagination?.pageSize) {
      this.pageSize.setValue(this.pagination.pageSize, { emitEvent: false });
    }

    if (changes['list'] && this.tableContainer) {
      setTimeout(() => this.checkScrollState(), 0);
    }
  }

  ngAfterViewInit(): void {
    this.checkScrollState();

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'resize')
        .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.checkScrollState());
    }
  }

  setupPageSizeChange(): void {
    this.pageSize.valueChanges
      .pipe(filter(Boolean), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((pageSize) => {
        this.pageSizeChange.emit(pageSize);
      });
  }

  onPageChange(pageIndex: number): void {
    this.pageChange.emit(pageIndex + 1);
  }

  onOpenOrder(id: string) {
    this.openOrder.emit(id);
  }

  getSkeletonArray(): number[] {
    return Array(DEFAULT_PAGE_SIZE).fill(0);
  }

  onExportToExcel(): void {
    this.exportToExcel.emit();
  }

  getOrdersWord(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'заказов';
    }

    switch (lastDigit) {
      case 1:
        return 'заказ';
      case 2:
      case 3:
      case 4:
        return 'заказа';
      default:
        return 'заказов';
    }
  }

  onTableScroll(event: Event): void {
    const element = event.target as HTMLElement;

    this.showLeftFade = element.scrollLeft > 5;
    this.showRightFade = element.scrollLeft < element.scrollWidth - element.clientWidth - 5;
  }

  private checkScrollState(): void {
    if (!this.tableContainer) return;

    const element = this.tableContainer.nativeElement;
    const hasScroll = element.scrollWidth > element.clientWidth;

    if (!hasScroll) {
      this.showLeftFade = false;
      this.showRightFade = false;
    } else {
      this.showLeftFade = element.scrollLeft > 5;
      this.showRightFade = element.scrollLeft < element.scrollWidth - element.clientWidth - 5;
    }
  }
}
