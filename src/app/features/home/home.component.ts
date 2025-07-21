import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { cn } from '@core/utils';

import { ContactFormComponent } from '@shared/components/contact-form';
import { PageSectionComponent } from '@shared/components/page-section';

import {
  CargoTypesComponent,
  CaseExamplesComponent,
  ClientsComponent,
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
    ClientsComponent,
    NewsComponent,
    CargoTypesComponent,
    PageSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly cn = cn;
}
