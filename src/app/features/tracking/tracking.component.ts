import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import {
  type FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import { TuiButton, TuiLabel, TuiTextfield, TuiTextfieldComponent } from '@taiga-ui/core';
import { TuiButtonLoading, TuiSkeleton } from '@taiga-ui/kit';
import { catchError, EMPTY, finalize, type Observable } from 'rxjs';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

import { type OrderStatus, OrderTrackingService } from '@tracking/order-tracking.service';
import type { TrackingForm } from '@tracking/tracking.types';

import { ContactsComponent } from './contacts';
import { TimelineComponent } from './timeline';

@Component({
  selector: 'app-tracking',
  imports: [
    ReactiveFormsModule,
    TuiLabel,
    TuiTextfieldComponent,
    TuiTextfield,
    TuiButton,
    AsyncPipe,
    TimelineComponent,
    TuiRepeatTimes,
    TuiSkeleton,
    NgOptimizedImage,
    ContactsComponent,
    TuiButtonLoading,
    PageLayoutComponent,
  ],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingComponent implements OnInit {
  SKELETON_COUNT = 3;

  statusList$: Observable<OrderStatus[]> | null = null;
  isLoading = false;
  error: string | null = null;
  searchedOrderNumber = '';
  form!: TrackingForm;

  private readonly orderTrackingService = inject(OrderTrackingService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(NonNullableFormBuilder);

  get orderNumber(): FormControl<string> {
    return this.form.controls.orderNumber;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  getStatusList(orderId: string) {
    this.isLoading = true;
    this.error = null;

    this.statusList$ = this.orderTrackingService.getStatusList(orderId).pipe(
      finalize(() => (this.isLoading = false)),
      catchError((err) => {
        this.error = `Ошибка загрузки статуса: ${err}`;
        return EMPTY;
      }),
    );
  }

  private initializeForm() {
    this.form = this.fb.group({
      orderNumber: ['', [Validators.required]],
    });

    this.initializeFromUrl();
  }

  private initializeFromUrl() {
    const { orderNumber } = this.route.snapshot.queryParams;

    if (orderNumber) {
      this.searchedOrderNumber = orderNumber;
      this.getStatusList(orderNumber);
      this.form.patchValue({ orderNumber });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { orderNumber } = this.form.getRawValue();

    this.searchedOrderNumber = orderNumber;
    this.getStatusList(orderNumber);
  }
}
