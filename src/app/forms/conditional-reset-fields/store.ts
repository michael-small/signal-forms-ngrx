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
  withState<FormModel>(() => {
    return defaultFormModel;
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
        params: () => store.dbTable(),
        stream: (source) => store._dataService.getTableFields(source.params),
        defaultValue: [],
      }),
    }),
    { errorHandling: 'previous value' },
  ),
  withMethods((store) => ({
    mapFormState(): FormModel {
      const state = getState(store);
      return {
        dbTable: state.dbTable,
        dbField: state.dbField,
        fieldType: state.fieldType,
        numbers: state.numbers,
        text: state.text,
      };
    },
    setFormState(val: FormModel): void {
      updateState(store, 'set Form State', val);
    },
    setFieldType(): void {
      const selectedDbField = store.dbFieldsValue()?.find((field) => field.id === store.dbField());

      if (selectedDbField) {
        updateState(store, 'set Field Type', {
          fieldType: selectedDbField.type,
          numbers: selectedDbField.type === 'number' ? store.numbers() : numbersDefault,
          text: selectedDbField.type === 'text' ? store.text() : textDefault,
        });
      }
    },
  })),
);
