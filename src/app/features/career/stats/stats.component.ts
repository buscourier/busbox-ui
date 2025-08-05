import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  type OnInit,
} from '@angular/core';
import { TuiLoader } from '@taiga-ui/core';
import type { Observable } from 'rxjs';

import { type CompanyStats, CompanyStatsService } from '@core/services/company-stats.service';
import { cn } from '@core/utils';

@Component({
  selector: 'app-stats',
  imports: [AsyncPipe, TuiLoader],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent implements OnInit {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      'flex flex-col items-center pt-12 md:flex-row md:items-start md:justify-center md:gap-x-18 lg:gap-x-32 xl:gap-x-28 xl:pt-0',
    );
  }

  private readonly companyStats = inject(CompanyStatsService);
  stats$: Observable<CompanyStats> | null = null;

  get workPeriod() {
    const date = new Date();

    return date.getFullYear() - 2013;
  }

  ngOnInit(): void {
    this.stats$ = this.companyStats.getStats();
  }
}
