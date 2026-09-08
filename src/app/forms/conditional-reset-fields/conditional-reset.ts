import { JsonPipe } from '@angular/common';
import { Component, effect, inject, linkedSignal } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  hidden,
  min,
  readonly,
  required,
  SchemaPathTree,
} from '@angular/forms/signals';
import { numberComparators, textComparators } from './entity.model';
import { Store } from './store';
import { defaultConditionalFormModel, FormModel } from './form.model';
import { FormService } from './form.service';

@Component({
  selector: 'app-conditional-reset',
  imports: [FormRoot, FormField, JsonPipe],
  templateUrl: './conditional-reset.html',
})
export class ConditionalReset {
  protected readonly store = inject(Store);
  protected readonly formService = inject(FormService);

  protected readonly numberComparators = numberComparators;
  protected readonly textComparators = textComparators;

  protected readonly form = this.formService.form;
}
