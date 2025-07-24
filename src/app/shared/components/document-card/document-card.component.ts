import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

import type { DocumentFile } from '@shared/types';

@Component({
  selector: 'app-document-card',
  imports: [TuiIcon, NgOptimizedImage],
  templateUrl: './document-card.component.html',
  styleUrl: './document-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCardComponent {
  @Input({ required: true }) doc!: DocumentFile;
  @Output() show = new EventEmitter<DocumentFile>();

  @HostBinding('class') get hostClasses(): string {
    return cn('flex max-w-[370px] items-start rounded-sm pt-6 pr-9 pb-8 pl-7 shadow-xl');
  }

  protected readonly cn = cn;

  onShow() {
    this.show.emit(this.doc);
  }
}
