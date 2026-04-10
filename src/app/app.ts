import { Component } from '@angular/core';
import { Links } from './links';

@Component({
  selector: 'app-root',
  imports: [Links],
  template: `
    <h1>Signal Forms + NgRx + NgRx Toolkit</h1>
    <app-links />
  `,
})
export class App {}
