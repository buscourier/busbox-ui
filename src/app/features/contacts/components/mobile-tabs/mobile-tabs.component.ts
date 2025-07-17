import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';

import { cn } from '@core/utils';

@Component({
  selector: 'app-mobile-tabs',
  imports: [],
  templateUrl: './mobile-tabs.component.html',
  styleUrl: './mobile-tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `flex`,
  },
})
export class MobileTabsComponent implements OnInit {
  @Input({ required: true }) activeIndex = 0;
  @Output() tabChange = new EventEmitter<string>();

  readonly tabs = [
    { label: 'На карте', value: 'map', index: 0 },
    { label: 'Списком', value: 'list', index: 1 },
  ] as const;

  ngOnInit(): void {
    this.setActiveTab(this.activeIndex);
  }

  getButtonClasses(isActive: boolean): string {
    return cn(
      'p-5 flex-grow hover:opacity-80',
      'text-center text-sm text-gray-700',
      'border-b-2 border-gray-300',

      {
        'border-yellow-500 text-black': isActive,
      },
    );
  }

  setActiveTab(index: number): void {
    const tabValue = index === 1 ? 'list' : 'map';
    this.tabChange.emit(tabValue);
  }
}
