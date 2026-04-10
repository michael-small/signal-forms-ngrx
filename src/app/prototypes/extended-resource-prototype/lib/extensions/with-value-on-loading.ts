import { Resource, untracked } from '@angular/core';
import { ResourceExtension } from '../resource-extensions';

export function withValueOnLoading<R extends Resource<unknown>>(
  value: R extends Resource<infer V> ? V : never,
): ResourceExtension<R> {
  return {
    type: 'loading',
    apply: (resource) => {
      Object.defineProperty(resource, 'value', {
        value: new Proxy(resource.value, {
          apply(target, thisArg, args) {
            if (untracked(resource.isLoading)) {
              return value;
            }
            return Reflect.apply(target, thisArg, args);
          },
        }),
        configurable: true,
        enumerable: true,
        writable: true,
      });
    },
  };
}
