import { Component } from '@angular/core';
import { Links } from './links';
import { BillPay } from './forms/bill-pay';
import { ConditionalReset } from './forms/conditional-reset-fields/conditional-reset';

@Component({
  selector: 'app-root',
  imports: [Links, BillPay, ConditionalReset],
  template: `
    <h1>Signal Forms + NgRx + NgRx Toolkit</h1>

    <app-links />

    <p>
      This demo project will probably be a weird mix of signal stores and not signal stores for the
      moment because these are a bunch of prototypes slapped together and some speculation from me
      (Michael Small) who is NOT on the NgRx team. Though I am a member of the NgRx Toolkit.
    </p>
    <p>
      The Toolkit is currently working on extending withResource to support widening beyond taking a
      ResourceRef (exposes reload) to also take a regular Resource (subset of the ref, doesn't
      support reload). So currently, extendedResources cannot just be thrown into withResource from
      the Toolkit.
    </p>
    <p>
      Will extendedResource be supported by the Toolkit? By the eventual withResource official from
      NgRx itself? I (Michael Small) am not sure and cannot speak for the NgRx team. But I am
      experimenting.
    </p>

    <h2>Conditional Reset Fields Form</h2>

    <app-conditional-reset />

    <h2>Bill Pay Form</h2>

    <app-bill-pay />
  `,
})
export class App {}
