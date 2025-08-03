import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import { TuiSkeleton } from '@taiga-ui/kit';
import { catchError, EMPTY, type Observable } from 'rxjs';

import { NavigationService } from '@core/services';
import { CONTACT_INFO } from '@core/tokens';

import { ListComponent, ListItemDirective } from '@shared/components/list';
import { StepCardComponent, StepDirective, StepsComponent } from '@shared/components/steps';
import { SidebarLayoutComponent } from '@shared/layouts';
import type { ApiError } from '@shared/types';

import { CourierService, type GroupedCities } from './courier.service';

@Component({
  selector: 'app-courier',
  imports: [
    ListComponent,
    ListItemDirective,
    SidebarLayoutComponent,
    StepsComponent,
    StepDirective,

    AsyncPipe,
    TuiRepeatTimes,
    TuiSkeleton,
    StepCardComponent,
  ],
  templateUrl: './courier.component.html',
  styleUrl: './courier.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierComponent implements OnInit {
  cities$: Observable<GroupedCities> | null = null;

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

  steps = [
    {
      id: 1,
      icon: '@tui.truck-electric',
      title: 'Курьер приедет к вам',
    },
    {
      id: 2,
      icon: '@tui.file-check-2',
      title: 'Оформите заказ за пару минут',
      actions: [
        {
          text: 'Оформить доставку',
          href: this.deliveryLink,
        },
        {
          text: this.contact.phone,
          href: this.contact.phone,
        },
      ],
    },
    {
      id: 3,
      icon: '@tui.box',
      title: 'Передайте посылку курьеру',
    },
    {
      id: 4,
      icon: '@tui.credit-card',
      title: 'Оплатите так, как удобно вам',
    },
    {
      id: 5,
      icon: '@tui.map-pinned',
      title: 'Следите за доставкой онлайн',
      actions: [
        {
          text: 'Проверить статус на сайте',
          href: this.trackingLink,
        },
        {
          text: this.contact.phone,
          href: this.contact.phone,
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.cities$ = this.courierService.getCities().pipe(
      catchError((error: ApiError) => {
        console.error('error', error);
        return EMPTY;
      }),
    );
  }
}
