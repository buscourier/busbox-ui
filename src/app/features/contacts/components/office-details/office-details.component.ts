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
import { TuiButton, TuiLink, TuiScrollbar } from '@taiga-ui/core';

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
  @Output() closeDetails = new EventEmitter<void>();

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'absolute top-0 right-0 bottom-0 z-20 w-full',
      'sm:fixed sm:left-0 sm:flex sm:items-center sm:justify-center sm:bg-black/80',
      'lg:relative lg:inset-auto lg:block lg:bg-transparent',
      {
        closing: this.isClosing,
      },
    );
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.onCloseDetails();
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCloseDetails();
    }
  }

  get cardClasses(): string {
    return cn(
      'card relative h-full bg-white p-5',
      'sm:z-20 sm:h-auto sm:max-w-[620px] sm:rounded-sm',
      'md:border md:border-gray-200 md:shadow-md',
      'lg:h-full lg:max-w-full lg:p-6 lg:pt-8',
      'xl:pt-8 xl:pr-4 xl:pl-8',
    );
  }

  isClosing = false;

  onCloseDetails(): void {
    this.isClosing = true;

    setTimeout(() => {
      this.closeDetails.emit();
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
