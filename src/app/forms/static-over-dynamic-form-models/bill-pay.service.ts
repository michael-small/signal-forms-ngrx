import { Injectable } from '@angular/core';
import { catchError, delay, firstValueFrom, of, switchMap, throwError } from 'rxjs';
import { BillPayDomainModel } from './bill-pay.model';

export const defaultBillPayData: BillPayDomainModel = {
  name: '',
  method: {
    type: '',
    card: {
      card: '',
      securityCode: '',
      expiration: '',
    },
    bank: {
      account: '',
      routing: '',
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class BillPayService {
  getCurrentBillingInfo() {
    const prefilledBankInfo: BillPayDomainModel = {
      ...defaultBillPayData,
      method: {
        ...defaultBillPayData.method,
        type: 'bank',
        bank: { account: '123456789', routing: '987654321' },
      },
    };

    return of(prefilledBankInfo).pipe(delay(500));
  }

  saveBillingInfo(billDomainModel: BillPayDomainModel, throwErr: boolean) {
    return firstValueFrom(
      of(billDomainModel).pipe(
        delay(500),
        switchMap((model) =>
          throwErr
            ? throwError(() => ({
                ok: false,
              }))
            : of({ ...model, ok: true }),
        ),
        catchError((err) => of(err)),
      ),
    );
  }
}
