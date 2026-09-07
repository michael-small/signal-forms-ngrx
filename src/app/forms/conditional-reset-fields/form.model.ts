import { NumberComparator, QueryArguments, TableField, TextComparator } from './entity.model';

export type FormModel = {
  dbTable: string;
  dbField: TableField['id'];
  fieldType: TableField['type'] | '';
  numbers: QueryArguments<NumberComparator | '', number>;
  text: QueryArguments<TextComparator | '', string>;
};

const numbersDefault: QueryArguments<NumberComparator | '', number> = {
  comparator: '',
  value: 0,
};
const textDefault: QueryArguments<TextComparator | '', string> = {
  comparator: '',
  value: '',
};

export const defaultConditionalFormModel: FormModel = {
  dbTable: '',
  dbField: '',
  fieldType: '',
  numbers: numbersDefault,
  text: textDefault,
};
