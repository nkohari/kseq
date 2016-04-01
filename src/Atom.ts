import {Ident} from './Ident';

export class Atom<T> {
  
  id: Ident
  value: T
  
  constructor(id: Ident, value: T) {
    this.id = id;
    this.value = value;
  }

}
