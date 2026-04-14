import { updateState, withResource } from '@angular-architects/ngrx-toolkit';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withMethods } from '@ngrx/signals';
import { map, Observable } from 'rxjs';

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
