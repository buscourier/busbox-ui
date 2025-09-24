import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiHint, TuiIcon } from '@taiga-ui/core';

import type { StepView } from '../types';

@Component({
  selector: 'app-stepper',
  imports: [TuiIcon, TuiHint],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  @Input({ required: true }) steps!: StepView[] | null;
  @Input() isLegalEntity = false;

  getStepClasses(step: StepView): string {
    const baseClasses = 'bg-gray-200 text-gray-700';

    if (step.isCompleted) {
      return 'bg-yellow-500 text-white shadow-lg';
    }

    if (step.isActive) {
      if (step.isValid) {
        return 'bg-green-500 text-white ring-4 ring-green-200 shadow-lg animate-pulse';
      } else {
        return 'bg-red-400 text-white ring-4 ring-red-200 shadow-lg';
      }
    }

    return baseClasses;
  }
}
