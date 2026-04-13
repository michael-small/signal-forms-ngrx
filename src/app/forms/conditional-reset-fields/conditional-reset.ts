import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { form, FormField, FormRoot, hidden, min, readonly, required } from '@angular/forms/signals';
import { numberComparators, textComparators } from './entity.model';
import { Store } from './store';
import { projectedSignal } from '../../prototypes/delegatedSignal-Kobi-Hari-prototype/lib/projected-signal';
import { FormModel } from './form-model-domain-model.service';

@Component({
  selector: 'app-conditional-reset',
  imports: [FormRoot, FormField, JsonPipe],
  template: `
    <form [formRoot]="form">
      <label>
        DB Table
        <select [formField]="form.dbTable">
          @for (table of store.dbTablesValue(); track table.id) {
            <option [value]="table.id">{{ table.name }}</option>
          }
        </select>
      </label>

      <label>
        DB Field
        <select [formField]="form.dbField" (change)="store.setFieldType()">
          @for (field of store.dbFieldsValue(); track $index) {
            <option [value]="field.id">{{ field.name }}</option>
          }
        </select>
      </label>

      @if (form().value().fieldType === 'number') {
        <label>
          Comparator
          <select [formField]="form.numbers.comparator">
            @for (comparator of numberComparators; track comparator) {
              <option [value]="comparator.value">{{ comparator.label }}</option>
            }
          </select>
        </label>

        <label>
          Value
          <input type="number" [formField]="form.numbers.value" />
        </label>
      } @else if (form().value().fieldType === 'text') {
        <label>
          Comparator
          <select [formField]="form.text.comparator">
            @for (comparator of textComparators; track comparator) {
              <option [value]="comparator.value">{{ comparator.label }}</option>
            }
          </select>
        </label>

        <label>
          Value
          <input type="text" [formField]="form.text.value" />
        </label>
      }
    </form>

    <pre>Form Value: {{ form().value() | json }}</pre>

    <pre>Form Errors: {{ form().errorSummary() | json }}</pre>
  `,
})
export class ConditionalReset {
  protected readonly store = inject(Store);

  protected readonly numberComparators = numberComparators;
  protected readonly textComparators = textComparators;

  protected projected = projectedSignal({
    computation: () => this.store.mapFormState(),
    update: (value) => this.store.setFormState(value),
  });

  protected form = form<FormModel>(this.projected, (schema) => {
    readonly(schema.fieldType);

    required(schema.dbTable, { message: 'DB Table is required' });
    required(schema.dbField, { message: 'DB Field is required' });

    hidden(schema.numbers, ({ valueOf }) => valueOf(schema.fieldType) !== 'number');
    required(schema.numbers.comparator, { message: 'Number Comparator is required' });
    min(schema.numbers.value, 0);

    hidden(schema.text, ({ valueOf }) => valueOf(schema.fieldType) !== 'text');
    required(schema.text.comparator, { message: 'Text Comparator is required' });
    required(schema.text.value, { message: 'Text Value is required' });
  });
}
