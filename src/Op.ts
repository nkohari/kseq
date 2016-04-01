import {Ident} from './idents';

/**
 * The kind of operation.
 */
export enum OpKind {
  Insert = 1,
  Remove = 2,
}

/**
 * An operation on a Sequence<T>.
 */
export abstract class Op {
  
  /**
   * The kind of operation.
   */
  kind: OpKind
  
  /**
   * Creates an instance of Op.
   * @param kind The kind of operation.
   * @returns An instance of Op.
   */
  constructor(kind: OpKind) {
    this.kind = kind;
  }
  
  /**
   * Converts an encoded string to an Op of the correct type.
   * @param str The encoded string.
   * @returns An instance of the encoded Op.
   */
  static parse(str: string): Op {
    const kind = str[0];
    const [idString, value] = str.substr(1).split('!');
    const id = Ident.parse(idString);
    switch(kind) {
      case '+':
        return new InsertOp(id, value);
      case '-':
        return new RemoveOp(id);
    }
  }
  
  /**
   * Encodes the Op as a compact string representation.
   */
  abstract toString(): string;
  
}

/**
 * An operation that inserts an atom into the sequence with
 * the specified identifier and value.
 */
export class InsertOp extends Op {
  
  /**
   * The identifier for the value.
   */
  id: Ident
  
  /**
   * The value to insert.
   */
  value: any
  
  /**
   * Creates an instance of InsertOp.
   * @param id    The identifier for the value.
   * @param value The value to insert.
   * @returns An instance of InsertOp.
   */
  constructor(id: Ident, value: any) {
    super(OpKind.Insert)
    this.id = id;
    this.value = value;
  }
  
  /**
   * @inheritdoc
   */
  toString() {
    return `+${this.id.toString()}!${this.value.toString()}`
  }
  
}

/**
 * An operation that removes an atom with the specified identifer.
 */
export class RemoveOp extends Op {
  
  /**
   * The identifier to remove.
   */
  id: Ident
  
  /**
   * Creates an instance of RemoveOp.
   * @param id The identifier of the atom to remove.
   * @returns An instance of RemoveOp.
   */
  constructor(id: Ident) {
    super(OpKind.Remove)
    this.id = id;
  }
  
  /**
   * @inheritdoc
   */
  toString() {
    return `-${this.id.toString()}`
  }
  
}