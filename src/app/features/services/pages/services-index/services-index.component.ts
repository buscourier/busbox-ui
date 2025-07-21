import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-services-index',
  imports: [RouterLink],
  templateUrl: './services-index.component.html',
  styleUrl: './services-index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesIndexComponent {
  private readonly navigationService = inject(NavigationService);

  readonly links = this.navigationService.getDropdownItems('services');
}
