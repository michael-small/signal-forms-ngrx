import { Resource, untracked } from '@angular/core';
import { ResourceExtension } from '../resource-extensions';

export function withPreviousValueOnLoading<R extends Resource<unknown>>(): ResourceExtension<R> {
  return {
    type: 'loading',
    apply: (resource) => {
      let value = resource.hasValue() ? resource.value() : undefined;

      Object.defineProperty(resource, 'value', {
        value: new Proxy(resource.value, {
          apply(target, thisArg, args) {
            if (!untracked(resource.isLoading)) {
              value = Reflect.apply(target, thisArg, args);
            }
            return value;
          },
        }),
        configurable: true,
        enumerable: true,
        writable: true,
      });
    },
  };
}
