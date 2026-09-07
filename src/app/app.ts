import { Component } from '@angular/core';
import { FormArrays } from './forms/form-arrays/form-arrays';
import { FormPrimitiveExamples } from './forms/form-primitive-examples/form-primitive-examples';
import { ComplexTopics } from './forms/complex-topics';
import { LargeFormSplittingStrategies } from './large-form/large-form-splitting-strategies';
import { ShowingErrorsConditions } from './forms/showing-errors-conditions/showing-errors-conditions';
import { MaterialModernize } from './forms/material-modernize/material-modernize';

@Component({
  selector: 'app-root',
  imports: [
    FormArrays,
    FormPrimitiveExamples,
    ComplexTopics,
    LargeFormSplittingStrategies,
    ShowingErrorsConditions,
    MaterialModernize,
  ],
  template: `
    <h1>Signal Forms Playground</h1>

    <p>
      <a href="https://angular.dev/guide/forms/signals/overview" target="_blank">Signal Forms</a>
      documentation
    </p>
    <p>
      This project is where I messed around with various signal forms concepts for the last few
      months. Though some of this includes some exploration with third party libraries that I use,
      most examples are vanilla Angular code.
    </p>

    <h2>Form Primitive Examples</h2>
    <app-form-primitive-examples />

    <h2>Form Arrays</h2>
    <app-form-arrays />

    <h2>Showing Errors Conditions</h2>
    <app-showing-errors-conditions />

    <h2>Complex Topics</h2>
    <app-complex-topics />

    <app-large-form-splitting-strategies />

    <h2>Material Modernize examples</h2>
    <app-material-modernize />
  `,
  styles: `
    #info {
      display: flex;
      gap: 2rem;
    }
  `,
})
export class App {}
