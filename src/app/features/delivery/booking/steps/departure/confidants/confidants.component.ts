import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  type OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, type FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TUI_IS_IOS, type TuiStringHandler } from '@taiga-ui/cdk';
import { TuiHint, TuiTextfield } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapper,
  TuiFieldErrorContentPipe,
  TuiInputPhone,
  TuiSelect,
  TuiSkeleton,
} from '@taiga-ui/kit';
import { distinctUntilChanged, type Observable, startWith, take } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ConfidantsService } from '@core/services';
import { isObjectsEqual } from '@core/utils';

import { FIELD_VALIDATORS_FACTORY } from '@shared/forms';
import type { Confidant } from '@shared/types';

import { type Sender, SenderDocument } from '@delivery/booking/types';

import type { ConfidantForm } from './confidants.types';

@Component({
  selector: 'app-confidants',
  imports: [
    TuiTextfield,
    TuiSelect,
    TuiChevron,
    TuiFieldErrorContentPipe,
    TuiHint,
    ReactiveFormsModule,
    TuiDropdownMobile,
    TuiDataListWrapper,
    AsyncPipe,
    TranslocoPipe,
    TuiInputPhone,
    TuiSkeleton,
  ],
  templateUrl: './confidants.component.html',
  styleUrl: './confidants.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block mb-10 md:mb-16',
  },
})
export class ConfidantsComponent implements OnInit {
  @Input({ required: true }) currentUserId!: string;
  @Output() dataChange = new EventEmitter<Sender>();
  @Output() validationChange = new EventEmitter<boolean>();

  form!: ConfidantForm;
  confidants$!: Observable<Confidant[]>;

  protected readonly isIos = inject(TUI_IS_IOS);

  protected get pattern(): string | null {
    return this.isIos ? '+[0-9-]{1,20}' : null;
  }

  protected stringify: TuiStringHandler<Confidant> = (x) => `${x.name}`;

  private readonly confidantsService = inject(ConfidantsService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private fieldValidators = inject(FIELD_VALIDATORS_FACTORY);

  get confidant(): FormControl<Confidant | null> {
    return this.form.controls.confidant;
  }

  get phone(): FormControl<string | null> {
    return this.form.controls.phone;
  }

  ngOnInit(): void {
    this.confidants$ = this.confidantsService.getConfidants(this.currentUserId);

    this.initForm();
    this.initDefaultValues();
    this.setupFormSubscriptions();
    // this.validationChange.emit(this.form.valid);
  }

  private initForm(): void {
    this.form = this.fb.group({
      confidant: this.fb.control<Confidant | null>(null, [Validators.required]),
      phone: ['', this.fieldValidators.getValidators('contact', 'phone')],
    });
  }

  private initDefaultValues(): void {
    this.confidants$
      .pipe(
        filter((confidants) => confidants && confidants.length > 0),
        filter(() => !this.confidant.value),
        map((confidants) => confidants[0]),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((firstConfidant) => {
        this.form.patchValue({
          confidant: firstConfidant,
          phone: firstConfidant.phone,
        });

        this.form.updateValueAndValidity();
      });
  }

  private setupFormSubscriptions(): void {
    this.confidant.valueChanges
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe((confidant) => {
        this.phone.patchValue(confidant.phone);
      });

    this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged((prev, curr) => isObjectsEqual(prev, curr)),
      )
      .subscribe(() => {
        this.validationChange.emit(this.form.valid);

        if (this.form.valid) {
          const { confidant, phone } = this.form.getRawValue();

          this.dataChange.emit({
            fullName: confidant?.name || '',
            document: {
              value: SenderDocument.PASSPORT,
              label: 'Паспорт',
            },
            documentNumber: '',
            phone: phone || '',
          });
        }
      });
  }
}
