import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

import { NavigationService } from '@core/services';
import { cn } from '@core/utils';

@Component({
  selector: 'app-service-features',
  imports: [RouterLink, TuiIcon],
  templateUrl: './service-features.component.html',
  styleUrl: './service-features.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceFeaturesComponent {
  @HostBinding('class') get hostClasses(): string {
    return cn(
      'flex flex-col space-y-7 text-left',
      'md:grid md:grid-cols-2 md:space-y-0 md:gap-x-14 md:gap-y-9',
      'lg:grid-cols-3',
    );
  }

  private readonly navigationService = inject(NavigationService);

  getFeatures() {
    return [
      {
        name: `SMS-уведомления о статусе доставки`,
        description: `Вы знаете о всех этапах движения посылки. SMS-уведомления получают
            отправитель и получатель.`,
        link: null,
        icon: `sms`,
      },
      {
        name: `Упаковка грузов`,
        description: `Подберем оптимальную упаковку для вашего груза и бережно запакуем его.`,
        link: this.navigationService.findByLink('packaging'),
        icon: `to-box`,
      },
      {
        name: `Складское хранение грузов`,
        description: `Бесплатное хранение вашего груза в течение двух суток.`,
        link: this.navigationService.findByLink(`storage`),
        icon: `to-box`,
      },
      {
        name: `Доставка из аэропорта`,
        description: ` Забор груза из Аэропорта и Карго-Владивосток, прохождение
            необходимых процедур.`,
        link: this.navigationService.findByLink('airport-delivery'),
        icon: `from-airport`,
      },
      {
        name: `Страхование груза`,
        description: `Страховая защита груза и максимально быстрое возмещение ущерба.`,
        link: this.navigationService.findByLink('insurance'),
        icon: `disk`,
      },
      {
        name: `Оплата получателем`,
        description: `Стоимость услуги 100₽`,
        link: null,
        icon: `disk`,
      },
      {
        name: `Оплата доставки`,
        description: `Осуществляется во время получения груза в офисе`,
        link: null,
        icon: `disk`,
      },
    ];
  }

  protected readonly cn = cn;
}
