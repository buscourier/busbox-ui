import { NgTemplateOutlet } from '@angular/common';
import { HostBinding, Input, type QueryList } from '@angular/core';
import { ChangeDetectionStrategy, Component, ContentChildren } from '@angular/core';

import { cn } from '@core/utils';

import { StepDirective } from './step.directive';

@Component({
  selector: 'app-steps',
  imports: [NgTemplateOutlet],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent {
  @Input() separated = false;
  @ContentChildren(StepDirective) steps!: QueryList<StepDirective>;

  @HostBinding('class') get hostClasses(): string {
    return cn('block max-w-[720px]');
  }

  get stepClasses(): string {
    return cn(
      'before:step-point mb-10 text-base/6',
      'grid grid-cols-[40px_1fr] items-center gap-x-5 md:gap-x-8',
      {
        'border-t border-gray-300 pt-10 not-first:mt-10': this.separated,
      },
    );
  }
}
