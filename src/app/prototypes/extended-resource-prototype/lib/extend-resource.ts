import { inject, Resource } from '@angular/core';
import { RESOURCE_EXTENSIONS, ResourceExtension } from './resource-extensions';

export type ExtendResourceConfig<R extends Resource<unknown>> = {
  resource: R;
  extensions?: ResourceExtension<NoInfer<R>>[];
};

export function extendResource<R extends Resource<unknown>>(resource: R): R;
export function extendResource<R extends Resource<unknown>>(config: ExtendResourceConfig<R>): R;
export function extendResource<R extends Resource<unknown>>(
  resourceOrConfig: R | ExtendResourceConfig<R>,
): R {
  const [resource, extensions] =
    'value' in resourceOrConfig
      ? [resourceOrConfig, []]
      : [resourceOrConfig.resource, resourceOrConfig.extensions ?? []];
  const providedExtensions = inject(RESOURCE_EXTENSIONS, { optional: true }) ?? [];
  const allExtensions = [...providedExtensions, ...extensions];
  const uniqueExtensions = new Map(allExtensions.map((ext) => [ext.type, ext])).values();

  for (const extension of uniqueExtensions) {
    extension.apply(resource);
  }

  return resource;
}
