import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

import type { DocumentFile, DocumentSize } from '../../types';

@Component({
  selector: 'app-document-card',
  imports: [TuiIcon, TuiButton],
  templateUrl: './document-card.component.html',
  styleUrl: './document-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCardComponent {
  @Input({ required: true }) doc!: DocumentFile;
  @Input() size: DocumentSize = 'sm';
  @Output() show = new EventEmitter<DocumentFile>();

  protected readonly cn = cn;

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'group/card w-full max-w-[370px] cursor-pointer p-6',
      'rounded-2xl border border-gray-100 bg-white',
      'focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none',
      'select-none',
      {
        'max-w-[850px] p-8': this.isCardLarge,
        'shadow-sm transition-all active:translate-y-[2px] active:shadow-none': !this.isCardLarge,
      },
    );
  }

  @HostBinding('attr.tabindex') tabindex = 0;

  @HostListener('click')
  onClick(): void {
    if (!this.isCardLarge) {
      this.onShow();
    }
  }

  @HostListener('keydown.enter')
  @HostListener('keydown.space')
  onKeyboardActivation(): void {
    if (!this.isCardLarge) {
      this.onShow();
    }
  }

  get isCardLarge(): boolean {
    return this.size === 'lg';
  }

  get isPdf(): boolean {
    return this.doc.type === 'pdf';
  }

  get isDocx(): boolean {
    return this.doc.type === 'docx';
  }

  get cardContentClass(): string {
    return cn('flex items-center gap-3', {
      'items-start gap-5': this.isCardLarge,
    });
  }

  get iconClass(): string {
    return cn('ml-auto text-gray-400 transition-all group-hover/card:text-yellow-500', {
      'group-active/card:translate-y-1': this.isDocx,
      'group-active/card:scale-120': this.isPdf,
    });
  }

  get iconWrapperClass(): string {
    return cn(
      'relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-yellow-500',
      'rounded-xl text-xl',
      {
        // 'bg-blue-50 text-blue-400': this.isDocx,
        // 'bg-red-50 text-red-400': this.isPdf,
        'h-16 w-16': this.isCardLarge,
      },
    );
  }

  get iconLabelClass(): string {
    return cn(
      'absolute text-sm font-bold text-black uppercase',
      'translate-y-100 transition-all group-hover/card:translate-y-0',
      {
        // 'text-blue-400': this.isDocx,
        // 'text-red-400': this.isPdf,
        'text-md': this.isCardLarge,
      },
    );
  }

  get icon(): string {
    switch (this.doc.type) {
      case 'pdf':
        return '@tui.eye';
      case 'docx':
        return '@tui.download';
    }
  }

  get titleClass(): string {
    return cn('line-clamp-2 text-sm font-medium text-gray-900 transition-colors', {
      'text-2xl': this.isCardLarge,
      'mb-3': this.isCardLarge,
    });
  }

  onShow() {
    this.show.emit(this.doc);
  }

  // getLabel(type: string) {
  //   if (type === 'pdf') {
  //     return 'Открыть файл';
  //   }
  //
  //   return 'Скачать файл';
  // }
  //
  // getIcon(type: string) {
  //   if (type === 'pdf') {
  //     return '/assets/icons/pdf.svg';
  //   }
  //
  //   return '/assets/icons/docx.svg';
  // }
}
