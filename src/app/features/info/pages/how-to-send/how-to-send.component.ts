import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@core/services';

import { SidebarLayoutComponent } from '@shared/layouts';

@Component({
  selector: 'app-how-to-send',
  imports: [SidebarLayoutComponent, RouterLink],
  templateUrl: './how-to-send.component.html',
  styleUrl: './how-to-send.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowToSendComponent {
  private readonly navigationService = inject(NavigationService);

  get deliveryLink(): string {
    return '/' + this.navigationService.findByLink('delivery')!.link;
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
}
