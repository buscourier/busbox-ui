import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import type { DocumentFile } from '@shared/types';

@Component({
  selector: 'app-document-card',
  imports: [TuiIcon],
  templateUrl: './document-card.component.html',
  styleUrl: './document-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCardComponent {
  @Input({ required: true }) doc!: DocumentFile;
  @Output() show = new EventEmitter<DocumentFile>();

  onShow() {
    this.show.emit(this.doc);
  }
}
