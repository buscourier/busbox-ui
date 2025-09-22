import { computed, type OnInit, signal } from '@angular/core';
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
import { MaskitoDirective } from '@maskito/angular';
import { type MaskitoOptions } from '@maskito/core';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { TUI_IS_IOS, type TuiStringHandler } from '@taiga-ui/cdk';
import { TuiHintDirective, TuiTextfield } from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiChevron,
  TuiDataListWrapper,
  TuiFieldErrorContentPipe,
  TuiInputPhone,
  TuiSelectDirective,
} from '@taiga-ui/kit';
import { distinctUntilChanged, startWith } from 'rxjs';

import type { ValidationLimits } from '@core/config';
import { VALIDATION_LIMITS } from '@core/tokens';
import { isObjectsEqual } from '@core/utils';

import { FIELD_VALIDATORS_FACTORY } from '@shared/forms';

import { type Sender, SenderDocument, type SenderDocumentOption } from '../../../types';

import { defaultDocument, senderDocuments, senderValidationErrors } from './sender.constants';
import type { SenderForm } from './sender.types';

@Component({
  selector: 'app-sender',
  imports: [
    ReactiveFormsModule,
    TuiHintDirective,
    TuiFieldErrorContentPipe,
    TuiTextfield,
    TuiChevron,
    TuiDataListWrapper,
    TranslocoPipe,
    TuiInputPhone,
    TuiDropdownMobile,
    TuiSelectDirective,
    MaskitoDirective,
  ],
  templateUrl: './sender.component.html',
  styleUrl: './sender.component.css',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: senderValidationErrors,
      deps: [TranslocoService],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SenderComponent implements OnInit {
  @Input() data: Sender | null = null;
  @Output() dataChange = new EventEmitter<Sender>();
  @Output() validationChange = new EventEmitter<boolean>();

  form!: SenderForm;

  protected readonly isIos = inject(TUI_IS_IOS);

  protected get pattern(): string | null {
    return this.isIos ? '+[0-9-]{1,20}' : null;
  }

  protected stringify: TuiStringHandler<SenderDocumentOption> = (x) => `${x.label}`;
  protected limits = inject<ValidationLimits>(VALIDATION_LIMITS);
  protected readonly senderDocuments = senderDocuments;

  protected documentMask = computed(() => this.getDocumentMask(this.selectedDocument()));
  protected documentPlaceholder = computed(() =>
    this.getDocumentPlaceholder(this.selectedDocument()),
  );

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private fieldValidators = inject(FIELD_VALIDATORS_FACTORY);
  private selectedDocument = signal<SenderDocumentOption | null>(null);

  get fullName(): FormControl<string> {
    return this.form.controls.fullName;
  }

  get document(): FormControl<SenderDocumentOption> {
    return this.form.controls.document;
  }

  get documentNumber(): FormControl<string> {
    return this.form.controls.documentNumber;
  }

  get phone(): FormControl<string> {
    return this.form.controls.phone;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormChanges();
    this.selectedDocument.set(this.document.value);
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      fullName: ['', this.fieldValidators.getValidators('user', 'fullName')],
      document: [defaultDocument, [Validators.required]],
      documentNumber: ['', this.fieldValidators.getValidators('document', 'passport', 'number')],
      phone: ['', this.fieldValidators.getValidators('contact', 'phone')],
    });

    if (this.data) {
      this.form.patchValue(this.data);
    }

    this.document.valueChanges
      .pipe(startWith(this.data?.document || defaultDocument), takeUntilDestroyed(this.destroyRef))
      .subscribe((doc) => {
        console.log('doc.value', doc.value);

        const validatorType =
          doc.value === SenderDocument.DRIVER_LICENSE
            ? 'driverLicense'
            : doc.value === SenderDocument.PASSPORT
              ? 'passport'
              : 'other';

        this.documentNumber.setValidators(
          this.fieldValidators.getValidators(
            'document',
            validatorType as keyof ValidationLimits['document'],
            'number',
          ),
        );
        this.documentNumber.updateValueAndValidity();
      });
  }

  private setupFormChanges(): void {
    this.validationChange.emit(this.form.valid);

    this.document.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selectedDocument: SenderDocumentOption) => {
        this.selectedDocument.set(selectedDocument);

        this.documentNumber.setValue('');
      });

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

  private getDocumentMask(document: SenderDocumentOption | null): MaskitoOptions {
    if (!document) {
      return { mask: [] };
    }

    switch (document.value) {
      case SenderDocument.PASSPORT:
        return {
          mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        };

      case SenderDocument.DRIVER_LICENSE:
        return {
          mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        };

      default:
        return { mask: /^.{0,20}$/ };
    }
  }

  private getDocumentPlaceholder(document: SenderDocumentOption | null): string {
    if (!document) {
      return '';
    }

    switch (document.value) {
      case SenderDocument.PASSPORT:
        return 'XXXX XXXXXX';
      case SenderDocument.DRIVER_LICENSE:
        return 'XX XX XXXXXX';
      default:
        return '';
    }
  }
}
