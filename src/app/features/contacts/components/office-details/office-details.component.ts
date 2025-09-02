import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { TuiLink } from '@taiga-ui/core';

import { VideoComponent } from '@shared/components/video';
import { ContactLinkPipe } from '@shared/pipes';
import type { Office } from '@shared/types';

import { InfoItemComponent } from './info-item';

@Component({
  selector: 'app-office-details',
  imports: [VideoComponent, NgOptimizedImage, InfoItemComponent, ContactLinkPipe, TuiLink],
  templateUrl: './office-details.component.html',
  styleUrl: './office-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeDetailsComponent {
  @Input({ required: true }) office!: Office;
  @Input({ required: true }) email!: string;
  @Output() closeDetails = new EventEmitter<void>();

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

  isClosing = false;

  onCloseDetails(): void {
    this.isClosing = true;

    setTimeout(() => {
      this.closeDetails.emit();
    }, 300);
  }
}
