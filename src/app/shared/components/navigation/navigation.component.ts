import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiActiveZone } from '@taiga-ui/cdk';
import { TuiDropdown, TuiIcon } from '@taiga-ui/core';

import { NavigationService } from '@core/services/navigation.service';
import { cn } from '@core/utils';

import type { NavigationItem } from '@shared/types';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, TuiDropdown, TuiActiveZone, TuiIcon],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  protected readonly cn = cn;
  private readonly navigationService = inject(NavigationService);

  @Input() isMobile = false;

  get navigationItems(): NavigationItem[] {
    return this.isMobile
      ? this.navigationService.getMobileNavigation()
      : this.navigationService.getHeaderNavigation();
  }

  navLinkClass = cn(
    `rounded-md px-3 py-2 font-normal text-gray-700 transition-colors`,
    `hover:bg-gray-100 hover:text-gray-900`,
    `focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none`,
  );

  dropdownLinkClass = cn(
    `block px-4 py-2.5 text-gray-700`,
    `transition-colors duration-150`,
    `hover:bg-gray-100 hover:text-gray-900`,
    `focus:bg-gray-100 focus:outline-none`,
  );

  dropdownToggleClass = cn(
    `flex cursor-pointer items-center gap-2 border-none`,
    `focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none`,
  );

  private openDropdowns = new Set<string>();
  private hoverTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  openDropdown(link: string): void {
    const timeout = this.hoverTimeouts.get(link);
    if (timeout) {
      clearTimeout(timeout);
      this.hoverTimeouts.delete(link);
    }

    this.openDropdowns.clear();
    this.openDropdowns.add(link);
  }

  closeDropdownWithDelay(link: string, delay = 150): void {
    const timeout = setTimeout(() => {
      this.openDropdowns.delete(link);
      this.hoverTimeouts.delete(link);
    }, delay);

    this.hoverTimeouts.set(link, timeout);
  }

  onMouseEnter(link: string): void {
    this.openDropdown(link);
  }

  onMouseLeave(link: string): void {
    this.closeDropdownWithDelay(link);
  }

  isDropdownOpen(link: string): boolean {
    return this.openDropdowns.has(link);
  }

  onActiveZoneChange(active: boolean, link: string): void {
    if (!active) {
      this.openDropdowns.delete(link);

      const timeout = this.hoverTimeouts.get(link);
      if (timeout) {
        clearTimeout(timeout);
        this.hoverTimeouts.delete(link);
      }
    }
  }

  closeAllDropdowns(): void {
    this.openDropdowns.clear();

    this.hoverTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.hoverTimeouts.clear();
  }
}
