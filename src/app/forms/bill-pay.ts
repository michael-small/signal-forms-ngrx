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
import {
  BillPayDomainModel,
  BillPayFormModel,
  DomainAndFormMappings,
} from './bill-pay-dynamic-validation-modeling/bill-pay.model';
import {
  BillPayService,
  defaultBillPayData,
} from './bill-pay-dynamic-validation-modeling/bill-pay.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

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
  hidden(billPay.method.card, ({ valueOf }) => valueOf(billPay.method.type) !== 'card');
  // Hide bank account details when user has selected a method other than bank account.
  hidden(billPay.method.bank, ({ valueOf }) => valueOf(billPay.method.type) !== 'bank');

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
  selector: 'app-bill-pay',
  imports: [FormField, FormRoot, JsonPipe],
  template: `
    <a
      href="https://angular.dev/guide/forms/signals/model-design#avoid-models-with-dynamic-structure"
      target="_blank"
    >
      <h2>Docs example: Avoid models with dynamic structure</h2>
    </a>
    <p>
      Using <code>hidden</code> for the irrelevant part is good. A discriminated union is bad. While
      all fields are marked as required, only the non-hidden fields are validated against.
    </p>
    <form [formRoot]="billForm">
      <fieldset>
        <legend>Type</legend>

        <div>
          <input type="radio" id="card" value="card" [formField]="billForm.method.type" />
          <label for="card">Credit Card</label>
        </div>

        <div>
          <input type="radio" id="bank" value="bank" [formField]="billForm.method.type" />
          <label for="bank">Bank Account</label>
        </div>
      </fieldset>

      <label style="display: block; margin: 1rem 0">
        Name
        <input type="text" [formField]="billForm.name" />
      </label>

      @if (billForm().value().method.type === 'card') {
        <div class="flex">
          <label>
            Card Number
            <input type="text" [formField]="billForm.method.card.cardNumber" />
          </label>
          <label>
            Security Code
            <input type="text" [formField]="billForm.method.card.securityCode" />
          </label>
          <label>
            Expiration
            <input type="text" [formField]="billForm.method.card.expiration" />
          </label>
        </div>
      } @else if (billForm().value().method.type === 'bank') {
        <div class="flex">
          <label>
            Account Number
            <input type="text" [formField]="billForm.method.bank.accountNumber" />
          </label>
          <label>
            Routing Number
            <input type="text" [formField]="billForm.method.bank.routingNumber" />
          </label>
        </div>
      }
      <button type="submit" [disabled]="!billForm().valid()">Submit</button>
    </form>

    <pre>Value: {{ billForm().value() | json }}</pre>
    <pre>Valid: {{ billForm().valid() | json }}</pre>
    <pre>Submit errors: {{ billForm().errors() | json }}</pre>

    <pre>Forced submit error: {{ throwError() }}</pre>
    <button (click)="throwError.update(err => !err)">Toggle error on save</button>
  `,
  styles: `
    .flex {
      display: flex;
      gap: 1rem;
    }
  `,
})
export class BillPay {
  readonly #billPayService = inject(BillPayService);
  readonly #domainToFormMappings = inject(DomainAndFormMappings);
  readonly router = inject(Router);

  protected throwError = signal(false);

  // Faked HTTP data w/delay
  private billResource = rxResource({
    stream: () => this.#billPayService.getCurrentBillingInfo(),
  });

  // Forms require writable signal data as an input
  // We can use `linkedSignal` to transform the resource data (domain model) into the form model.
  private billModel = linkedSignal({
    source: this.billResource.value,
    computation: (domainModel) => {
      return domainModel ? this.mapDomainToForm(domainModel) : defaultFormModel;
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
          this.mapFormToDomain(field().value()),
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

  private mapDomainToForm: (domainModel: BillPayDomainModel) => BillPayFormModel =
    this.#domainToFormMappings.mapDomainToForm;

  private mapFormToDomain: (formModel: BillPayFormModel) => BillPayDomainModel =
    this.#domainToFormMappings.mapFormToDomain;
}
