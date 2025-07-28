import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-pdf-actions',
  imports: [TuiButton, TuiIcon],
  templateUrl: './pdf-actions.component.html',
  styleUrl: './pdf-actions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfActionsComponent {
  @Input() content!: string;
  @Input() printLabel = 'Печать';
  @Input() downloadLabel = 'Скачать';

  @Output() print = new EventEmitter<string>();
  @Output() download = new EventEmitter<string>();
}
