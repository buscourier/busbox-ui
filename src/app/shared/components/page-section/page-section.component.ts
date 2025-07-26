import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { cn } from '@core/utils';

@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrl: './page-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSectionComponent {
  @Input() type: 'full-width' | 'default' = 'default';

  @HostBinding('class') get hostClasses(): string {
    return cn('mb-16 block md:mb-20 xl:mb-32');
  }
}
