import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavigationService } from '@core/services/navigation.service';

import type { NavigationItem } from '@shared/types';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  private readonly navigationService = inject(NavigationService);

  @Input() isMobile = false;

  get navigationItems(): NavigationItem[] {
    return this.isMobile
      ? this.navigationService.getMobileNavigation()
      : this.navigationService.getDesktopNavigation();
  }

  private openDropdowns = new Set<string>();

  toggleDropdown(link: string): void {
    if (this.openDropdowns.has(link)) {
      this.openDropdowns.delete(link);
    } else {
      this.openDropdowns.clear(); // Закрываем остальные
      this.openDropdowns.add(link);
    }
  }

  isDropdownOpen(link: string): boolean {
    return this.openDropdowns.has(link);
  }

  closeDropdowns(): void {
    this.openDropdowns.clear();
  }
}
