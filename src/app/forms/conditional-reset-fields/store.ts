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
  withProps(() => ({
    _dataService: inject(EntityDataService),
  })),
  withDevtools('ConditionalResetFormStore'),
  // TODO - make into feature
  withResource(
    (store) => ({
      form: rxResource({
        stream: () => store._dataService.getFormData(),
        defaultValue: defaultFormModel,
      }),
    }),
    { errorHandling: 'previous value' },
  ),
  withMethods((store) => ({
    mapFormState: () => ({ ...store.formValue() }),
    setFormState: (val: FormModel) => updateState(store, 'set Form State', { formValue: val }),
  })),
  withResource(
    (store) => ({
      dbTables: rxResource({
        stream: () => store._dataService.getDbTables(),
        defaultValue: [],
      }),
      dbFields: rxResource({
        params: () => store.formValue().dbTable,
        stream: (source) => store._dataService.getTableFields(source.params),
        defaultValue: [],
      }),
    }),
    { errorHandling: 'previous value' },
  ),
  withMethods((store) => ({
    setFieldType(): void {
      const selectedDbField = store
        .dbFieldsValue()
        ?.find((field) => field.id === store.formValue().dbField);

      if (selectedDbField) {
        updateState(store, 'set Field Type', {
          formValue: {
            ...store.formValue(),
            fieldType: selectedDbField.type,
            numbers: selectedDbField.type === 'number' ? store.formValue().numbers : numbersDefault,
            text: selectedDbField.type === 'text' ? store.formValue().text : textDefault,
          },
        });
      }
    },
  })),
);
