import { NgTemplateOutlet } from '@angular/common';
import type { QueryList } from '@angular/core';
import { ChangeDetectionStrategy, Component, ContentChildren } from '@angular/core';

import { StepDirective } from './step.directive';

@Component({
  selector: 'app-steps',
  imports: [NgTemplateOutlet],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent {
  @ContentChildren(StepDirective) steps!: QueryList<StepDirective>;
}
