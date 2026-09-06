import { signalStore, withFeature, withMethods, withProps } from '@ngrx/signals';
import { updateState, withDevtools, withResource } from '@ngrx-toolkit/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EntityDataService } from './entity.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  defaultFormModel,
  FormModel,
  FormModelDomainModelService,
  numbersDefault,
  textDefault,
} from './form-model-domain-model.service';
import { withFormState } from '../withFormState.store.feature';

/**
 * @description Unlike reactive forms, there is no `patchValue`/`setValue` layer.
 * This store is just concerned with the form state and connecting the form layer and data layer
 * on init and save.
 *
 * In conjunction with 22.1's `linkedSignal` + `set` arg,
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
      mapDomainToFormFn: (domain) =>
        store._formModelDomainModelService.mapDomainToFormModel(domain),
      mapFormToDomainFn: (form) => store._formModelDomainModelService.mapFormModelToDomain(form),
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
    function setFieldType(value: FormModel): {
      newFormValue: FormModel;
      fieldToReset: 'numbers' | 'text' | null;
    } {
      const oldDbField = store.formValue().dbField;
      const newDbField = value.dbField;

      const prevDBField = store.dbFieldsValue()?.find((field) => field.id === oldDbField);
      const newDBField = store.dbFieldsValue()?.find((field) => field.id === newDbField);

      const newFormValueWithResets =
        newDBField && newDBField !== prevDBField
          ? {
              ...value,
              fieldType: newDBField?.type,
              numbers: newDBField?.type === 'number' ? value.numbers : numbersDefault,
              text: newDBField?.type === 'text' ? value.text : textDefault,
            }
          : value;

      let fieldToReset: 'numbers' | 'text' | null = null;
      if (prevDBField?.type !== newDBField?.type) {
        fieldToReset = newDBField?.type === 'number' ? 'text' : 'numbers';
      } else if (prevDBField?.type === newDBField?.type) {
        fieldToReset = null;
      }

      return {
        newFormValue: newFormValueWithResets,
        fieldToReset: fieldToReset,
      };
    }

    function save() {
      return firstValueFrom(store._dataService.save(store.domainModel()));
    }

    return {
      setFieldType,
      save,
    };
  }),
);
