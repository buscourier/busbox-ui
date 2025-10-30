import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NavigationService } from '@core/services';
import { CONTACT_INFO } from '@core/tokens';

import { type BrandCard, BrandCardComponent } from '@shared/components/brand-card';
import { CarouselComponent } from '@shared/components/carousel';
import { ListComponent, ListItemDirective } from '@shared/components/list';
import {
  type Step,
  StepCardComponent,
  StepDirective,
  StepsComponent,
} from '@shared/components/steps';
import { DocumentsListComponent } from '@shared/features/documents';
import { PageLayoutComponent } from '@shared/layouts/page-layout';

@Component({
  selector: 'app-airport-delivery',
  imports: [
    StepsComponent,
    StepDirective,
    DocumentsListComponent,
    BrandCardComponent,
    BrandCardComponent,
    CarouselComponent,
    StepCardComponent,
    ListComponent,
    ListItemDirective,
    PageLayoutComponent,
  ],
  templateUrl: './airport-delivery.component.html',
  styleUrl: './airport-delivery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirportDeliveryComponent {
  private readonly navigationService = inject(NavigationService);
  protected readonly contact = inject(CONTACT_INFO);

  public readonly items: BrandCard[] = [
    {
      name: 'aeroflot',
      link: 'https://www.aeroflot.ru/',
    },
    {
      name: 'aurora',
      link: 'https://www.flyaurora.ru',
    },
    {
      name: 'eastjet',
      link: null,
    },
    {
      name: 's7',
      link: 'https://www.s7.ru/',
    },
  ];

  get deliveryLink(): string {
    return '/' + this.navigationService.findByLink('delivery/booking')!.link;
  }

  steps: Step[] = [
    {
      id: 1,
      icon: '@tui.info',
      title: 'Для кого эта услуга?',
    },
    {
      id: 2,
      icon: '@tui.clock-8',
      title: 'Как оформить доставку за пару минут',
      actions: [
        {
          text: 'Оформить на сайте',
          href: this.deliveryLink,
          type: 'route',
        },
        {
          text: this.contact.phone,
          href: this.contact.phone,
          type: 'tel',
        },
      ],
    },
    {
      id: 3,
      icon: '@tui.messages-square',
      title: 'Мы сами свяжемся с вами',
    },
    {
      id: 4,
      icon: '@tui.signature',
      title: 'Если получает не вы — нужна доверенность',
    },
    {
      id: 5,
      icon: '@tui.combine',
      title: 'Три способа получить груз',
    },
  ];
}
