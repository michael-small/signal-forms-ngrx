import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, hidden, required, schema } from '@angular/forms/signals';

interface BillPayFormModel {
  name: string;
  method: {
    type: string;
    card: {
      cardNumber: string;
      securityCode: string;
      expiration: string;
    };
    bank: {
      accountNumber: string;
      routingNumber: string;
    };
  };
}

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
    </form>

    <pre>Value: {{ billForm().value() | json }}</pre>
    <pre>Valid: {{ billForm().valid() | json }}</pre>
  `,
  styles: `
    .flex {
      display: flex;
      gap: 1rem;
    }
  `,
})
export class BillPay {
  billModel = signal<BillPayFormModel>({
    name: '',
    method: {
      type: '',
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
  });

  billForm = form(this.billModel, billPaySchema);
}
