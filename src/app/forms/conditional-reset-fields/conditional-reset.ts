import { JsonPipe } from '@angular/common';
import { Component, effect, Injectable, linkedSignal, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  form,
  FormField,
  FormRoot,
  hidden,
  min,
  readonly,
  required,
  validate,
} from '@angular/forms/signals';
import { of } from 'rxjs';

type DomainModel = {
  dbTable: string;
  dbField: string;
  comparator: string;
  value: string;
};

type FormModel = {
  dbTable: string;
  dbField: string;
  fieldType: string;
  numbers: {
    comparator: string;
    value: number;
  };
  text: {
    comparator: string;
    value: string;
  };
};

@Injectable({
  providedIn: 'root',
})
export class ConditionalResetDataService {
  getTableFields(tableId: string) {
    if (tableId === 'users') {
      return of([
        { id: 'id', name: 'User ID', type: 'number' },
        { id: 'name', name: 'User Name', type: 'text' },
      ]);
    } else if (tableId === 'orders') {
      return of([
        { id: 'id', name: 'Order ID', type: 'number' },
        { id: 'name', name: 'Order Name', type: 'text' },
      ]);
    } else {
      return of([]);
    }
  }
}

@Component({
  selector: 'app-conditional-reset',
  imports: [FormRoot, FormField, JsonPipe],
  template: `
    <form [formRoot]="form">
      <label>
        DB Table
        <select [formField]="form.dbTable">
          <option value="users">Users</option>
          <option value="orders">Orders</option>
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
            <option value="equals">Equals</option>
            <option value="greater">Greater Than</option>
            <option value="less">Less Than</option>
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
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
          </select>
        </label>

        <label>
          Value
          <input type="text" [formField]="form.text.value" />
        </label>
      }
    </form>

    <pre>{{ dbFields.value() | json }}</pre>

    <pre>{{ form().value() | json }}</pre>

    <pre>Errors: {{ form().errorSummary() | json }}</pre>
  `,
})
export class ConditionalReset {
  readonly #dataService = new ConditionalResetDataService();

  dbTables = signal<{ id: string; name: string }[]>([
    { id: 'users', name: 'Users' },
    { id: 'orders', name: 'Orders' },
  ]);

  dbFields: ResourceRef<
    {
      id: string;
      name: string;
      type: string;
    }[]
  > = rxResource({
    params: () => this.model().dbTable,
    stream: (source) => this.#dataService.getTableFields(source.params),
    defaultValue: [],
  });

  model = signal<FormModel>({
    dbTable: '',
    dbField: '',
    fieldType: '',
    numbers: {
      comparator: '',
      value: 0,
    },
    text: {
      comparator: '',
      value: '',
    },
  });

  form = form<FormModel>(this.model, (schema) => {
    readonly(schema.fieldType); // TODO - make sense that it is readonly?

    hidden(schema.numbers, () => this.model().fieldType !== 'number');
    hidden(schema.text, () => this.model().fieldType !== 'text');

    required(schema.dbTable);
    required(schema.dbField);

    required(schema.text.comparator);
    required(schema.text.value);

    required(schema.numbers.comparator);
    required(schema.numbers.value);
    min(schema.numbers.value, 1);
  });

  constructor() {
    effect(() => {
      console.log(this.form().value());
    });
  }

  protected setFieldType() {
    const selectedDbField = this.dbFields
      .value()
      .find((field) => field.id === this.model().dbField);

    if (selectedDbField) {
      this.model.update((model) => ({ ...model, fieldType: selectedDbField.type }));
    }
  }
}
