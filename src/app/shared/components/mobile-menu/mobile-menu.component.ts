import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavigationService } from '@core/services/navigation.service';
import { CONTACT_INFO } from '@core/tokens';

import type { NavigationItem } from '@shared/types';

@Component({
  selector: 'app-mobile-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly contacts = inject(CONTACT_INFO);

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  private expandedSections = new Set<string>();

  get navigationItems(): NavigationItem[] {
    return this.navigationService.getMobileNavigation().filter((item) => item.link !== 'account');
  }

  get accountItems(): NavigationItem[] {
    return this.navigationService.getDropdownItems('account');
  }

  get contactInfo() {
    return {
      phone: this.contacts.phone,
      email: this.contacts.email,
    };
  }

  toggleSection(link: string): void {
    if (this.expandedSections.has(link)) {
      this.expandedSections.delete(link);
    } else {
      this.expandedSections.add(link);
    }
  }

  isExpanded(link: string): boolean {
    return this.expandedSections.has(link);
  }

  logout(): void {
    this.close.emit();
    console.log('Logout clicked');
  }
}
