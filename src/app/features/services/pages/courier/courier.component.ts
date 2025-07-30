import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import { TuiSkeleton } from '@taiga-ui/kit';
import { catchError, type Observable, of } from 'rxjs';

import { NavigationService } from '@core/services';
import { CONTACT_INFO } from '@core/tokens';

import { ListComponent, ListItemDirective } from '@shared/components/list';
import { StepDirective, StepsComponent } from '@shared/components/steps';
import { SidebarLayoutComponent } from '@shared/layouts';
import { ContactLinkPipe } from '@shared/pipes';
import type { ApiError } from '@shared/types';

import { CourierService, type City } from './courier.service';

@Component({
  selector: 'app-courier',
  imports: [
    ListComponent,
    ListItemDirective,
    SidebarLayoutComponent,
    StepsComponent,
    StepDirective,
    RouterLink,
    ContactLinkPipe,
    AsyncPipe,
    TuiRepeatTimes,
    TuiSkeleton,
  ],
  templateUrl: './courier.component.html',
  styleUrl: './courier.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierComponent implements OnInit {
  cities$: Observable<City[]> | null = null;

  protected readonly SKELETON_COUNT = 10;
  protected readonly contact = inject(CONTACT_INFO);

  private readonly navigationService = inject(NavigationService);
  private readonly courierService = inject(CourierService);

  get deliveryLink(): string {
    return '/' + this.navigationService.findByLink('delivery')!.link;
  }

  get trackingLink(): string {
    return '/' + this.navigationService.findByLink('tracking')!.link;
  }

  ngOnInit(): void {
    this.cities$ = this.courierService.getCities().pipe(
      catchError((error: ApiError) => {
        console.error('error', error);
        return of([]);
      }),
    );
  }
}
