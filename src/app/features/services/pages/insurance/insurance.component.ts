import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiNotification } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';

import { CONTACT_INFO } from '@core/tokens';

import { ContentScrollerComponent } from '@shared/components/content-scroller';
import { ListComponent, ListItemDirective } from '@shared/components/list';
import { SimpleTableComponent } from '@shared/components/simple-table';
import { ContactLinkPipe } from '@shared/pipes';

@Component({
  selector: 'app-insurance',
  imports: [
    NgOptimizedImage,
    SimpleTableComponent,
    ListComponent,
    ListItemDirective,
    ContactLinkPipe,
    TuiSkeleton,
    ContentScrollerComponent,
    TuiNotification,
  ],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceComponent {
  protected readonly contact = inject(CONTACT_INFO);

  imageLoaded = false;
  imageError = false;

  table = {
    columns: [
      { key: 'declaredValue', title: 'Объявленная ценность груза' },
      { key: 'price', title: 'Стоимость' },
    ],
    rows: [
      { declaredValue: 'до 15 000 руб.', price: '50 руб.' },
      { declaredValue: '15 000 руб. - 30 000 руб.', price: '100 руб.' },
    ],
  };

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageError = true;
    this.imageLoaded = true;
  }
}
