import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

import {
  CompanyFeaturesComponent,
  CompanyOverviewComponent,
  CompanyStatsComponent,
  CompanyValuesComponent,
  SocialProjectsComponent,
  TeamComponent,
} from './components';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SocialProjectsComponent,
    CompanyValuesComponent,
    CompanyFeaturesComponent,
    CompanyOverviewComponent,
    TeamComponent,
    CompanyStatsComponent,
    PageLayoutComponent,
  ],
})
export class AboutComponent {}
