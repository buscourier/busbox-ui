import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

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
  private readonly navigationService = inject(NavigationService);

  accountLinks = this.navigationService.getDropdownItems('account');
}
