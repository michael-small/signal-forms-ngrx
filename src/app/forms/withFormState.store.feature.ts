import { updateState, withResource } from '@angular-architects/ngrx-toolkit';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withHooks, withMethods } from '@ngrx/signals';
import { map, Observable } from 'rxjs';

/**
 * @description RxJS first feature for:
 * - Syncing form data
 * - Handing default value
 * - Domain to form mapping
 *
 * Perhaps it could also prescribe form submission handling
 */
export function withFormState<DomainModel, FormModel>(args: {
  formDataStream: Observable<DomainModel>;
  defaultFormModel: FormModel;
  mappingFn: (domain: DomainModel) => FormModel;
}) {
  return signalStoreFeature(
    withResource(
      () => ({
        form: rxResource({
          stream: () => args.formDataStream.pipe(map(args.mappingFn)),
          defaultValue: args.defaultFormModel,
        }),
      }),
      { errorHandling: 'previous value' },
    ),
    withMethods((store) => ({
      mapFormState: () => store.formValue(),
      setFormState: (formValue: FormModel) =>
        updateState(store, 'set Form State', { formValue: formValue }),
    })),
  );
}

type MethodDictionary = Record<string, (...args: any[]) => void>;

export function withFormStateImperativeHandlers<DomainModel, FormModel>(methods: MethodDictionary) {
  return signalStoreFeature(
    withMethods((store) => ({
      ...methods,
    })),
    withHooks({
      onInit(store) {
        const mtds = Object.entries(methods);
        mtds.forEach(([name, fn]) => {
          fn();
        });
      },
    }),
  );
}
