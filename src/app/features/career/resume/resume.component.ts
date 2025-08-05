import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

import { ContactFormComponent } from '@shared/components/contact-form';

@Component({
  selector: 'app-resume',
  imports: [ContactFormComponent],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeComponent {
  readonly context = injectContext<TuiDialogContext<number, number>>();
}
