import { signalStore, withMethods, withState } from '@ngrx/signals';
import { NumberComparator, QueryArguments, TextComparator } from './entity.model';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { FormModel } from './conditional-reset';

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
    return {
      dbTable: '',
      dbField: '',
      fieldType: '',
      numbers: numbersDefault,
      text: textDefault,
    };
  }),
  withDevtools('ConditionalResetFormStore'),
  withMethods((store) => ({
    setFormState(val: FormModel) {
      updateState(store, 'set Form State', val);
    },
  })),
);
