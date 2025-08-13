import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { CONTACT_INFO } from '@core/tokens';

import { ContactLinkPipe } from '@shared/pipes';

@Component({
  selector: 'app-contacts',
  imports: [TuiIcon, ContactLinkPipe],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent {
  @HostBinding('class')
  readonly hostClass = `grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:gap-14`;

  protected readonly contact = inject(CONTACT_INFO);

  contacts = [
    {
      label: 'По телефону',
      value: this.contact.phone,
      icon: 'phone-help',
    },
    {
      label: 'Написать в',
      value: this.contact.whatsapp,
      icon: 'whatsapp',
    },
  ];
}
