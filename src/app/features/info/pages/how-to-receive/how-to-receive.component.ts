import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@core/services';

import { StepsComponent, StepDirective } from '@shared/components/steps';
import { SidebarLayoutComponent } from '@shared/layouts';

@Component({
  selector: 'app-how-to-receive',
  imports: [SidebarLayoutComponent, StepsComponent, RouterLink, StepDirective],
  templateUrl: './how-to-receive.component.html',
  styleUrl: './how-to-receive.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowToReceiveComponent {
  private readonly navigationService = inject(NavigationService);

  get contactsLink(): string {
    return '/' + this.navigationService.findByLink('contacts')!.link;
  }
}
