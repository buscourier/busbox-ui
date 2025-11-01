import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CONTACT_INFO } from '@core/tokens';
import { cn } from '@core/utils';

import { BrandCardComponent } from '@shared/components/brand-card';
import { ContactFormComponent } from '@shared/components/contact-form';
import { PageSectionComponent } from '@shared/components/page-section';
import { PageLayoutComponent } from '@shared/layouts/page-layout';
import { ContactLinkPipe } from '@shared/pipes';

import {
  CargoTypesComponent,
  NewsComponent,
  RouteSelectorComponent,
  ServiceFeaturesComponent,
  StatsSummaryComponent,
  StatsComponent,
} from '@home/components';

@Component({
  selector: 'app-home',
  imports: [
    RouteSelectorComponent,
    StatsSummaryComponent,
    ServiceFeaturesComponent,
    ContactFormComponent,
    NewsComponent,
    CargoTypesComponent,
    PageSectionComponent,
    BrandCardComponent,
    PageLayoutComponent,
    StatsComponent,
    ContactLinkPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly cn = cn;

  protected readonly contacts = inject(CONTACT_INFO);

  readonly brands = [
    {
      name: 'transgaz',
      link: 'https://transgas.ltd/',
    },
    {
      name: 'aeroflot',
      link: 'https://www.aeroflot.ru/ru-ru',
    },
    // {
    //   name: 'hyperauto',
    //   link: 'https://hyperauto.ru/',
    // },
    {
      name: 'unilab',
      link: 'https://unilab.su/',
    },
  ];
}
