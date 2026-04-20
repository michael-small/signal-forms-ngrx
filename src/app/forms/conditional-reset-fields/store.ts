import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withFeature,
  withLinkedState,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { updateState, withDevtools, withResource } from '@angular-architects/ngrx-toolkit';
import { rxResource } from '@angular/core/rxjs-interop';
import { EntityDataService } from './entity.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  defaultFormModel,
  FormModelDomainModelService,
  numbersDefault,
  textDefault,
} from './form-model-domain-model.service';
import { withFormState, withFormStateImperativeHandlers } from '../withFormState.store.feature';

/**
 * @description Unlike reactive forms, there is no `patchValue`/`setValue` layer.
 * This store is just concerned with the form state and connecting the form layer and data layer
 * on init and save.
 *
 * In conjunction with the prototype of the `projectedSignal` (see form UI file),
 * the form state is projected for the form and updates the store on form change.
 */
export const Store = signalStore(
  { providedIn: 'root' },
  withProps(() => ({
    _dataService: inject(EntityDataService),
    _formModelDomainModelService: inject(FormModelDomainModelService),
  })),
  withDevtools('ConditionalResetFormStore'),
  withFeature((store) =>
    withFormState({
      formDataStream: store._dataService.getFormData(),
      defaultFormModel: defaultFormModel,
      mappingFn: (domain) => store._formModelDomainModelService.mapDomainToFormModel(domain),
    }),
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

    function save() {
      const formData = store.formValue();
      const domainModel = store._formModelDomainModelService.mapFormModelToDomain(formData);
      return firstValueFrom(store._dataService.save(domainModel));
    }

    return {
      setFieldType,
      save,
    };
  }),
  withFeature((store) =>
    withFormStateImperativeHandlers({
      setFieldType: signalMethod(() => {
        patchState(store, { formValue: { ...store.formValue(), fieldType: 'number' } });
        console.log('hit the fn');
      }),
    }),
  ),
);
