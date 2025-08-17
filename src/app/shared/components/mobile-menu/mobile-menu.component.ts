import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiAccordion } from '@taiga-ui/experimental';

import { NavigationService } from '@core/services/navigation.service';

import type { NavigationItem } from '@shared/types';

@Component({
  selector: 'app-mobile-menu',
  imports: [RouterLink, RouterLinkActive, TuiAccordion],
  templateUrl: './mobile-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  @Output() navigate = new EventEmitter<void>();

  private readonly navigationService = inject(NavigationService);

  get navigationItems(): NavigationItem[] {
    return this.navigationService.getMobileNavigation().filter((item) => item.link !== 'account');
  }

  onNavigate(): void {
    this.navigate.emit();
  }
}
