import { updateState, withResource } from '@angular-architects/ngrx-toolkit';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withMethods } from '@ngrx/signals';
import { Observable } from 'rxjs';

export function withFormState<T>(formCall: Observable<T>, defaultFormModel: T) {
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
      mapFormState: () => store.formValue(),
      setFormState: (formValue: T) =>
        updateState(store, 'set Form State', { formValue: formValue }),
    })),
  );
}
