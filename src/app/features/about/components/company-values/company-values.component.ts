import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

@Component({
  selector: 'app-company-values',
  imports: [TuiIcon],
  templateUrl: './company-values.component.html',
  styleUrl: './company-values.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyValuesComponent {
  @HostBinding('class') get hostClasses(): string {
    return cn('grid gap-8 md:grid-cols-2 lg:grid-cols-3');
  }

  values = [
    {
      title: 'Время',
      text: `Самый ценный ресурс! Сокращая расстояния, мы экономим время своё и клиентов,
       а людей делаем ближе.`,
      icon: '@tui.clock',
    },
    {
      title: 'Человечность',
      text: 'Каждый человек для нас личность, и мы ценим это.',
      icon: '@tui.heart',
    },
    {
      title: 'Служение',
      text: 'Для нас это про социальную ответственность и желание помочь близким и окружающим.',
      icon: '@tui.target',
    },
    {
      title: 'Команда',
      text: `Мы любим свою работу и стремимся делать её качественно. От каждого из нас зависит результат,
        поэтому мы поддерживаем друг друга во всём.`,
      icon: '@tui.users',
    },
    {
      title: 'Развитие',
      text: `Мы развиваемся: постоянно разрабатываем новые идеи, ищем оптимальные способы решения проблем.
      Развиваясь сами, мы помогаем бизнесу наших клиентов.`,
      icon: '@tui.trending-up',
    },
    {
      title: 'Безопасность',
      text: `Нам важно, чтобы каждый, кто пользуется услугами нашей компании, был уверен в том, что
      доставка грузов осуществляется в соответствии с правилами международных перевозок.`,
      icon: '@tui.shield',
    },
  ];
}
