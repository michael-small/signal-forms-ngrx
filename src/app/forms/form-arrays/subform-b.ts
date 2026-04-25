import { Component, computed, inject, input } from '@angular/core';
import { FormService } from './form.service';
import { FormField } from '@angular/forms/signals';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-subform-b',
  imports: [FormField, MatRadioModule],
  template: `
    @let form = this.form();

    <mat-radio-group aria-label="Select an option" [formField]="form.type">
      <mat-radio-button value="A">A</mat-radio-button>
      <mat-radio-button value="B">B</mat-radio-button>
    </mat-radio-group>

    <label>
      Subform B:
      <input type="number" [formField]="form.b.value" />
    </label>
  `,
})
export class SubformB {
  readonly formService = inject(FormService);

  public readonly index = input.required<number>();

  protected form = computed(() => this.formService.differingObjectsArrayForm.items[this.index()]);
}
