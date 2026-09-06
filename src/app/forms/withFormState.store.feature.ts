import { updateState, withResource } from '@ngrx-toolkit/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withComputed, withHooks, withMethods } from '@ngrx/signals';
import { map, Observable } from 'rxjs';

/**
 * @description RxJS first feature for:
 * - Syncing form data
 * - Handling default value
 * - Domain to form mapping
 *
 * Perhaps it could also prescribe form submission handling
 */
export function withFormState<DomainModel, FormModel>(args: {
  formDataStream: Observable<DomainModel>;
  defaultFormModel: FormModel;
  mapDomainToFormFn: (domain: DomainModel, extras?: unknown) => FormModel;
  mapFormToDomainFn: (form: FormModel, extras?: unknown) => DomainModel;
}) {
  return signalStoreFeature(
    withResource(
      () => ({
        form: rxResource({
          stream: () => args.formDataStream.pipe(map((domain) => args.mapDomainToFormFn(domain))),
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
    withComputed((store) => ({
      domainModel: () => args.mapFormToDomainFn(store.formValue()),
    })),
  );
}
