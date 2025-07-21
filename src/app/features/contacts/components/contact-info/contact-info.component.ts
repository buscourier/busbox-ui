import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { TuiIcon, TuiLink } from '@taiga-ui/core';

import { type ContactInfo } from '@core/tokens';
import { cn } from '@core/utils';

import { ContactLinkPipe } from '@shared/pipes';

@Component({
  selector: 'app-contact-info',
  imports: [ContactLinkPipe, TuiLink, TuiIcon],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoComponent {
  @Input({ required: true }) contact!: ContactInfo;

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'mt-9 max-w-[430px] pt-4 pr-7 pb-4 pl-5',
      'flex flex-wrap gap-x-4 gap-y-2.5 self-start',
      'rounded-sm bg-yellow-500 shadow-md',
      'lg:mt-0 lg:mb-0',
    );
  }
}
