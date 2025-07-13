import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiButton, TuiHint, TuiScrollbar } from '@taiga-ui/core';

import type { Office } from '@shared/types';

@Component({
  selector: 'app-office-list',
  imports: [TuiButton, TuiScrollbar, TuiHint],
  templateUrl: './office-list.component.html',
  styleUrl: './office-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeListComponent {
  @Input({ required: true }) activeOffice!: Office | null;
  @Input({ required: true }) offices!: Office[];

  @Output() select = new EventEmitter<string>();

  onSelect(id: string) {
    this.select.emit(id);
  }
}
