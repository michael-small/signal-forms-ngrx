import { inject, InjectionToken, Provider, Resource } from '@angular/core';

export type ResourceExtension<R extends Resource<unknown>> = {
  type: string;
  apply: (resource: R) => void;
};

export const RESOURCE_EXTENSIONS = new InjectionToken<ResourceExtension<Resource<unknown>>[]>(
  'RESOURCE_EXTENSIONS',
);

export function provideResourceExtensions(
  ...extensions: ResourceExtension<Resource<unknown>>[]
): Provider {
  return {
    provide: RESOURCE_EXTENSIONS,
    useFactory: () => {
      const parentExtensions =
        inject(RESOURCE_EXTENSIONS, {
          optional: true,
          skipSelf: true,
        }) ?? [];

      return [...parentExtensions, ...extensions];
    },
  };
}
