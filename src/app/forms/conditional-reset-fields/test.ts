import { Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, timer } from 'rxjs';

@Service()
export class TempService {
  val$ = timer(1, 1000);

  val = toSignal(this.val$, { initialValue: 0 });
}
