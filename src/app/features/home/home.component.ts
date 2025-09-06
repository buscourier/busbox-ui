import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { cn } from '@core/utils';

import { BrandCardComponent } from '@shared/components/brand-card';
import { CarouselComponent } from '@shared/components/carousel';
import { ContactFormComponent } from '@shared/components/contact-form';
import { PageSectionComponent } from '@shared/components/page-section';
import { PageLayoutComponent } from '@shared/layouts/page-layout';

import {
  CargoTypesComponent,
  CaseExamplesComponent,
  NewsComponent,
  RouteSelectorComponent,
  ServiceFeaturesComponent,
  StatsSummaryComponent,
} from '@home/components';

@Component({
  selector: 'app-home',
  imports: [
    RouteSelectorComponent,
    NgOptimizedImage,
    StatsSummaryComponent,
    ServiceFeaturesComponent,
    ContactFormComponent,
    CaseExamplesComponent,
    NewsComponent,
    CargoTypesComponent,
    PageSectionComponent,
    BrandCardComponent,
    CarouselComponent,
    PageLayoutComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly cn = cn;

  readonly brands = [
    {
      name: 'sber',
      link: 'https://sber.ru/',
    },
    {
      name: 'aeroflot',
      link: 'https://www.aeroflot.ru/ru-ru',
    },
    {
      name: 'hyperauto',
      link: 'https://hyperauto.ru/',
    },
    {
      name: 'unilab',
      link: 'https://unilab.su/',
    },
  ];
}
