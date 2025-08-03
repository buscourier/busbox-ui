import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NavigationService } from '@core/services';

import { StepsComponent, StepDirective, StepCardComponent } from '@shared/components/steps';
import { SidebarLayoutComponent } from '@shared/layouts';

@Component({
  selector: 'app-how-to-receive',
  imports: [SidebarLayoutComponent, StepsComponent, StepDirective, StepCardComponent],
  templateUrl: './how-to-receive.component.html',
  styleUrl: './how-to-receive.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowToReceiveComponent {
  private readonly navigationService = inject(NavigationService);

  get contactsLink(): string {
    return '/' + this.navigationService.findByLink('contacts')!.link;
  }

  steps = [
    {
      id: 1,
      icon: '@tui.package-check',
      title: 'Заберите в филиале',
      actions: [
        {
          text: 'Адреса филиалов',
          href: this.contactsLink,
        },
      ],
    },
    {
      id: 2,
      icon: '@tui.bus-front',
      title: 'Если филиала нет — встретьте автобус',
    },
    {
      id: 3,
      icon: '@tui.message-square-text',
      title: 'Ждите SMS с деталями',
    },
    {
      id: 4,
      icon: '@tui.file-check-2',
      title: 'Возьмите документ для получения',
    },
  ];
}
