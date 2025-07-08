import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { NavigationItem } from '@shared/types';

import { type FooterColumn, FooterService } from './footer.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly footer = inject(FooterService);

  readonly footerColumns = this.footer.getFooterColumns();
  readonly mainNavigation = this.footer.getMainNavigation();
  readonly contactInfo = this.footer.getContactInfo();

  getLinkClasses(theme?: string): string {
    const baseClasses = 'hover:text-white transition-colors block';

    switch (theme) {
      case 'accent':
        return `${baseClasses} text-white text-base font-medium hover:text-yellow-400`;

      default:
        return `${baseClasses} text-gray-300 text-sm`;
    }
  }

  isNavigationItem(title: string | NavigationItem): title is NavigationItem {
    return typeof title === 'object' && title !== null;
  }

  getColumnTitle(column: FooterColumn): string {
    return typeof column.title === 'string' ? column.title : column.title.name;
  }
}
