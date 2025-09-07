import type { OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl } from '@angular/forms';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TUI_IS_IOS, type TuiStringHandler } from '@taiga-ui/cdk';
import { TuiHintDirective, TuiTextfield } from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiBadge,
  TuiChevron,
  TuiDataListWrapper,
  TuiFieldErrorContentPipe,
  TuiInputPhone,
  TuiSelect,
} from '@taiga-ui/kit';
import { distinctUntilChanged } from 'rxjs';

import type { ValidationLimits } from '@core/config';
import { VALIDATION_LIMITS } from '@core/tokens';
import { isObjectsEqual } from '@core/utils';

import { FIELD_VALIDATORS_FACTORY } from '@shared/forms';

import type { Individual } from '../../../types';

import { individualRoles, individualValidationErrors } from './individual.constants';
import type { IndividualForm } from './individual.types';

@Component({
  selector: 'app-individual',
  imports: [
    TuiBadge,
    ReactiveFormsModule,
    TuiFieldErrorContentPipe,
    TuiHintDirective,
    TuiTextfield,
    TuiChevron,
    TuiDataListWrapper,
    TranslocoPipe,
    TuiInputPhone,
    TuiDropdownMobile,
    TuiSelect,
  ],
  templateUrl: './individual.component.html',
  styleUrl: './individual.component.css',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: individualValidationErrors,
      deps: [TranslocoService],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndividualComponent implements OnInit {
  @Input() data: Individual | null = null;
  @Output() dataChange = new EventEmitter<Individual>();
  @Output() validationChange = new EventEmitter<boolean>();

  form!: IndividualForm;

  protected readonly isIos = inject(TUI_IS_IOS);

  protected get pattern(): string | null {
    return this.isIos ? '+[0-9-]{1,20}' : null;
  }

  protected readonly individualRoles = individualRoles;
  protected limits = inject<ValidationLimits>(VALIDATION_LIMITS);
  protected stringify: TuiStringHandler<{ value: string; label: string }> = (x) => `${x.label}`;

  private fieldValidators = inject(FIELD_VALIDATORS_FACTORY);
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);

  get lastName(): FormControl<string> {
    return this.form.controls.lastName;
  }

  get firstName(): FormControl<string> {
    return this.form.controls.firstName;
  }

  get middleName(): FormControl<string> {
    return this.form.controls.middleName;
  }

  get email(): FormControl<string> {
    return this.form.controls.email;
  }

  get phone(): FormControl<string> {
    return this.form.controls.phone;
  }

  get role(): FormControl<string> {
    return this.form.controls.role;
  }

  get availableLastNameLength(): number {
    const { lastName } = this.form.getRawValue();

    return this.limits.user.lastName.maxLength - lastName.length;
  }

  get availableFirstNameLength(): number {
    const { firstName } = this.form.getRawValue();

    return this.limits.user.firstName.maxLength - firstName.length;
  }

  get availableMiddleNameLength(): number {
    const { middleName } = this.form.getRawValue();

    return this.limits.user.middleName.maxLength - middleName.length;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormChanges();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      lastName: ['', this.fieldValidators.getValidators('user', 'lastName')],
      firstName: ['', this.fieldValidators.getValidators('user', 'firstName')],
      middleName: ['', this.fieldValidators.getValidators('user', 'middleName')],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', this.fieldValidators.getValidators('contact', 'phone')],
      role: ['', [Validators.required]],
    });

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  private setupFormChanges(): void {
    this.validationChange.emit(this.form.valid);

    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged((prev, curr) => isObjectsEqual(prev, curr)),
      )
      .subscribe(() => {
        this.validationChange.emit(this.form.valid);

        if (this.form.valid) {
          this.dataChange.emit(this.form.getRawValue());
        }
      });
  }
}
