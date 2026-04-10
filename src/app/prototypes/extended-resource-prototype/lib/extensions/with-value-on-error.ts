import { Resource, untracked } from '@angular/core';
import { ResourceExtension } from '../resource-extensions';
import { overrideHasValueOnError } from './utils';

export function withValueOnError<R extends Resource<unknown>>(
  value: R extends Resource<infer V> ? V : never,
): ResourceExtension<R> {
  return {
    type: 'error',
    apply: (resource) => {
      Object.defineProperty(resource, 'value', {
        value: new Proxy(resource.value, {
          apply(target, thisArg, args) {
            try {
              return Reflect.apply(target, thisArg, args);
            } catch (error) {
              if (untracked(resource.status) === 'error') {
                return value;
              }
              throw error;
            }
          },
        }),
        configurable: true,
        enumerable: true,
        writable: true,
      });

      overrideHasValueOnError(resource);
    },
  };
}
