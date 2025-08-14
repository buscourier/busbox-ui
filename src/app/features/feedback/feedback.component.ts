import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactFormComponent } from '@shared/components/contact-form';

@Component({
  selector: 'app-feedback',
  imports: [ContactFormComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {}
