import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiIcon, TuiLink } from '@taiga-ui/core';

import { CONTACT_INFO } from '@core/tokens';

import { ContactLinkPipe } from '@shared/pipes';

@Component({
  selector: 'app-contact-info',
  imports: [TuiIcon, ContactLinkPipe, TuiLink],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoComponent {
  protected readonly contactInfo = inject(CONTACT_INFO);
}
