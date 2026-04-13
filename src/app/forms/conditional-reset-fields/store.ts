import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { NumberComparator, QueryArguments, TextComparator } from './entity.model';
import { updateState, withDevtools, withResource } from '@angular-architects/ngrx-toolkit';
import { FormModel } from './conditional-reset';
import { rxResource } from '@angular/core/rxjs-interop';
import { EntityDataService } from './entity.service';
import { inject } from '@angular/core';

export const numbersDefault: QueryArguments<NumberComparator | '', number> = {
  comparator: '',
  value: 0,
};
export const textDefault: QueryArguments<TextComparator | '', string> = {
  comparator: '',
  value: '',
};

const defaultFormModel: FormModel = {
  dbTable: '',
  dbField: '',
  fieldType: '',
  numbers: numbersDefault,
  text: textDefault,
};

export const Store = signalStore(
  { providedIn: 'root' },
  withState<{ form: FormModel }>(() => {
    return {
      form: defaultFormModel,
    };
  }),
  withProps(() => ({
    _dataService: inject(EntityDataService),
  })),
  withDevtools('ConditionalResetFormStore'),
  withResource(
    (store) => ({
      dbTables: rxResource({
        stream: () => store._dataService.getDbTables(),
        defaultValue: [],
      }),
      dbFields: rxResource({
        params: () => store.form().dbTable,
        stream: (source) => store._dataService.getTableFields(source.params),
        defaultValue: [],
      }),
    }),
    { errorHandling: 'previous value' },
  ),
  withMethods((store) => ({
    mapFormState(): FormModel {
      return {
        ...store.form(),
      };
    },
    setFormState(val: FormModel): void {
      updateState(store, 'set Form State', { form: val });
    },
    setFieldType(): void {
      const selectedDbField = store
        .dbFieldsValue()
        ?.find((field) => field.id === store.form().dbField);

      if (selectedDbField) {
        updateState(store, 'set Field Type', {
          form: {
            ...store.form(),
            fieldType: selectedDbField.type,
            numbers: selectedDbField.type === 'number' ? store.form.numbers() : numbersDefault,
            text: selectedDbField.type === 'text' ? store.form.text() : textDefault,
          },
        });
      }
    },
  })),
);
