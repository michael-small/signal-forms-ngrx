import { Component, computed, inject, input } from '@angular/core';
import { FormService } from './form.service';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-subform-b',
  imports: [FormField],
  template: `
    @let form = this.form();

    <div>
      <input type="radio" id="A" value="A" [formField]="form.type" />
      <label for="A">A</label>

      <input type="radio" id="B" value="B" [formField]="form.type" />
      <label for="B">B</label>
    </div>

    <label>
      Subform B:
      <input type="number" [formField]="form.b.value" />
    </label>
  `,
  styles: `
    input[type='radio'] {
      border: 0;
    }
  `,
})
export class SubformB {
  readonly formService = inject(FormService);

  public readonly index = input.required<number>();

  protected form = computed(() => this.formService.differingObjectsArrayForm.items[this.index()]);
}
