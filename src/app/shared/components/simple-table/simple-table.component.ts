import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { cn } from '@core/utils';

export interface SimpleTableColumn {
  key: string;
  title: string;
}

export type SimpleTableRow = Record<string, string>;

@Component({
  selector: 'app-simple-table',
  imports: [],
  templateUrl: './simple-table.component.html',
  styleUrl: './simple-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTableComponent {
  @Input() columns: SimpleTableColumn[] = [];
  @Input() data: SimpleTableRow[] = [];

  get cellStyles() {
    return cn(
      'p-4 text-left text-sm',
      'first:rounded-tl-sm first:rounded-bl-sm last:rounded-tr-sm last:rounded-br-sm',
    );
  }
}
