import { inject, TemplateRef, Directive } from '@angular/core';

@Directive({
  selector: '[appStep]',
  standalone: true,
})
export class StepDirective {
  public template = inject(TemplateRef<unknown>);
}
