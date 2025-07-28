import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@core/services';
import { CONTACT_INFO } from '@core/tokens';

import { type BrandCard, BrandCardComponent } from '@shared/components/brand-card';
import { CarouselComponent } from '@shared/components/carousel';
import { StepDirective, StepsComponent } from '@shared/components/steps';
import { DocumentsListComponent } from '@shared/features/documents';
import { ContactLinkPipe } from '@shared/pipes';

@Component({
  selector: 'app-airport-delivery',
  imports: [
    StepsComponent,
    StepDirective,
    RouterLink,
    DocumentsListComponent,
    BrandCardComponent,
    BrandCardComponent,
    CarouselComponent,
    ContactLinkPipe,
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
    return '/' + this.navigationService.findByLink('delivery')!.link;
  }
}
