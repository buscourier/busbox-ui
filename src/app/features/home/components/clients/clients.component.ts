import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

@Component({
  selector: 'app-clients',
  imports: [TuiIcon],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent {
  @HostBinding('class') get hostClasses(): string {
    return cn('grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-x-7');
  }

  readonly clients = [
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
