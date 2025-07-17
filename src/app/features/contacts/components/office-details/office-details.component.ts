import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { TuiButton, TuiIcon, TuiLink, TuiScrollbar } from '@taiga-ui/core';

import { BreakpointDirective } from '@core/directives';
import { cn } from '@core/utils';

import { VideoComponent } from '@shared/components/video';
import { ContactLinkPipe } from '@shared/pipes';
import type { Office } from '@shared/types';

import { InfoItemComponent } from './info-item';

@Component({
  selector: 'app-office-details',
  imports: [
    BreakpointDirective,
    TuiButton,
    TuiIcon,
    TuiScrollbar,
    VideoComponent,
    NgOptimizedImage,
    InfoItemComponent,
    ContactLinkPipe,
    TuiLink,
  ],
  templateUrl: './office-details.component.html',
  styleUrl: './office-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeDetailsComponent {
  @Input({ required: true }) office!: Office;
  @Input({ required: true }) email!: string;
  @Output() close = new EventEmitter<void>();

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'absolute top-0 bottom-0 right-0 w-full z-20',
      'sm:fixed sm:left-0 sm:flex sm:items-center sm:justify-center sm:bg-black/80',
      'lg:relative lg:inset-auto lg:block lg:bg-transparent',
      {
        closing: this.isClosing,
      },
    );
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeDetails();
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeDetails();
    }
  }

  get cardClasses(): string {
    return cn(
      'card p-5 relative h-full bg-white',
      'sm:z-20 sm:max-w-[620px] sm:h-auto sm:rounded-sm',
      'md:shadow-md md:border md:border-gray-200',
      'lg:p-6 lg:pt-8 lg:max-w-full lg:h-full',
      'xl:pt-8 xl:pr-4 xl:pl-8',
    );
  }

  isClosing = false;

  closeDetails(): void {
    this.isClosing = true;

    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  getOfficeStatus(office: Office) {
    if (!office) {
      return false;
    }

    let status = '';

    if (office.get === '1' && office.give === '1') {
      status = 'Офис принимает и выдает грузы';
    } else if (office.get === '1') {
      status = 'Офис только выдает грузы';
    } else if (office.give === '1') {
      status = 'Офис только принимает грузы';
    }

    return status;
  }
}
