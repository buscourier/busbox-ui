import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { cn } from '@core/utils';

import { ListComponent, ListItemDirective } from '@shared/components/list';

@Component({
  selector: 'app-company-overview',
  imports: [NgOptimizedImage, ListComponent, ListItemDirective],
  templateUrl: './company-overview.component.html',
  styleUrl: './company-overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyOverviewComponent {
  @HostBinding('class') get hostClasses(): string {
    return cn('grid items-center gap-12 lg:grid-cols-2');
  }

  features = [
    'Скорость – доставка от 2 до 24 часов.',
    'Доставка в труднодоступные населенные пункты в рамках региона, области, края.',
    'Транспортировка различных категорий груза, за исключением опасных и запрещенных к перевозке.',
    'Гарантия отправки в короткие сроки – регулярное движение междугородних маршрутов.',
    'Удобство получения груза – гибкая система выдачи груза.',
  ];
}
