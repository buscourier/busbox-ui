import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TuiActiveZone } from '@taiga-ui/cdk';
import { TuiButton, TuiDropdown, TuiDropdownManual, TuiIcon, TuiPopup } from '@taiga-ui/core';
import { TuiDrawer, TuiLineClamp } from '@taiga-ui/kit';
import { startWith } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AuthFacade } from '@core/auth';
import { NavigationService } from '@core/services';
import { BreakpointService } from '@core/services/breakpoint.service';
import { CONTACT_INFO } from '@core/tokens';

import { MobileMenuComponent } from '@shared/components/mobile-menu';
import { ContactLinkPipe } from '@shared/pipes';

import { NavigationComponent } from '../navigation';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NavigationComponent,
    MobileMenuComponent,
    TuiButton,
    TuiDropdownManual,
    TuiDropdown,
    TuiActiveZone,
    TuiIcon,
    AsyncPipe,
    TuiDrawer,
    TuiPopup,
    RouterLinkActive,
    ContactLinkPipe,
    TuiDropdownMobile,
    TuiLineClamp,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `block sticky top-0 z-50 shadow-header bg-white/80 backdrop-blur-lg`,
  },
})
export class HeaderComponent {
  readonly auth = inject(AuthFacade);

  private readonly contacts = inject(CONTACT_INFO);
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);
  private breakpointsService = inject(BreakpointService);

  isPhoneAvailable$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => {
      const url = this.router.url;
      return url === '/' || url === '/home' || url.includes('/delivery/calculator');
    }),
    startWith(() => {
      const url = this.router.url;
      return url === '/' || url === '/home' || url.includes('/delivery/calculator');
    }),
  );

  isUserMenuOpen = false;

  protected readonly mobileMenuOpen = signal(false);

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (this.breakpointsService.isXl()) {
      this.closeMobileMenu();
    }
  }

  goToCalculatorPage(isMobileNav = false) {
    this.router.navigateByUrl('/' + this.navigationService.findByLink('calculator')!.link);

    if (isMobileNav) {
      this.closeMobileMenu();
    }
  }

  get contactPhone(): string {
    return this.contacts.phone;
  }

  get userMenuItems() {
    return this.navigationService.getDropdownItems('account');
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.closeUserMenu();
  }

  onActiveZoneChange(active: boolean) {
    this.isUserMenuOpen = active && this.isUserMenuOpen;
  }

  public closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  login() {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url },
    });
  }
}
