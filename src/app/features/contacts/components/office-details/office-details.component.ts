import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiButton, TuiIcon, TuiScrollbar } from '@taiga-ui/core';

import { BreakpointDirective } from '@core/directives';

import type { Office } from '@shared/types';

@Component({
  selector: 'app-office-details',
  imports: [BreakpointDirective, TuiButton, TuiIcon, TuiScrollbar],
  templateUrl: './office-details.component.html',
  styleUrl: './office-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeDetailsComponent {
  @Input({ required: true }) office!: Office;
  @Output() close = new EventEmitter<void>();

  getOfficeStatus(office: Office) {
    console.log('office', office);
    return '';
  }

  closeDetails(): void {
    this.close.emit();
  }
}
