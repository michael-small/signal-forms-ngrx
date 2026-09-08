import { inject, linkedSignal, Service } from '@angular/core';
import { form, hidden, min, readonly, required, type SchemaPathTree } from '@angular/forms/signals';
import { defaultConditionalFormModel, type FormModel } from './form.model';
import { Store } from './store';

@Service()
export class FormService {
  protected readonly store = inject(Store);

  /**
   * @description Connects the form state to the store.
   * It takes care of
   * - Projecting the store state to the form (the computation)
   * - Updating the store on form changes (set)
   */
  protected formModel = linkedSignal<FormModel>(() => this.store.mapFormState(), {
    set: (value) => {
      const { newFormValue, fieldToReset } = this.store.setFieldType(value);

      this.store.setFormState(newFormValue);

      this.resetFormFields(fieldToReset);
    },
  });

  public form = form<FormModel>(
    this.formModel,
    (schema) => {
      // The schema could all be done inline,
      // but this function allows cleaner declaration and possible re-use
      return this.querySchema(schema);
    },
    {
      submission: {
        action: async () => {
          // Error handling on save can differ a lot from app to app.
          // In my everyday use, we tend to handle errors as side effects directly in the call
          // to have clear spinner blocker and feedback via a snackbar.
          // For other workflows, consider handling errors by this submit,
          // returning a form submission error which can be shown in the UI.
          await this.store.save();
        },
      },
    },
  );

  private resetFormFields(fieldsToReset: 'numbers' | 'text' | null) {
    if (fieldsToReset === 'numbers') {
      this.form.numbers().reset(defaultConditionalFormModel.numbers);
    } else if (fieldsToReset === 'text') {
      this.form.text().reset(defaultConditionalFormModel.text);
    }
  }

  /**
   * @description The `fieldType` is what determins the relevant fields to require
   * Note: in signal forms, `hidden` is for fields not shown in the form, and for saying that
   * a field is not relevant for validation. `hidden` is NOT neccisarily meaning not shown in the UI,
   * but in practice with this example, it could be used like that.
   *
   * Rather than overloading `comparator` and `value` with union of all possible types,
   * each `fieldType` has its own specific comparator + value fields.
   *
   * @see {@link} https://angular.dev/guide/forms/signals/form-logic#choose-between-hidden-disabled-and-readonly
   */
  private querySchema(schema: SchemaPathTree<FormModel>) {
    readonly(schema.fieldType);

    required(schema.dbTable, { message: 'DB Table is required' });
    required(schema.dbField, { message: 'DB Field is required' });

    hidden(schema.numbers, {
      when: ({ valueOf }) => valueOf(schema.fieldType) !== 'number',
    });
    required(schema.numbers.comparator, { message: 'Number Comparator is required' });
    min(schema.numbers.value, 0);

    hidden(schema.text, {
      when: ({ valueOf }) => valueOf(schema.fieldType) !== 'text',
    });
    required(schema.text.comparator, { message: 'Text Comparator is required' });
    required(schema.text.value, { message: 'Text Value is required' });
  }
}
