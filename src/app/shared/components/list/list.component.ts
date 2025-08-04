import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  type QueryList,
} from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

import { cn } from '@core/utils';

import { ListItemDirective } from './list-item.directive';

type IconType = 'check-circle' | 'circle-check-big' | 'arrow-right' | 'none';
type IconColor = 'gray' | 'green' | 'blue' | 'yellow';

@Component({
  selector: 'app-list',
  imports: [NgTemplateOutlet, TuiIcon],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  @Input() icon: IconType = 'circle-check-big';
  @Input() spacing: 'sm' | 'md' | 'lg' = 'md';
  @Input() iconSize: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() iconColor?: IconColor;
  @ContentChildren(ListItemDirective) items!: QueryList<ListItemDirective>;

  @HostBinding('class') get hostClasses(): string {
    return cn('block');
  }

  get listClasses() {
    return cn('flex flex-col', {
      'gap-y-2.5': this.spacing === 'sm',
      'gap-y-3': this.spacing === 'md',
      'gap-y-4': this.spacing === 'lg',
    });
  }

  get listItemClass() {
    return cn('flex items-center gap-x-2 leading-6', {
      'text-sm leading-4': this.spacing === 'sm',
    });
  }

  get iconSizeValue() {
    switch (this.iconSize) {
      case 'xs':
        return 0.75;
      case 'sm':
        return 1;
      case 'lg':
        return 1.5;
      default:
        return 1.15;
    }
  }

  get iconColorClass(): string {
    if (this.iconColor) {
      const colorMap: Record<IconColor, string> = {
        gray: 'text-gray-500',
        green: 'text-green-500',
        blue: 'text-blue-500',
        yellow: 'text-yellow-500',
      };
      return colorMap[this.iconColor];
    }

    const defaultColorMap: Record<IconType, string> = {
      'check-circle': 'text-gray-500',
      'arrow-right': 'text-blue-500',
      'circle-check-big': 'text-yellow-500',
      none: '',
    };

    return defaultColorMap[this.icon];
  }
}
