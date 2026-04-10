import { Component } from '@angular/core';

@Component({
  selector: 'app-links',
  template: `
    <h2>Links</h2>
    <ul>
      <li>
        Core technologies
        <ul>
          <li>
            <a href="https://angular.dev/guide/forms/signals/overview" target="_blank"
              >Signal Forms</a
            >
          </li>
          <li>
            <a href="https://ngrx.io/guide/signals/signal-store" target="_blank">NgRx Signals</a>
          </li>
          <li>
            <a href="https://ngrx-toolkit.angulararchitects.io/docs/extensions" target="_blank"
              >NgRx Toolkit</a
            >
          </li>
        </ul>
      </li>

      <li>
        Proposed APIs from NgRx
        <ul>
          <li>
            delegatedSignal (projectedSignal prototype used at the moment)
            <ul>
              <li>
                <a href="https://github.com/ngrx/platform/issues/5121" target="_blank"
                  >RFC(@ngrx/signals): Add delegatedSignal API</a
                >
              </li>
              <li>
                <a href="https://github.com/kobi2294/fun-with-projected-signals" target="_blank"
                  >Kobi Hari's projected signal prototype</a
                >
              </li>
            </ul>
          </li>

          <li>
            extendResource
            <ul>
              <li>
                <a href="https://github.com/ngrx/platform/issues/5126" target="_blank"
                  >RFC(@ngrx/signals): Resource Integration Part 1 - Introduce Extend Resource
                  APIs</a
                >
              </li>
              <li>
                <a
                  href="https://github.com/markostanimirovic/extend-resource-prototype"
                  target="_blank"
                  >Marko Stanimirovic's extend resource prototype</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  `,
})
export class Links {}
