import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';

@Component({
  selector: 'app-form-arrays',
  imports: [FormField],
  template: `
    <div id="form-arrays">
      <section>
        <h3>Basic Array & Array Tracking</h3>

        @for (item of basicArrayForm; track item) {
          <label>
            Basic Array Form ({{ $index }}):
            <input type="text" [formField]="item" />
          </label>
        }

        <blockquote
          cite="https://angular.dev/guide/forms/signals/field-state-management#tracking-values-for-array-fields"
        >
          <p>
            The forms system is already tracking the model values within the array and maintaining a
            stable identity of the fields it creates automatically. When an item changes, it may
            represent a new logical entity even if some of its properties look the same. Tracking by
            identity ensures the framework treats it as a distinct item rather than reusing existing
            UI elements. This prevents stateful elements, like form inputs, from being incorrectly
            shared and keeps bindings aligned with the correct part of the model.
          </p>
        </blockquote>
        <p>
          <a [href]="docLinks.trackingValuesForArrayFields" target="_blank"
            >-- Angular Docs: "Tracking values for array fields"</a
          >
        </p>
      </section>
    </div>
  `,
  styles: `
    #form-arrays {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `,
})
export class FormArrays {
  docLinks = {
    trackingValuesForArrayFields:
      'https://angular.dev/guide/forms/signals/field-state-management#tracking-values-for-array-fields',
  };

  basicArrayForm = form(signal(['a', 'b', 'c']));
}
