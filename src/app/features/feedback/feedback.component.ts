import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactFormComponent } from '@shared/components/contact-form';
import { PageLayoutComponent } from '@shared/layouts/page-layout';

@Component({
  selector: 'app-feedback',
  imports: [ContactFormComponent, PageLayoutComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {}
