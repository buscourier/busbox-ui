import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';

import type { EnhancedOrder } from '../../types';

@Component({
  selector: 'app-order-tabs',
  imports: [TuiButton, TuiChip],
  templateUrl: './order-tabs.component.html',
  styleUrl: './order-tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTabsComponent {
  @Input({ required: true }) tabs!: EnhancedOrder[];
  @Input() isActiveOrderValid = false;
  @Input() maxTabs = 4;

  add = output<void>();
  remove = output<string>();
  selectOrder = output<string>();

  addTab(): void {
    this.add.emit();
  }

  onRemoveTab(event: Event, tabId: string): void {
    event.stopPropagation();
    this.remove.emit(tabId);
  }

  onSelectOrder(tabId: string): void {
    this.selectOrder.emit(tabId);
  }
}
