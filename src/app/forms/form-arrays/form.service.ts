import { Injectable, signal } from '@angular/core';
import { applyEach, form, hidden, required, SchemaPathTree } from '@angular/forms/signals';

type DifferingObject = {
  type: 'A' | 'B';
  a: {
    value: string;
  };
  b: {
    value: number;
  };
};
const initialDifferingObjects: DifferingObject[] = [
  {
    type: 'A',
    a: {
      value: 'Value for A',
    },
    b: {
      value: 0,
    },
  },
  {
    type: 'B',
    a: {
      value: '',
    },
    b: {
      value: 0,
    },
  },
];

function ItemSchema(item: SchemaPathTree<DifferingObject>) {
  required(item.type);

  hidden(item.a, ({ valueOf }) => valueOf(item.type) !== 'A');
  required(item.a.value, { message: 'Value for A is required' });

  hidden(item.b, ({ valueOf }) => valueOf(item.type) !== 'B');
  required(item.b.value, { message: 'Value for B is required' });
}

@Injectable()
export class FormService {
  private model = signal<{ items: DifferingObject[] }>({
    items: initialDifferingObjects,
  });

  public differingObjectsArrayForm = form(this.model, (p) => {
    applyEach(p.items, ItemSchema);
  });

  public addItem() {
    this.model.update((current) => {
      return {
        items: current.items.toSpliced(1, 0, {
          type: 'A',
          a: {
            value: 'Prefilled value for A',
          },
          b: {
            value: 0,
          },
        }),
      };
    });
  }
}
