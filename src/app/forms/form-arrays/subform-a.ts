import { Component, computed, inject, input } from '@angular/core';
import { FormService } from './form.service';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-subform-a',
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
      Subform A:
      <input type="text" [formField]="form.a.value" />
    </label>
  `,
})
export class SubformA {
  readonly formService = inject(FormService);

  public readonly index = input.required<number>();

  protected form = computed(() => this.formService.differingObjectsArrayForm.items[this.index()]);
}
