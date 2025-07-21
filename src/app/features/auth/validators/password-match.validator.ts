import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    // Skip validation if fields don't exist or if the password is already invalid
    if (!password || !confirmPassword || !confirmPassword.value || password.invalid) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      // Set passwordMismatch error on the confirmPassword field
      const currentErrors = confirmPassword.errors || {};
      confirmPassword.setErrors({ ...currentErrors, passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear the passwordMismatch error when passwords match while preserving other errors
      if (confirmPassword.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordMismatch, ...otherErrors } = confirmPassword.errors;
        confirmPassword.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
      return null;
    }
  };
}
