import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

import type { DeliveryCity, PickupCity } from '@shared/types';

@Component({
  selector: 'app-stat-card',
  imports: [TuiIcon],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  @Input() cities!: PickupCity[] | DeliveryCity[];
  @Input({ required: true }) title!: string;
  @Input() text!: string;
  @Input() count = 0;
  @Output() showCities = new EventEmitter<PickupCity[] | DeliveryCity[]>();

  @HostBinding('class') get hostClasses(): string {
    return cn(
      'mb-7 flex items-center gap-5',
      'md:flex-col md:items-start md:gap-x-0',
      'lg:mb-0 xl:mb-12 xl:flex-row xl:items-center xl:gap-8',
    );
  }

  onShowCities() {
    this.showCities.emit(this.cities);
  }
}
