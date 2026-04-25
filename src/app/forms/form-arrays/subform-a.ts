import { Component, computed, inject, input } from '@angular/core';
import { FormService } from './form.service';
import { FormField } from '@angular/forms/signals';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-subform-a',
  imports: [FormField, MatRadioModule],
  template: `
    @let form = this.form();

    <mat-radio-group aria-label="Select an option" [formField]="form.type">
      <mat-radio-button value="A">A</mat-radio-button>
      <mat-radio-button value="B">B</mat-radio-button>
    </mat-radio-group>

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
