import { Injectable } from '@angular/core';
import {
  DomainModel,
  NumberComparator,
  QueryArguments,
  TableField,
  TextComparator,
} from './entity.model';

export type FormModel = {
  dbTable: string;
  dbField: TableField['id'];
  fieldType: TableField['type'] | '';
  numbers: QueryArguments<NumberComparator | '', number>;
  text: QueryArguments<TextComparator | '', string>;
};

export const numbersDefault: QueryArguments<NumberComparator | '', number> = {
  comparator: '',
  value: 0,
};
export const textDefault: QueryArguments<TextComparator | '', string> = {
  comparator: '',
  value: '',
};

export const defaultFormModel: FormModel = {
  dbTable: '',
  dbField: '',
  fieldType: '',
  numbers: numbersDefault,
  text: textDefault,
};

@Injectable({
  providedIn: 'root',
})
export class FormModelDomainModelService {
  public mapDomainToFormModel(domain: DomainModel): FormModel {
    return {
      dbTable: domain.databaseTable,
      dbField: domain.databaseField,
      fieldType: domain.fieldType,
      numbers: domain.numbers,
      text: domain.text,
    };
  }

  // TODO - handle save mapping in store
  public mapFormModelToDomain(formModel: FormModel): DomainModel {
    return {
      databaseTable: formModel.dbTable,
      databaseField: formModel.dbField,
      fieldType: formModel.fieldType,
      numbers: formModel.numbers,
      text: formModel.text,
    };
  }
}
