export const numberComparators = [
  { value: 'equals', label: 'Equals' },
  { value: 'greater', label: 'Greater Than' },
  { value: 'less', label: 'Less Than' },
] as const;

export const textComparators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
] as const;

export type NumberComparator = (typeof numberComparators)[number]['value'];
export type TextComparator = (typeof textComparators)[number]['value'];

export type QueryArguments<
  ComparatorType extends NumberComparator | TextComparator | '',
  ValueType extends number | string,
> = {
  comparator: ComparatorType;
  value: ValueType;
};

export type TableField = {
  id: string;
  name: string;
  type: 'number' | 'text';
};

export type DomainModel = {
  databaseTable: string;
  databaseField: TableField['id'];
  fieldType: TableField['type'] | ''; // TODO - realistically this is not on the server but done at runtime
  numbers: QueryArguments<NumberComparator | '', number>;
  text: QueryArguments<TextComparator | '', string>;
};
