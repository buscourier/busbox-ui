import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiNotification } from '@taiga-ui/core';

import { CONTACT_INFO } from '@core/tokens';

import { ContentScrollerComponent } from '@shared/components/content-scroller';
import { ListComponent, ListItemDirective } from '@shared/components/list';
import { SimpleTableComponent } from '@shared/components/simple-table';
import { PageLayoutComponent } from '@shared/layouts/page-layout';
import { ContactLinkPipe } from '@shared/pipes';

@Component({
  selector: 'app-insurance',
  imports: [
    SimpleTableComponent,
    ListComponent,
    ListItemDirective,
    ContactLinkPipe,
    ContentScrollerComponent,
    TuiNotification,
    PageLayoutComponent,
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
