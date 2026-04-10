// https://angular.dev/guide/forms/signals/model-design#domain-model-to-form-model
// TL;DR Domain models are not always the same as form models.

import { Inject, Injectable } from '@angular/core';

export interface BillPayDomainModel {
  name: string;
  method: {
    type: string;
    card: {
      card: string;
      securityCode: string;
      expiration: string;
    };
    bank: {
      account: string;
      routing: string;
    };
  };
}

export interface BillPayFormModel {
  name: string;
  method: {
    type: string;
    card: {
      cardNumber: string;
      securityCode: string;
      expiration: string;
    };
    bank: {
      accountNumber: string;
      routingNumber: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class DomainAndFormMappings {
  public mapDomainToForm(domainModel: BillPayDomainModel): BillPayFormModel {
    return {
      name: domainModel?.name ?? '',
      method: {
        type: domainModel?.method?.type ?? 'bank',
        card: {
          cardNumber: domainModel?.method?.card?.card ?? '',
          securityCode: domainModel?.method?.card?.securityCode ?? '',
          expiration: domainModel?.method?.card?.expiration ?? '',
        },
        bank: {
          accountNumber: domainModel?.method?.bank?.account ?? '',
          routingNumber: domainModel?.method?.bank?.routing ?? '',
        },
      },
    };
  }

  public mapFormToDomain(formModel: BillPayFormModel): BillPayDomainModel {
    return {
      name: formModel?.name ?? '',
      method: {
        type: formModel?.method?.type ?? 'bank',
        card: {
          card: formModel?.method?.card?.cardNumber ?? '',
          securityCode: formModel?.method?.card?.securityCode ?? '',
          expiration: formModel?.method?.card?.expiration ?? '',
        },
        bank: {
          account: formModel?.method?.bank?.accountNumber ?? '',
          routing: formModel?.method?.bank?.routingNumber ?? '',
        },
      },
    };
  }
}
