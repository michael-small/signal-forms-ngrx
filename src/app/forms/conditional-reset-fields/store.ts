import {
  getState,
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withFeature,
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
import { Observable } from 'rxjs';

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

function withFormState<T>(formCall: Observable<T>, defaultFormModel: T) {
  return signalStoreFeature(
    withResource(
      () => ({
        form: rxResource({
          stream: () => formCall,
          defaultValue: defaultFormModel,
        }),
      }),
      { errorHandling: 'previous value' },
    ),
    withMethods((store) => ({
      mapFormState: () => {
        return store.formValue();
      },
      setFormState: (val: T) => updateState(store, 'set Form State', { formValue: val }),
    })),
  );
}

export const Store = signalStore(
  { providedIn: 'root' },
  withProps(() => ({
    _dataService: inject(EntityDataService),
  })),
  withDevtools('ConditionalResetFormStore'),
  withFeature((store) => withFormState(store._dataService.getFormData(), defaultFormModel)),
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
