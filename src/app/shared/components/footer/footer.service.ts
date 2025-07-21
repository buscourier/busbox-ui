import { inject, Injectable } from '@angular/core';

import { NavigationService } from '@core/services/navigation.service';
import { CONTACT_INFO } from '@core/tokens';

import type { NavigationItem } from '@shared/types';

interface FooterSection {
  title?: string;
  links: NavigationItem[];
  theme?: 'default' | 'accent';
}

export interface FooterColumn {
  title: string | NavigationItem;
  sections: FooterSection[];
  type: 'navigation' | 'custom';
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private readonly navigationService = inject(NavigationService);
  private readonly contacts = inject(CONTACT_INFO);

  private readonly contactInfo: ContactInfo = {
    phone: this.contacts.phone,
    email: this.contacts.email,
    address: '690039, Приморский край, г. Владивосток, ул. Русская, дом 2А, офис 7',
  };

  getFooterColumns(): FooterColumn[] {
    return [
      {
        title: this.navigationService.findByLink('services')!,
        type: 'navigation',
        sections: [
          {
            links: this.navigationService.getDropdownItems('services'),
            theme: 'accent',
          },
        ],
      },
      {
        title: this.navigationService.findByLink('info')!,
        type: 'navigation',
        sections: [
          {
            links: this.navigationService.getDropdownItems('info'),
          },
        ],
      },
      {
        title: 'Сервисы',
        type: 'custom',
        sections: [
          {
            links: [
              this.navigationService.findByLink('account'),
              this.navigationService.findByLink('tracking'),
              this.navigationService.findByLink('delivery'),
            ].filter(Boolean) as NavigationItem[],
          },
          {
            links: this.navigationService
              .getNavigation()
              .filter((item) => item.onlyMobile || item.link === 'contacts'),
            theme: 'accent',
          },
        ],
      },
      {
        title: '',
        type: 'custom',
        sections: [],
      },
    ];
  }

  getMainNavigation(): NavigationItem[] {
    const mainLinks = ['tracking', 'delivery', 'services', 'info', 'documents', 'contacts'];
    return mainLinks
      .map((link) => this.navigationService.findByLink(link))
      .filter(Boolean) as NavigationItem[];
  }

  getContactInfo(): ContactInfo {
    return this.contactInfo;
  }
}
