import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NavigationService } from '@core/services';

import {
  StepsComponent,
  StepDirective,
  StepCardComponent,
  type Step,
} from '@shared/components/steps';
import { SidebarLayoutComponent } from '@shared/layouts';

@Component({
  selector: 'app-how-to-send',
  imports: [SidebarLayoutComponent, StepsComponent, StepDirective, StepCardComponent],
  templateUrl: './how-to-send.component.html',
  styleUrl: './how-to-send.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowToSendComponent {
  private readonly navigationService = inject(NavigationService);

  get deliveryLink(): string {
    return '/' + this.navigationService.findByLink('delivery/booking')!.link;
  }

  get contactsLink(): string {
    return '/' + this.navigationService.findByLink('contacts')!.link;
  }

  get packagingLink(): string {
    return '/' + this.navigationService.findByLink('packaging')!.link;
  }

  get rulesLink(): string {
    return '/' + this.navigationService.findByLink('cargo-rules')!.link;
  }

  shippingSteps: Step[] = [
    {
      id: 1,
      icon: '@tui.package',
      title: 'Выберите, как передать посылку',
      actions: [
        {
          text: 'Оформить доставку',
          href: this.deliveryLink,
          type: 'route',
        },
        {
          text: 'Адреса филиалов',
          href: this.contactsLink,
          type: 'route',
        },
      ],
    },
    {
      id: 2,
      icon: '@tui.files',
      title: 'Подготовьте документы',
    },
    {
      id: 3,
      icon: '@tui.badge-russian-ruble',
      title: 'Оплатите удобным способом',
    },
    {
      id: 4,
      icon: '@tui.package-open',
      title: 'Упакуйте посылку надёжно',
      actions: [
        {
          text: 'Смотреть виды упаковок',
          href: this.packagingLink,
          type: 'route',
        },
      ],
    },
    {
      id: 5,
      icon: '@tui.eye',
      title: 'Покажите содержимое перед отправкой',
      actions: [
        {
          text: 'Смотреть правила приемки',
          href: this.rulesLink,
          type: 'route',
        },
      ],
    },
    {
      id: 6,
      icon: '@tui.triangle-alert',
      title: 'Проверьте ограничения',
      actions: [
        {
          text: 'Смотреть запрещенные грузы',
          href: this.rulesLink,
          type: 'route',
        },
      ],
    },
  ];
}
