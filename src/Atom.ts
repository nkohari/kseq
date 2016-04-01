import {Ident} from './Ident';

/**
 * A value stored in the Sequence, with its unique identifier.
 */
export class Atom<T> {
  
  /**
   * The atom's unique identifier.
   */
  id: Ident
  
  /**
   * The atom's value.
   */
  value: T
  
  /**
   * Creates an instance of Atom<T>.
   * @param id    The atom's unique identifier.
   * @param value The atom's value.
   * @returns An instance of Atom<T>. 
   */
  constructor(id: Ident, value: T) {
    this.id = id;
    this.value = value;
  }

}
