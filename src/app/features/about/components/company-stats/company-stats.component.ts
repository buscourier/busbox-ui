import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

@Component({
  selector: 'app-company-stats',
  imports: [TuiIcon],
  templateUrl: './company-stats.component.html',
  styleUrl: './company-stats.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyStatsComponent {
  @HostBinding('class') get hostClasses(): string {
    return cn('grid gap-8 min-[420px]:grid-cols-2 lg:grid-cols-4');
  }

  stats = [
    { number: 2013, label: 'год основания', suffix: '', icon: '@tui.star' },
    { number: 7, label: 'открытых филиалов', suffix: '', icon: '@tui.map-pin' },
    { number: 1062000, label: 'посылок и грузов отправлено', suffix: '', icon: '@tui.package' },
    {
      number: 600,
      label: 'заключенных договоров с юр. лицами',
      suffix: '',
      icon: '@tui.circle-check-big',
    },
    { number: 657072, label: 'совершено и принято звонков', suffix: '', icon: '@tui.phone' },
    { number: 2, label: 'региона Приморье и Татарстан', suffix: '', icon: '@tui.globe' },
    { number: 51350, label: 'выполненных курьерских заявок', suffix: '', icon: '@tui.truck' },
    {
      number: 5400,
      label: 'кг. грузов прибыло с регионов Приморья',
      suffix: '',
      icon: '@tui.award',
    },
  ];
}
