import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  type FormGroup,
  ReactiveFormsModule,
  type ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiButton, TuiHintDirective, TuiTextfield, TuiTextfieldComponent } from '@taiga-ui/core';
import {
  TUI_CONFIRM,
  TuiButtonLoading,
  TuiFieldErrorContentPipe,
  TuiSkeleton,
} from '@taiga-ui/kit';
import { filter, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ORGANIZATION_FIELD_ALIASES, PERSONAL_FIELD_ALIASES } from '../../constants';
import { ProfileFacade } from '../../profile.facade';
import type { ProfileField, ProfileViewModel } from '../../types';

type ProfileFormValue = Record<string, string | null>;
type ProfileFormControls = Record<string, FormControl<string | null>>;
type ProfileForm = FormGroup<ProfileFormControls>;

interface FormControlConfig {
  value: string;
  disabled: boolean;
}

export interface CanDeactivateComponent {
  canDeactivate(): boolean | Observable<boolean>;
}

@Component({
  selector: 'app-profile-edit',
  imports: [
    AsyncPipe,
    TuiSkeleton,
    ReactiveFormsModule,
    TuiFieldErrorContentPipe,
    TuiTextfieldComponent,
    TuiHintDirective,
    TuiTextfield,
    TuiButton,
    TuiButtonLoading,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEditComponent implements OnInit, CanDeactivateComponent {
  vm$!: Observable<ProfileViewModel>;

  protected readonly PERSONAL_FIELD_ALIASES = PERSONAL_FIELD_ALIASES;
  protected readonly ORGANIZATION_FIELD_ALIASES = ORGANIZATION_FIELD_ALIASES;

  private initialFormSnapshot: ProfileFormValue = {};

  private readonly profileFacade = inject(ProfileFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly dialogs = inject(TuiResponsiveDialogService);

  form!: ProfileForm;

  ngOnInit(): void {
    this.vm$ = this.profileFacade.getViewModel();
    this.initializeForm();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload = this.getChangedFields();

    this.profileFacade.updateFields(payload);
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  hasRealChanges(): boolean {
    return Object.keys(this.getChangedFields()).length > 0;
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (!this.hasRealChanges()) {
      return true;
    }

    return this.showConfirmDialog();
  }

  private initializeForm(): void {
    this.vm$
      .pipe(
        map((vm) => vm.fields),
        filter((fields) => fields.isLoaded),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((fields) => {
        this.buildForm(fields.organizationFields);
      });
  }

  private buildForm(fields: ProfileField[]): void {
    const formControls: ProfileFormControls = {};

    fields.forEach((field) => {
      const config: FormControlConfig = {
        value: field.value || '',
        disabled: field.edit === '0',
      };

      const validators = this.getValidatorsForField(field);

      formControls[field.alias] = new FormControl<string | null>(config, validators);
    });

    this.form = this.fb.group(formControls) as ProfileForm;
    this.saveInitialSnapshot();
  }

  private getValidatorsForField(field: ProfileField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    switch (field.alias) {
      case 'email':
        validators.push(Validators.email);
        break;
      case 'phone':
        validators.push(Validators.pattern(/^\+?[1-9]\d{1,14}$/));
        break;
      case 'inn':
        validators.push(Validators.pattern(/^\d{10,12}$/));
        break;
      default:
        break;
    }

    return validators;
  }

  private getChangedFields(): ProfileFormValue {
    const changedFields: ProfileFormValue = {};
    const currentValues = this.form.getRawValue();

    Object.keys(currentValues).forEach((fieldName) => {
      const currentValue = currentValues[fieldName];
      const initialValue = this.initialFormSnapshot[fieldName];

      if (currentValue !== initialValue && currentValue !== null) {
        changedFields[fieldName] = currentValue;
      }
    });

    return changedFields;
  }

  private saveInitialSnapshot(): void {
    this.initialFormSnapshot = { ...this.form.getRawValue() };
  }

  private showConfirmDialog(): Observable<boolean> {
    return this.dialogs.open<boolean>(TUI_CONFIRM, {
      label: 'Покинуть страницу?',
      size: 's',
      data: {
        content: 'У вас есть несохраненные изменения.',
        yes: 'Да, покинуть',
        no: 'Отмена',
      },
    });
  }
}
