import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { cn } from '@core/utils';

import { StatCardComponent } from './stat-card';

@Component({
  selector: 'app-stats-summary',
  imports: [StatCardComponent],
  templateUrl: './stats-summary.component.html',
  styleUrl: './stats-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsSummaryComponent {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      'flex flex-col justify-center',
      'md:flex-row md:justify-start md:space-x-6',
      'xl:flex-col xl:space-x-0',
    );
  }
}
