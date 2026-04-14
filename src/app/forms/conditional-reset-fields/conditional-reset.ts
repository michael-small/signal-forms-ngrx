import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  hidden,
  min,
  readonly,
  required,
  SchemaPathTree,
} from '@angular/forms/signals';
import { numberComparators, textComparators } from './entity.model';
import { Store } from './store';
import { projectedSignal } from '../../prototypes/delegatedSignal-Kobi-Hari-prototype/lib/projected-signal';
import { FormModel } from './form-model-domain-model.service';

/**
 * @description The `fieldType` is what determins the relevant fields to require
 * Note: in signal forms, `hidden` is for fields not shown in the form, and for saying that
 * a field is not relevant for validation. `hidden` is NOT neccisarily meaning not shown in the UI,
 * but in practice with this example, it could be used like that.
 *
 * Rather than overloading `comparator` and `value` with union of all possible types,
 * each `fieldType` has its own specific comparator + value fields.
 *
 * @see {@link} https://angular.dev/guide/forms/signals/form-logic#choose-between-hidden-disabled-and-readonly
 */
function querySchema(schema: SchemaPathTree<FormModel>) {
  readonly(schema.fieldType);

  required(schema.dbTable, { message: 'DB Table is required' });
  required(schema.dbField, { message: 'DB Field is required' });

  hidden(schema.numbers, ({ valueOf }) => valueOf(schema.fieldType) !== 'number');
  required(schema.numbers.comparator, { message: 'Number Comparator is required' });
  min(schema.numbers.value, 0);

  hidden(schema.text, ({ valueOf }) => valueOf(schema.fieldType) !== 'text');
  required(schema.text.comparator, { message: 'Text Comparator is required' });
  required(schema.text.value, { message: 'Text Value is required' });
}

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

  /**
   * @description The projected signal is what connects the form state to the store.
   * It takes care of
   * - Projecting the store state to the form (computation)
   * - Updating the store on form changes (update)
   */
  protected projected = projectedSignal({
    computation: () => this.store.mapFormState(),
    update: (value) => this.store.setFormState(value),
  });

  protected form = form<FormModel>(
    this.projected,
    (schema) => {
      // The schema could all be done inline,
      // but this function allows cleaner declaration and possible re-use
      return querySchema(schema);
    },
    {
      submission: {
        action: async () => {
          // Error handling on save can differ a lot from app to app.
          // In my everyday use, we tend to handle errors as side effects directly in the call
          // to have clear spinner blocker and feedback via a snackbar.
          // For other workflows, consider handling errors by this submit,
          // returning a form submission error which can be shown in the UI.
          //
          // Docs on form submission currently being reviewed:
          // https://github.com/angular/angular/pull/67862
          await this.store.save();
        },
      },
    },
  );
}
