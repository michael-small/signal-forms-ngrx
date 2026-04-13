import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {
  DomainModel,
  NumberComparator,
  QueryArguments,
  TableField,
  TextComparator,
} from './entity.model';

@Injectable({
  providedIn: 'root',
})
export class EntityDataService {
  public getDbTables(): Observable<{ id: string; name: string }[]> {
    const tables = [
      { id: 'users', name: 'Users' },
      { id: 'orders', name: 'Orders' },
    ];
    return of(tables).pipe(delay(1000));
  }

  public getTableFields(tableId: string): Observable<TableField[]> {
    let fields: TableField[] = [];

    if (tableId === 'users') {
      fields = [
        { id: 'id', name: 'User ID', type: 'number' },
        { id: 'name', name: 'User Name', type: 'text' },
        { id: 'email', name: 'User Email', type: 'text' },
      ];
    } else if (tableId === 'orders') {
      fields = [
        { id: 'id', name: 'Order ID', type: 'number' },
        { id: 'name', name: 'Order Name', type: 'text' },
        { id: 'amount', name: 'Order Amount', type: 'number' },
      ];
    } else {
      fields = [];
    }
    return of(fields).pipe(delay(1000));
  }

  public getFormData(): Observable<DomainModel> {
    return of<DomainModel>({
      databaseTable: 'users',
      databaseField: 'name',
      fieldType: 'text',
      numbers: {
        comparator: '',
        value: 0,
      },
      text: {
        comparator: 'equals',
        value: 'test',
      },
    }).pipe(delay(1000));
  }
}
