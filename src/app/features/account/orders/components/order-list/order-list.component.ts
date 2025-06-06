import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  type OnChanges,
  type OnInit,
  Output,
  type SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import {
  TuiTable,
  TuiTableCaption,
  TuiTableCell,
  TuiTableDirective,
  TuiTableHead,
} from '@taiga-ui/addon-table';
import { TuiSelect, TuiTextfield, TuiTextfieldComponent } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapperComponent,
  TuiPagination,
  TuiSkeleton,
  TuiStringifyContentPipe,
  TuiStringifyPipe,
} from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { distinctUntilChanged, filter } from 'rxjs';

import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../constants';
import type { OrderListViewModel, PaginationViewModel } from '../../types';

@Component({
  selector: 'app-order-list',
  imports: [
    TuiCurrencyPipe,
    TuiPagination,
    TuiTableCaption,
    TuiTableCell,
    TuiTableDirective,
    TuiTableHead,
    TuiTable,
    TuiSkeleton,
    FormsModule,
    TranslocoPipe,
    TuiChevron,
    TuiDataListWrapperComponent,
    TuiSelect,
    TuiStringifyContentPipe,
    TuiStringifyPipe,
    TuiTextfieldComponent,
    ReactiveFormsModule,
    TuiTextfield,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit, OnChanges {
  @Input({ required: true }) list!: OrderListViewModel;
  @Input({ required: true }) pagination!: PaginationViewModel;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() openOrder = new EventEmitter<string>();

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

  pageSize = new FormControl(DEFAULT_PAGE_SIZE);

  private readonly destroyRef = inject(DestroyRef);
  private lastPageSize = 0;
  private cachedSkeletonArray: number[] = [];

  ngOnInit(): void {
    this.setupPageSizeChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && this.pagination?.pageSize) {
      this.pageSize.setValue(this.pagination.pageSize, { emitEvent: false });
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
}
