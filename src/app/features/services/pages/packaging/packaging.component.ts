import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { AlertComponent } from '@shared/components/alert';
import { StepDirective, StepsComponent } from '@shared/components/steps';
import { DocumentsListComponent } from '@shared/features/documents';
import { SidebarLayoutComponent } from '@shared/layouts';
import { PageLayoutComponent } from '@shared/layouts/page-layout';

import { PackageComponent } from './package';

@Component({
  selector: 'app-packaging',
  imports: [
    SidebarLayoutComponent,
    StepsComponent,
    StepDirective,
    PackageComponent,
    TuiIcon,
    AlertComponent,
    DocumentsListComponent,
    PageLayoutComponent,
  ],
  templateUrl: './packaging.component.html',
  styleUrl: './packaging.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagingComponent {
  boxesTable = {
    columns: [
      { key: 'name', title: 'Название' },
      { key: 'size', title: 'Размер' },
      { key: 'price', title: 'Цена' },
    ],
    rows: [
      { name: 'Мини', size: '150 х 150 х 150', price: '50 руб.' },
      { name: 'Маленькая', size: '380 х 285 х 142', price: '80 руб.' },
      { name: 'Средняя', size: '450 х 450 х 300', price: '120 руб.' },
      { name: 'Большая', size: '680 х 470 х 470', price: '180 руб.' },
    ],
  };

  safePacksTable = {
    columns: [
      { key: 'name', title: 'Название' },
      { key: 'size', title: 'Размер' },
      { key: 'price', title: 'Цена' },
    ],
    rows: [
      { name: 'Мини', size: '162 x 220 x 40', price: '15 руб.' },
      { name: 'Маленький', size: '205 х 295 х 45', price: '20 руб.' },
      { name: 'Большой', size: '296 х 400 х 45', price: '30 руб.' },
    ],
  };
}
