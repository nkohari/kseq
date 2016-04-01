import {Atom} from './Atom';
import {Storage} from './Storage';
import {Ident} from './Ident';

export class ArrayStorage<T> implements Storage<T> {
  
  private atoms: Atom<T>[]
  
  constructor() {
    this.atoms = [];
  }
  
  size() {
    return this.atoms.length;
  }
  
  get(pos: number): Atom<T> {
    return this.atoms[pos];
  }
  
  add(id: Ident, value: T): number {
    let pos = this.bisectRight(id);
    let existing = this.get(pos);
    if (existing && id.compare(existing.id) == 0) {
      return -1;
    }
    let atom = new Atom<T>(id, value);
    this.atoms.splice(pos, 0, atom);
    return pos;
  }
  
  remove(id: Ident): number {
    let pos = this.indexOf(id);
    if (pos >= 0) {
      this.atoms.splice(pos, 1);
      return pos;
    }
    return -1;
  }
  
  indexOf(id: Ident): number {
    let pos = this.bisectLeft(id);
    if (pos !== this.atoms.length && this.atoms[pos].id.compare(id) == 0) {
      return pos;
    }
    else {
      return -1;
    }
  }
  
  forEach(func: { (atom: Atom<T>): void }): void {
    this.atoms.forEach(func);
  }
  
  map<R>(func: { (atom: Atom<T>): R }): R[] {
    return this.atoms.map(func);
  }
  
  toArray(): Atom<T>[] {
    return this.atoms;
  }
  
  private bisectLeft(id: Ident): number {
    let min = 0;
    let max = this.atoms.length;
    
    while (min < max) {
      let curr = Math.floor((min + max) / 2);
      if (this.atoms[curr].id.compare(id) < 0) {
        min = curr + 1;
      }
      else {
        max = curr;
      }
    }
    
    return min;
  }
  
  private bisectRight(id: Ident): number {
    let min = 0;
    let max = this.atoms.length;
    
    while (min < max) {
      let curr = Math.floor((min + max) / 2);
      if (id.compare(this.atoms[curr].id) < 0) {
        max = curr;
      }
      else {
        min = curr + 1;
      }
    }
    
    return min;
  }
  
}