import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@core/services/navigation.service';

import { NavCardComponent } from '@shared/components/nav-card';

@Component({
  selector: 'app-info-index',
  imports: [RouterLink, NavCardComponent],
  templateUrl: './info-index.component.html',
  styleUrl: './info-index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoIndexComponent {
  private readonly navigationService = inject(NavigationService);

  readonly infoLinks = this.navigationService.getDropdownItems('info');
}
