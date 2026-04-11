import { JsonPipe } from '@angular/common';
import { Component, effect, inject, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form, FormField, FormRoot, hidden, min, readonly, required } from '@angular/forms/signals';
import {
  NumberComparator,
  numberComparators,
  QueryArguments,
  TableField,
  TextComparator,
  textComparators,
} from './entity.model';
import { EntityDataService } from './entity.service';
import { Observable } from 'rxjs';

export type FormModel = {
  dbTable: string;
  dbField: TableField['id'];
  fieldType: TableField['type'] | '';
  numbers: QueryArguments<NumberComparator | '', number>;
  text: QueryArguments<TextComparator | '', string>;
};

const numbersDefault: QueryArguments<NumberComparator | '', number> = {
  comparator: '',
  value: 0,
};
const textDefault: QueryArguments<TextComparator | '', string> = {
  comparator: '',
  value: '',
};

@Component({
  selector: 'app-conditional-reset',
  imports: [FormRoot, FormField, JsonPipe],
  template: `
    <form [formRoot]="form">
      <label>
        DB Table
        <select [formField]="form.dbTable">
          @for (table of dbTables.value(); track table.id) {
            <option [value]="table.id">{{ table.name }}</option>
          }
        </select>
      </label>

      <label>
        DB Field
        <select [formField]="form.dbField" (change)="setFieldType()">
          @for (field of dbFields.value(); track $index) {
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
  readonly #dataService = inject(EntityDataService);

  protected numberComparators = numberComparators;
  protected textComparators = textComparators;

  protected dbTables: ResourceRef<{ id: string; name: string }[]> = rxResource({
    stream: () => this.#dataService.getDbTables(),
    defaultValue: [],
  });

  protected dbFields: ResourceRef<TableField[]> = rxResource({
    params: () => this.model().dbTable,
    stream: (source) => this.#dataService.getTableFields(source.params),
    defaultValue: [],
  });

  private model = signal<FormModel>({
    dbTable: '',
    dbField: '',
    fieldType: '',
    numbers: numbersDefault,
    text: textDefault,
  });

  form = form<FormModel>(this.model, (schema) => {
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

  protected setFieldType() {
    const selectedDbField = this.dbFields
      .value()
      .find((field) => field.id === this.model().dbField);

    if (selectedDbField) {
      this.model.update((model) => ({
        ...model,
        fieldType: selectedDbField.type,
        numbers: selectedDbField.type === 'number' ? model.numbers : numbersDefault,
        text: selectedDbField.type === 'text' ? model.text : textDefault,
      }));
    }
  }

  constructor() {
    effect(() => {
      console.log(this.form().value());
    });
  }
}
