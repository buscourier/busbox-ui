import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tuiDialog } from '@taiga-ui/core';

import { cn } from '@core/utils';

import type { DeliveryCity, PickupCity } from '@shared/types';

import { LocationsFacade } from '@store';

import { CitiesDialogComponent } from './cities-dialog';
import { StatCardComponent } from './stat-card';

@Component({
  selector: 'app-stats-summary',
  imports: [StatCardComponent, AsyncPipe],
  templateUrl: './stats-summary.component.html',
  styleUrl: './stats-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsSummaryComponent implements OnInit {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      'flex flex-col justify-center',
      'md:flex-row md:justify-start md:gap-10',
      'xl:flex-col xl:space-x-0',
    );
  }

  citiesDialog = tuiDialog(CitiesDialogComponent, {
    closeable: true,
    dismissible: true,
    size: 'l',
  });

  readonly locationsFacade = inject(LocationsFacade);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.locationsFacade.loadDeliveryCities('1');
  }

  showPickupCities(cities: PickupCity[]) {
    this.showCities('Города отправления', cities);
  }

  showDeliveryCities(cities: DeliveryCity[]) {
    this.showCities('Города получения', cities);
  }

  showCities(title: string, cities: PickupCity[] | DeliveryCity[]): void {
    this.citiesDialog({
      title,
      cities: cities.map((city) => city.name),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
