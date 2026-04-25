import { Component, signal } from '@angular/core';
import { form, validateTree } from '@angular/forms/signals';

export class SudokuRow {
  rowModel = signal({
    cell1: 1,
    cell2: 3,
    cell3: 1,
    cell4: 4,
  });
  rowForm = form(this.rowModel, (schemaPath) => {
    validateTree(schemaPath, ({ value, fieldTreeOf }) => {
      const row = value();
      const entries = [
        { val: row.cell1, fieldTree: fieldTreeOf(schemaPath.cell1) },
        { val: row.cell2, fieldTree: fieldTreeOf(schemaPath.cell2) },
        { val: row.cell3, fieldTree: fieldTreeOf(schemaPath.cell3) },
        { val: row.cell4, fieldTree: fieldTreeOf(schemaPath.cell4) },
      ];
      const counts = new Map<number, number>();
      for (const { val } of entries) {
        if (val !== 0) {
          counts.set(val, (counts.get(val) ?? 0) + 1);
        }
      }
      const errors = entries
        .filter(({ val }) => val !== 0 && (counts.get(val) ?? 0) > 1)
        .map(({ val, fieldTree }) => ({
          kind: 'duplicateInRow',
          message: `${val} already appears in this row`,
          fieldTree,
        }));
      return errors.length > 0 ? errors : null;
    });
  });
}
