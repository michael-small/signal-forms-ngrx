import { JsonPipe } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  hidden,
  required,
  schema,
  TreeValidationResult,
} from '@angular/forms/signals';
import { BillPayFormModel, DomainAndFormMappings } from './bill-pay.model';
import { BillPayService } from './bill-pay.service';
import { rxResource } from '@angular/core/rxjs-interop';

const defaultFormModel: BillPayFormModel = {
  name: '',
  method: {
    type: 'bank',
    card: {
      cardNumber: '',
      securityCode: '',
      expiration: '',
    },
    bank: {
      accountNumber: '',
      routingNumber: '',
    },
  },
};

// Using `hidden` for the irrelevant part is good. A discriminated union is bad.
const billPaySchema = schema<BillPayFormModel>((billPay) => {
  // Hide credit card details when user has selected a method other than credit card.
  hidden(billPay.method.card, {
    when: ({ valueOf }) => valueOf(billPay.method.type) !== 'card',
  });
  // Hide bank account details when user has selected a method other than bank account.
  hidden(billPay.method.bank, {
    when: ({ valueOf }) => valueOf(billPay.method.type) !== 'bank',
  });

  // I imagine there is a better way than doing this individually for each field
  required(billPay.name);
  required(billPay.method.type);

  // If card is not hidden
  required(billPay.method.card.cardNumber);
  required(billPay.method.card.securityCode);
  required(billPay.method.card.expiration);

  // If bank is not hidden
  required(billPay.method.bank.accountNumber);
  required(billPay.method.bank.routingNumber);
});

@Component({
  selector: 'app-static-over-dynamic-form-models',
  imports: [FormField, FormRoot, JsonPipe],
  templateUrl: './static-over-dynamic-form-models.html',
  styles: `
    .flex {
      display: flex;
      gap: 1rem;
    }
  `,
})
export class StaticOverDynamicFormModels {
  readonly #billPayService = inject(BillPayService);

  protected throwError = signal(false); // for forcing error

  // Faked HTTP data w/delay
  private billResource = rxResource({
    stream: () => this.#billPayService.getCurrentBillingInfo(),
  });

  // Forms require writable signal data as an input
  // We can use `linkedSignal` to transform the resource data (domain model) into the form model.
  private billModel = linkedSignal({
    source: this.billResource.value,
    computation: (domainModel) => {
      return domainModel ? DomainAndFormMappings.mapDomainToForm(domainModel) : defaultFormModel;
    },
  });

  // Schema applies all the required validation and hiding of non-relevant fields based on the selected payment method type.
  protected billForm = form(this.billModel, billPaySchema, {
    submission: {
      action: async (field) => {
        // Can alternatively be done with:
        // 1) Helper function for this
        // 2) HTML:<button (click)="onSave()"> with TS: `async onSave() { ... }`
        const result: TreeValidationResult<any> = await this.#billPayService.saveBillingInfo(
          DomainAndFormMappings.mapFormToDomain(field().value()),
          this.throwError(),
        );

        if (result?.ok) {
          return; // type ValidationSuccess = null | undefined | void;
        } else {
          return { kind: 'error', message: 'Form submission failed' };
        }
      },
    },
  });
}
