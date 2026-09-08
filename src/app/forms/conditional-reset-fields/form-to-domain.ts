import { Service } from '@angular/core';
import { DomainModel } from './entity.model';
import { FormModel } from './form.model';

@Service()
export class FormToDomain {
  public mapDomainToFormModel(domain: DomainModel): FormModel {
    return {
      dbTable: domain.databaseTable,
      dbField: domain.databaseField,
      fieldType: domain.fieldType,
      numbers: domain.numbers,
      text: domain.text,
    };
  }

  public mapFormModelToDomain(formModel: FormModel, stuff: number): DomainModel {
    return {
      databaseTable: formModel.dbTable,
      databaseField: formModel.dbField,
      fieldType: formModel.fieldType,
      numbers: formModel.numbers,
      text: formModel.text,
    };
  }
}
