import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@core/services/navigation.service';
import { CAROUSEL_BREAKPOINTS } from '@core/tokens';

import { CarouselComponent } from '@shared/components/carousel';

import { RouteMapComponent } from './route-map';
import { type ServiceCard, ServiceCardComponent } from './service-card';

@Component({
  selector: 'app-services-index',
  imports: [RouterLink, RouteMapComponent, ServiceCardComponent, CarouselComponent],
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
    return '/' + this.navigationService.findByLink('delivery')?.link;
  }

  readonly services: ServiceCard[] = [
    {
      id: 'insurance',
      title: 'Страхование груза',
      description: 'Полная защита от любых непредвиденных ситуаций во время транспортировки.',
      type: 'guard',
      link: '/' + this.navigationService.findByLink('insurance')?.link,
    },
    {
      id: 'tasks',
      title: 'Сложные задачи',
      description: 'Индивидуальные решения для нестандартных логистических задач любой сложности.',
      type: 'task',
      link: '/' + this.navigationService.findByLink('complex-tasks')?.link,
    },
    {
      id: 'courier',
      title: 'Курьерская доставка',
      description: 'Забор груза от двери и доставка до получателя. Экономьте время и силы.',
      type: 'courier',
      link: '/' + this.navigationService.findByLink('courier')?.link,
    },
  ];
}
