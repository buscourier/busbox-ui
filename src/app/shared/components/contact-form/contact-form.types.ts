import type { FormControl, FormGroup } from '@angular/forms';

export type ContactForm = FormGroup<{
  userName: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  message: FormControl<string>;
  processingAccepted: FormControl<boolean>;
}>;

export interface ContactFormPayload {
  formTitle: string;
  userName: string;
  phone: string;
  email: string;
  message: string;
}
