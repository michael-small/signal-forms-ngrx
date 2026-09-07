import { DomainModel } from './entity.model';
import { FormModel } from './form.model';

export class FormToDomain {
  public static mapDomainToFormModel(domain: DomainModel): FormModel {
    return {
      dbTable: domain.databaseTable,
      dbField: domain.databaseField,
      fieldType: domain.fieldType,
      numbers: domain.numbers,
      text: domain.text,
    };
  }

  public static mapFormModelToDomain(formModel: FormModel): DomainModel {
    return {
      databaseTable: formModel.dbTable,
      databaseField: formModel.dbField,
      fieldType: formModel.fieldType,
      numbers: formModel.numbers,
      text: formModel.text,
    };
  }
}
