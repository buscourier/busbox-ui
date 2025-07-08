import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-info-index',
  imports: [RouterLink],
  templateUrl: './info-index.component.html',
  styleUrl: './info-index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoIndexComponent {
  private readonly navigationService = inject(NavigationService);

  readonly infoLinks = this.navigationService.getDropdownItems('info');
}
