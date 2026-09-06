import { Component, inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { rxMutation, withResource } from '@ngrx-toolkit/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { delegatedSignal } from '../../prototypes/delegatedSignal/delegated-signal';
import { map } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

let currentId = 11;

const TodoStore = signalStore(
  { providedIn: 'root' },
  withProps(() => ({
    _http: inject(HttpClient),
  })),
  withResource(
    (store) => {
      return {
        todos: rxResource({
          stream: () => {
            return store._http
              .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
              .pipe(map((todos) => todos.slice(0, 10)));
          },
          defaultValue: [],
        }),
      };
    },
    {
      errorHandling: 'previous value',
    },
  ),
  withMethods((store) => ({
    addTodo: rxMutation({
      operation(todo: Todo) {
        return store._http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo);
      },
      onSuccess(todo) {
        patchState(store, { todosValue: [...store.todosValue(), todo] });
      },
    }),
    removeTodo: rxMutation({
      operation(id: number) {
        return store._http.delete<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`);
      },
      onSuccess(_removedTodo, id) {
        patchState(store, {
          todosValue: store.todosValue().filter((filteredTodo) => filteredTodo.id !== id),
        });
      },
    }),
    saveTodo: rxMutation({
      operation(todo: Todo) {
        return store._http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, todo);
      },
      onSuccess(updatedTodo) {
        patchState(store, {
          todosValue: store
            .todosValue()
            .map((filteredTodo) =>
              filteredTodo.id === updatedTodo.id ? updatedTodo : filteredTodo,
            ),
        });
      },
    }),
    patchTodos: (updatedTodos: Todo[]) =>
      patchState(store, {
        todosValue: store.todosValue().map((todo) => {
          const updatedTodo = updatedTodos.find((t) => t.id === todo.id);
          return updatedTodo ? updatedTodo : todo;
        }),
      }),
  })),
);

@Component({
  selector: 'app-full-crud',
  imports: [FormsModule, FormField, MatCheckboxModule],
  template: `
    <h1>Todo List</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (todo of form().value(); track todo.id) {
          <tr>
            <td>{{ todo.id }}</td>
            <td>
              <input [formField]="form[$index].title" type="text" />
            </td>
            <td>
              <mat-checkbox [formField]="form[$index].completed"></mat-checkbox>
            </td>
            <td>
              <button (click)="saveTodo(todo)">Save</button>
              <button (click)="removeTodo(todo.id)">X</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
    <div>
      <button (click)="addTodo()">Add Todo</button>
    </div>
  `,
})
export class FullCRUD {
  readonly #todoStore = inject(TodoStore);

  readonly #todos = delegatedSignal({
    source: this.#todoStore.todosValue,
    update: (todos) => this.#todoStore.patchTodos(todos),
  });

  protected form = form(this.#todos);

  protected addTodo() {
    this.#todoStore.addTodo({
      id: currentId++,
      title: 'New Todo',
      completed: false,
      userId: 1,
    });
  }

  protected saveTodo(todo: Todo) {
    this.#todoStore.saveTodo(todo);
  }

  protected removeTodo(id: number) {
    this.#todoStore.removeTodo(id);
  }
}
