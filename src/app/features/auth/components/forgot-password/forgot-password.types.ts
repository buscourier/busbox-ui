import type { FormControl, FormGroup } from '@angular/forms';

export type ForgotPasswordForm = FormGroup<{
  email: FormControl<string>;
}>;
