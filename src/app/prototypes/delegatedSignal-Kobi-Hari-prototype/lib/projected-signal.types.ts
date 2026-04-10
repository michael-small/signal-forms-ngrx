import { WritableSignal } from '@angular/core';

export interface ProjectedSignal<T> extends WritableSignal<T> {}

export interface ProjectedSignalOptions<T> {
  computation: () => T;
  update: (value: T) => void;
}
