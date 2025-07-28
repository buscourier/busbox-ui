import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@core/services';

import { type BrandCard, BrandCardComponent } from '@shared/components/brand-card';
import { CarouselComponent } from '@shared/components/carousel';
import { PageSectionComponent } from '@shared/components/page-section';
import { StepDirective, StepsComponent } from '@shared/components/steps';
import { DocumentsListComponent } from '@shared/features/documents';

@Component({
  selector: 'app-airport-delivery',
  imports: [
    StepsComponent,
    StepDirective,
    RouterLink,
    DocumentsListComponent,
    PageSectionComponent,
    BrandCardComponent,
    BrandCardComponent,
    CarouselComponent,
  ],
  templateUrl: './airport-delivery.component.html',
  styleUrl: './airport-delivery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirportDeliveryComponent {
  private readonly navigationService = inject(NavigationService);

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
