import { Resource, untracked } from '@angular/core';
import { ResourceExtension } from '../resource-extensions';
import { overrideHasValueOnError } from './utils';

export function withPreviousValueOnError<R extends Resource<unknown>>(): ResourceExtension<R> {
  return {
    type: 'error',
    apply: (resource) => {
      let value = resource.hasValue() ? resource.value() : undefined;

      Object.defineProperty(resource, 'value', {
        value: new Proxy(resource.value, {
          apply(target, thisArg, args) {
            try {
              const result = Reflect.apply(target, thisArg, args);
              if (!untracked(resource.isLoading)) {
                value = result;
              }
              return result;
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
