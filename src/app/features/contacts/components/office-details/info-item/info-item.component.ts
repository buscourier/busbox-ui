import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

@Component({
  selector: 'app-info-item',
  imports: [TuiIcon],
  templateUrl: './info-item.component.html',
  styleUrl: './info-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoItemComponent {
  @Input({ required: true }) icon!: 'point' | 'alarm' | 'union' | 'email';

  @HostBinding('class') get hostClasses(): string {
    return cn('grid grid-cols-[auto_1fr]');
  }
}
