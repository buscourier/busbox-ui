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
import {
  type TuiSortChange,
  TuiSortDirection,
  TuiTable,
  TuiTableCell,
  TuiTableDirective,
  TuiTableHead,
} from '@taiga-ui/addon-table';
import type { TuiContext, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiScrollbarDirective, TuiTextfield } from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiButtonSelect,
  TuiDataListWrapperComponent,
  TuiPagination,
  TuiSkeleton,
} from '@taiga-ui/kit';
import { debounceTime, distinctUntilChanged, filter, fromEvent } from 'rxjs';

import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../constants';
import { type Order, type OrderListViewModel, type SortConfig } from '../../types';

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
    TuiButton,
    TuiButtonSelect,
    TuiScrollbarDirective,
    TuiButtonLoading,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input({ required: true }) list!: OrderListViewModel;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<SortConfig>();
  @Output() orderSelect = new EventEmitter<string>();
  @Output() orderPrint = new EventEmitter<string>();
  @Output() export = new EventEmitter<void>();

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

  get sortBy(): keyof Order | null {
    return this.list.sort?.field || null;
  }

  get direction(): TuiSortDirection | null {
    const dir = this.list.sort?.direction || 0;
    return dir === 0 ? null : (dir as TuiSortDirection);
  }

  ngOnInit(): void {
    this.setupPageSizeChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && this.list.pagination?.pageSize) {
      this.pageSize.setValue(this.list.pagination.pageSize, { emitEvent: false });
    }

    if (changes['list'] && this.tableContainer) {
      setTimeout(() => this.checkScrollState(), 0);
    }

    if (changes['list'] && this.list?.orders?.length) {
      setTimeout(() => this.initScrollState(), 0);
    }
  }

  ngAfterViewInit(): void {
    this.initScrollState();
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

  onOrderSelect(id: string) {
    this.orderSelect.emit(id);
  }

  onOrderPrint(id: string) {
    this.orderPrint.emit(id);
  }

  getSkeletonArray(): number[] {
    return Array(DEFAULT_PAGE_SIZE).fill(0);
  }

  onExport(): void {
    this.export.emit();
  }

  onSortChange(event: TuiSortChange<Order>): void {
    const sort: SortConfig = {
      field: event.sortKey || null,
      direction: event.sortDirection,
    };
    this.sortChange.emit(sort);
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

  private initScrollState(): void {
    if (!this.tableContainer) return;

    const element = this.tableContainer.nativeElement;
    const canScrollRight = element.scrollWidth > element.clientWidth;

    // Если можно прокручивать вправо - показываем тень сразу
    this.showRightFade = canScrollRight;
    this.showLeftFade = false;
  }

  protected readonly TuiSortDirection = TuiSortDirection;
}
