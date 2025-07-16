import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-mobile-tabs',
  imports: [],
  templateUrl: './mobile-tabs.component.html',
  styleUrl: './mobile-tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileTabsComponent implements OnInit {
  @Input({ required: true }) activeIndex = 0;
  @Output() tabChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.setActiveTab(this.activeIndex);
  }

  readonly tabs = [
    { label: 'На карте', value: 'map', index: 0 },
    { label: 'Списком', value: 'list', index: 1 },
  ] as const;

  setActiveTab(index: number): void {
    const tabValue = index === 1 ? 'list' : 'map';
    this.tabChange.emit(tabValue);
  }
}
