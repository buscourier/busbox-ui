import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiExpand } from '@taiga-ui/experimental';

import { type ContactInfo } from '@core/tokens';
import { cn } from '@core/utils';

import { ContactLinkPipe } from '@shared/pipes';

@Component({
  selector: 'app-contact-info',
  imports: [ContactLinkPipe, TuiIcon, TuiExpand, TuiButton],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoComponent {
  @Input({ required: true }) contact!: ContactInfo;
  @Input({ required: true }) expanded = true;
  @HostBinding('class')
  get hostClasses(): string {
    return cn(
      'max-w-[320px] self-start p-2 lg:p-4',
      'rounded-lg bg-white/90 shadow-lg lg:border-2 lg:border-yellow-500 lg:shadow-md lg:shadow-none lg:backdrop-blur-lg',
    );
  }
}
