import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NavigationService } from '@core/services/navigation.service';
import { CAROUSEL_BREAKPOINTS } from '@core/tokens';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

import { type ServiceCard, ServiceCardComponent } from './service-card';

@Component({
  selector: 'app-services-index',
  imports: [ServiceCardComponent, PageLayoutComponent, NgOptimizedImage],
  templateUrl: './services-index.component.html',
  styleUrl: './services-index.component.css',
  providers: [
    {
      provide: CAROUSEL_BREAKPOINTS,
      useValue: {
        default: 1,
        sm: 1,
        lg: 3,
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesIndexComponent {
  private readonly navigationService = inject(NavigationService);

  get deliveryLink(): string {
    return '/' + this.navigationService.findByLink('calculator')?.link;
  }

  get feedbackLink(): string {
    return '/' + this.navigationService.findByLink('feedback')?.link;
  }

  readonly services: ServiceCard[] = [
    {
      id: 'insurance',
      title: 'Страхование груза',
      description: 'Страховая защита груза и максимально быстрое возмещение ущерба.',
      type: 'guard',
      link: '/' + this.navigationService.findByLink('insurance')?.link,
    },
    {
      id: 'courier',
      title: 'Курьерская доставка',
      description: 'Забор и доставка груза — + от адреса к адресу.',
      type: 'courier',
      link: '/' + this.navigationService.findByLink('courier')?.link,
    },
    {
      id: 'packaging',
      title: 'Упаковка',
      description: 'Подберем оптимальную упаковку для вашего груза и бережно запакуем его.',
      type: 'task',
      link: '/' + this.navigationService.findByLink('packaging')?.link,
    },
    {
      id: 'airport',
      title: 'Доставка из aэропорта',
      description:
        'Забор груза из Аэропорта и Карго-Владивосток, прохождение необходимых процедур.',
      type: 'task',
      link: '/' + this.navigationService.findByLink('airport-delivery')?.link,
    },
  ];
}
