import type { OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import type { FormGroup } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideTranslocoScope, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TUI_IS_IOS } from '@taiga-ui/cdk';
import { TuiHintDirective, TuiTextfield, TuiTextfieldComponent } from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiCheckbox,
  TuiFieldErrorContentPipe,
  TuiInputNumberDirective,
  TuiInputPhone,
} from '@taiga-ui/kit';
import { startWith } from 'rxjs';

import { FIELD_VALIDATORS_FACTORY } from '@shared/forms';

import type { AdditionalServices, Service } from '../../types';

import {
  AdditionalServiceId,
  AdditionalServiceName,
  INSURANCE_MAX_AMOUNT,
  INSURANCE_MIN_AMOUNT,
  INSURANCE_THRESHOLD_AMOUNT,
  MONETARY_SERVICES,
  RECIPIENT_PAYMENT_MAX_AMOUNT,
  RECIPIENT_PAYMENT_MIN_AMOUNT,
  servicesValidationErrors,
  SMS_SERVICES,
} from './additional-services.constants';
import type {
  MonetaryService,
  MonetaryServiceType,
  ServiceName,
  ServicesGroup,
  SmsService,
  SmsServiceType,
  ValueType,
} from './additional-services.types';

/**
 * Component for managing additional shipping services including:
 * - Insurance with dynamic pricing based on declared value
 * - Extended SMS notifications
 * - Sender SMS notifications
 * Each service can be enabled/disabled independently and has its own validation rules.
 */
@Component({
  selector: 'app-additional-services',
  imports: [
    ReactiveFormsModule,
    TuiFieldErrorContentPipe,
    TuiHintDirective,
    TuiCheckbox,
    TuiInputNumberDirective,
    TuiTextfieldComponent,
    TuiTextfield,
    TranslocoPipe,
    TuiInputPhone,
  ],
  templateUrl: './additional-services.component.html',
  styleUrl: './additional-services.component.css',
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: servicesValidationErrors,
      deps: [TranslocoService],
    },
    provideTranslocoScope({
      scope: 'entities/contacts',
      alias: 'contacts',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalServicesComponent implements OnChanges, OnInit {
  @Input({ required: true }) options!: Service[];
  @Input() data: AdditionalServices | null = null;
  @Output() validationChange = new EventEmitter<boolean>();
  @Output() dataChange = new EventEmitter<AdditionalServices>();

  protected readonly isIos = inject(TUI_IS_IOS);

  protected get pattern(): string | null {
    return this.isIos ? '+[0-9-]{1,20}' : null;
  }

  protected readonly INSURANCE_MIN_AMOUNT = INSURANCE_MIN_AMOUNT;
  protected readonly INSURANCE_MAX_AMOUNT = INSURANCE_MAX_AMOUNT;

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private fieldValidators = inject(FIELD_VALIDATORS_FACTORY);

  form = this.fb.group({
    insurance: this.createMonetaryServiceGroup(INSURANCE_MIN_AMOUNT, INSURANCE_MAX_AMOUNT),
    recipientPayment: this.createMonetaryServiceGroup(
      RECIPIENT_PAYMENT_MIN_AMOUNT,
      RECIPIENT_PAYMENT_MAX_AMOUNT,
    ),
    extendedSms: this.createSmsServiceGroup(),
    senderSms: this.createSmsServiceGroup(),
  });

  additionalServices = {
    insurance: [] as Service[],
    extendedSms: null as Service | null,
    senderSms: null as Service | null,
    recipientPayment: null as Service | null,
  };

  get insurance(): FormGroup<MonetaryService> {
    return this.form.controls.insurance;
  }

  get recipientPayment(): FormGroup<MonetaryService> {
    return this.form.controls.recipientPayment;
  }

  get extendedSms(): FormGroup<SmsService> {
    return this.form.controls.extendedSms;
  }

  get senderSms(): FormGroup<SmsService> {
    return this.form.controls.senderSms;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.initializeServices();
    }

    if (changes['data']) {
      this.updateFormData();
    }
  }

  ngOnInit(): void {
    this.setupFormControls();
    this.setupValueChanges();
    this.setupStatusChanges();
  }

  private createMonetaryServiceGroup(min: number, max: number): FormGroup<MonetaryService> {
    return this.fb.group({
      enabled: [false],
      amount: [0, [Validators.required, Validators.min(min), Validators.max(max)]],
      serviceId: [''],
    });
  }

  private createSmsServiceGroup(): FormGroup<SmsService> {
    return this.fb.group({
      enabled: [false],
      phone: ['', this.fieldValidators.getValidators('contact', 'phone')],
      serviceId: [''],
    });
  }

  private initializeServices(): void {
    this.additionalServices = {
      insurance: this.options
        .filter((service) => service.subgroup_id === AdditionalServiceId.INSURANCE)
        .sort((a, b) => Number(a.price || 0) - Number(b.price || 0)),
      recipientPayment:
        this.options.find((service) => service.name === AdditionalServiceName.RECIPIENT_PAYMENT) ||
        null,
      extendedSms:
        this.options.find((service) => service.name === AdditionalServiceName.EXTENDED_SMS) || null,
      senderSms:
        this.options.find((service) => service.name === AdditionalServiceName.SENDER_SMS) || null,
    };
  }

  /**
   * Updates form when external data changes (e.g. when editing existing order)
   * If no data provided, resets form to initial state
   */
  private updateFormData(): void {
    if (this.data) {
      const { insurance, extendedSms, senderSms, recipientPayment } = this.data;
      this.form.patchValue(
        {
          insurance: {
            enabled: !!insurance,
            amount: insurance?.amount || 0,
            serviceId: insurance?.serviceId || '',
          },
          recipientPayment: {
            enabled: !!recipientPayment,
            amount: recipientPayment?.amount || 0,
            serviceId: recipientPayment?.serviceId || '',
          },
          extendedSms: {
            enabled: !!extendedSms,
            phone: extendedSms?.phone || '',
            serviceId: extendedSms?.serviceId || '',
          },
          senderSms: {
            enabled: !!senderSms,
            phone: senderSms?.phone || '',
            serviceId: senderSms?.serviceId || '',
          },
        },
        { emitEvent: false },
      );
    } else {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.form.reset(
      {
        insurance: { enabled: false, amount: 0, serviceId: '' },
        extendedSms: { enabled: false, phone: '', serviceId: '' },
        senderSms: { enabled: false, phone: '', serviceId: '' },
        recipientPayment: { enabled: false, amount: 0, serviceId: '' },
      },
      { emitEvent: false },
    );
  }

  private setupFormControls(): void {
    this.setupMonetaryServiceControls();
    this.setupSmsServiceControls();
  }

  private setupMonetaryServiceControls() {
    Object.keys(this.additionalServices)
      .filter((service): service is MonetaryServiceType =>
        MONETARY_SERVICES.includes(service as MonetaryServiceType),
      )
      .forEach((name) => {
        this.toggleServiceControl(name as ServiceName, 'amount');
      });
  }

  private setupSmsServiceControls() {
    Object.keys(this.additionalServices)
      .filter((service): service is SmsServiceType =>
        SMS_SERVICES.includes(service as SmsServiceType),
      )
      .forEach((name) => {
        this.toggleServiceControl(name as ServiceName, 'phone');
      });
  }

  /**
   * Emits form validation state to parent component
   * to coordinate with other form sections if they exist
   */
  private setupValueChanges(): void {
    this.setupInsuranceValueChanges();
    this.setupRecipientPaymentValueChanges();
    this.setupSmsServicesValueChanges();
    this.setupFormValueChanges();
  }

  private setupStatusChanges(): void {
    this.form.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.validationChange.emit(this.form.valid));
  }

  private setupInsuranceValueChanges(): void {
    this.insurance.controls.amount?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const serviceId = this.getInsuranceServiceId(value || 0);
        if (serviceId) {
          this.form.patchValue({ insurance: { serviceId } }, { emitEvent: false });
        }
      });
  }

  private setupRecipientPaymentValueChanges(): void {
    this.recipientPayment.controls.enabled?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((enabled) => {
        if (enabled) {
          const service = this.additionalServices['recipientPayment'];
          if (service && 'id' in service) {
            this.form.patchValue({
              ['recipientPayment']: { serviceId: service.id, amount: 1 },
            });
          }
        }
      });
  }

  private setupSmsServicesValueChanges(): void {
    Object.keys(this.additionalServices)
      .filter((service): service is SmsServiceType =>
        SMS_SERVICES.includes(service as SmsServiceType),
      )
      .forEach((service) => {
        this.form
          .get(`${service}.enabled`)
          ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((enabled) => {
            if (enabled) {
              const smsService = this.additionalServices[service];
              if (smsService && 'id' in smsService) {
                this.form.patchValue({ [service]: { serviceId: smsService.id } });
              }
            }
          });
      });
  }

  private setupFormValueChanges(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const formValue = this.form.value;
      this.dataChange.emit(this.mapFormValueToData(formValue));
    });
  }

  private mapFormValueToData(formValue: ServicesGroup): AdditionalServices {
    return {
      insurance: formValue.insurance?.enabled
        ? {
            serviceId: formValue.insurance.serviceId || '',
            amount: formValue.insurance.amount || 0,
            displayName: 'deliveryDetails.additionalServices.types.insurance',
            price: this.getServicePrice(formValue.insurance.serviceId ?? null),
          }
        : null,
      recipientPayment: formValue.recipientPayment?.enabled
        ? {
            serviceId: formValue.recipientPayment.serviceId || '',
            amount: formValue.recipientPayment.amount || 0,
            displayName: 'deliveryDetails.additionalServices.types.recipientPayment',
            price: this.getServicePrice(formValue.recipientPayment.serviceId ?? null),
          }
        : null,
      extendedSms: formValue.extendedSms?.enabled
        ? {
            serviceId: formValue.extendedSms.serviceId || '',
            phone: formValue.extendedSms.phone || '',
            displayName: 'deliveryDetails.additionalServices.types.extendedSms',
            price: this.getServicePrice(formValue.extendedSms.serviceId ?? null),
          }
        : null,
      senderSms: formValue.senderSms?.enabled
        ? {
            serviceId: formValue.senderSms.serviceId || '',
            phone: formValue.senderSms.phone || '',
            displayName: 'deliveryDetails.additionalServices.types.senderSms',
            price: this.getServicePrice(formValue.senderSms.serviceId ?? null),
          }
        : null,
    };
  }

  /**
   * Returns insurance service ID based on declared value:
   * - For values <= 15000, returns ID of the basic insurance rate (first in array)
   * - For values > 15000, returns ID of the premium insurance rate (second in array)
   */
  private getInsuranceServiceId(value: number): string | null {
    const insuranceServices = this.additionalServices.insurance;
    if (!insuranceServices?.length) return null;
    return value <= INSURANCE_THRESHOLD_AMOUNT
      ? insuranceServices[0]?.id
      : insuranceServices[1]?.id;
  }

  /**
   * Toggles the enabled/disabled state of a specific form control based on the value of
   * a corresponding checkbox.
   * Synchronizes the initial state and listens to checkbox value changes to update the
   * control state dynamically.
   *
   * @param name - The name of the service (e.g., 'insurance', 'extendedSms', 'senderSms').
   * @param value - The name of the value field to toggle (e.g., 'declaredValue', 'phone').
   */
  private toggleServiceControl(name: ServiceName, value: ValueType): void {
    this.form
      .get(`${name}.enabled`)
      ?.valueChanges.pipe(
        startWith(this.form.get(`${name}.enabled`)?.value),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((enabled) => {
        const control = this.form.get(`${name}.${value}`);

        if (enabled) {
          control?.enable();
        } else {
          control?.disable();
        }
      });
  }

  private getServicePrice(serviceId: string | null): string {
    return this.options.find((option) => option.id === serviceId)?.price || '';
  }
}
