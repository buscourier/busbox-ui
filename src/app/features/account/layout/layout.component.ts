import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

import { AuthFacade } from '@core/auth';
import { NavigationService } from '@core/services/navigation.service';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

import { BalanceComponent } from '@account/balance';

@Component({
  selector: 'app-layout',
  imports: [TuiButton, RouterLink, BalanceComponent, TuiIcon, PageLayoutComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly navigation = inject(NavigationService);
  private readonly auth = inject(AuthFacade);

  accountLinks = this.navigation.getDropdownItems('account');
  bookingLink = '/' + this.navigation.findByLink('booking')!.link;

  logout() {
    this.auth.logout();
  }
}
