import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CONTACT_INFO } from '@core/tokens';

import { MobileMenuComponent } from '@shared/components/mobile-menu';

import { NavigationComponent } from '../navigation';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NavigationComponent, NavigationComponent, MobileMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly contacts = inject(CONTACT_INFO);

  isMobileMenuOpen = false;
  isUserMenuOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.isUserMenuOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (window.innerWidth >= 768 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  getContactPhone(): string {
    return this.contacts.phone;
  }

  getUserMenuItems() {
    return [
      { link: 'account/orders', name: 'Мои заказы' },
      { link: 'account/profile', name: 'Персональные данные' },
    ];
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(): void {
    this.closeUserMenu();
    console.log('Logout clicked');
  }
}
