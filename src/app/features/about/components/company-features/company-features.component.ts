import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

@Component({
  selector: 'app-company-features',
  imports: [TuiIcon],
  templateUrl: './company-features.component.html',
  styleUrl: './company-features.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyFeaturesComponent {
  @HostBinding('class') get hostClasses(): string {
    return cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3');
  }

  features = [
    {
      title: 'Сверхбыстрая доставка',
      text: 'От 1 до 24 часов по всей стране',
      icon: '@tui.zap',
      badge: '2-24ч',
    },
    {
      title: 'Широкая география',
      text: 'Доставка в труднодоступные населенные пункты',
      icon: '@tui.globe',
      badge: '7 филиалов',
    },
    {
      title: 'Любые грузы',
      text: 'Транспортировка различных категорий груза',
      icon: '@tui.package',
      badge: 'Безопасно',
    },
    {
      title: 'Гарантия качества',
      text: 'Регулярное движение междугородных маршрутов',
      icon: '@tui.circle-check-big',
      badge: '99% успеха',
    },
    {
      title: 'Официальная служба',
      text: 'Первая в России официальная служба сверхсрочной доставки',
      icon: '@tui.award',
      badge: '№1 в России',
    },
    {
      title: 'Удобство получения',
      text: 'Гибкая система выдачи груза и круглосуточная поддержка',
      icon: '@tui.star',
      badge: '24/7',
    },
  ];
}
