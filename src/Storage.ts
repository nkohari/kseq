import {Atom} from './Atom';
import {Ident} from './Ident';

export interface Storage<T> {
  size(): number
  get(pos: number): Atom<T>
  add(id: Ident, value: T): number
  remove(id: Ident): number
  indexOf(id: Ident): number
  forEach(func: { (atom: Atom<T>): void }): void
  map<R>(func: { (atom: Atom<T>): R }): R[]
  toArray(): Atom<T>[]
}
