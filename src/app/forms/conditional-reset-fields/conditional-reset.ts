import { JsonPipe } from '@angular/common';
import { Component, effect, Injectable, linkedSignal, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form, FormField, FormRoot } from '@angular/forms/signals';
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
  //   comparator: string;
  //   value: string;
};

@Injectable({
  providedIn: 'root',
})
export class ConditionalResetDataService {
  getTableFields(tableId: string) {
    console.log('tableId:', tableId);
    if (tableId === 'users') {
      return of([
        { id: 'id', name: 'User ID' },
        { id: 'name', name: 'User Name' },
      ]);
    } else if (tableId === 'orders') {
      return of([
        { id: 'id', name: 'Order ID' },
        { id: 'name', name: 'Order Name' },
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
        <select [formField]="form.dbField">
          @for (field of dbFields.value(); track $index) {
            <option [value]="field.id">{{ field.name }}</option>
          }
        </select>
      </label>
    </form>

    <pre>{{ dbFields.value() | json }}</pre>

    <pre>{{ form().value() | json }}</pre>
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
    }[]
  > = rxResource({
    params: () => this.form().value().dbTable,
    stream: (source) => this.#dataService.getTableFields(source.params),
    defaultValue: [],
  });

  model = signal<FormModel>({
    dbTable: '',
    dbField: '',
  });

  form = form<FormModel>(this.model);

  constructor() {
    effect(() => {
      console.log(this.form().value());
    });
  }
}
