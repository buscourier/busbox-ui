import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiButton, TuiHint, TuiScrollbar } from '@taiga-ui/core';

import type { Office } from '@shared/types';

@Component({
  selector: 'app-point-list',
  imports: [TuiButton, TuiScrollbar, TuiHint],
  templateUrl: './point-list.component.html',
  styleUrl: './point-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointListComponent {
  @Input({ required: true }) activePoint!: Office | null;
  @Input({ required: true }) points!: Office[];

  @Output() select = new EventEmitter<string>();

  onSelect(id: string) {
    this.select.emit(id);
  }
}
