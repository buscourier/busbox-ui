import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiButton, TuiIcon, TuiScrollbar } from '@taiga-ui/core';

import { BreakpointDirective } from '@core/directives';

import type { Office } from '@shared/types';

@Component({
  selector: 'app-point-details',
  imports: [TuiButton, TuiScrollbar, TuiIcon, BreakpointDirective],
  templateUrl: './point-details.component.html',
  styleUrl: './point-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointDetailsComponent {
  @Input({ required: true }) point!: Office;
  @Output() close = new EventEmitter<void>();

  getPointStatus(point: Office) {
    console.log('point', point);
    return '';
  }

  closeDetails(): void {
    this.close.emit();
  }
}
