import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

import { cn } from '@core/utils';

import type { DocumentFile } from '../../types';

@Component({
  selector: 'app-document-card',
  imports: [],
  templateUrl: './document-card.component.html',
  styleUrl: './document-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCardComponent {
  @Input({ required: true }) doc!: DocumentFile;
  @Input() appearance: 'accent' | 'default' = 'default';
  @Output() show = new EventEmitter<DocumentFile>();

  @HostBinding('class') get hostClasses(): string {
    return cn('flex min-h-32 max-w-[370px] items-start rounded-sm pt-6 pr-9 pb-8 pl-7 shadow-xl', {
      'max-w-full flex-col rounded-md bg-yellow-500 px-5 pt-9 pb-7.5 md:px-18 md:py-10':
        this.appearance === 'accent',
    });
  }

  protected readonly cn = cn;

  onShow() {
    this.show.emit(this.doc);
  }

  getLabel(type: string) {
    if (type === 'pdf') {
      return 'Открыть файл';
    }

    return 'Скачать файл';
  }

  getIcon(type: string) {
    if (type === 'pdf') {
      return '/assets/icons/pdf.svg';
    }

    return '/assets/icons/docx.svg';
  }
}
