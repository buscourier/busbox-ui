import type { FormControl, FormGroup } from '@angular/forms';

export type RegisterForm = FormGroup<{
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  // agreeTerms: FormControl<boolean>;
}>;
