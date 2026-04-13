import { signalStore, withFeature, withMethods, withProps } from '@ngrx/signals';
import { updateState, withDevtools, withResource } from '@angular-architects/ngrx-toolkit';
import { rxResource } from '@angular/core/rxjs-interop';
import { EntityDataService } from './entity.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import {
  defaultFormModel,
  FormModelDomainModelService,
  numbersDefault,
  textDefault,
} from './form-model-domain-model.service';
import { withFormState } from '../withFormState.store.feature';

export const Store = signalStore(
  { providedIn: 'root' },
  withProps(() => ({
    _dataService: inject(EntityDataService),
    _formModelDomainModelService: inject(FormModelDomainModelService),
  })),
  withDevtools('ConditionalResetFormStore'),
  withFeature((store) =>
    withFormState(
      store._dataService
        .getFormData()
        .pipe(map((domain) => store._formModelDomainModelService.mapDomainToFormModel(domain))),
      defaultFormModel,
    ),
  ),
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
  withMethods((store) => {
    function setFieldType(): void {
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
    }

    return {
      setFieldType,
    };
  }),
);
