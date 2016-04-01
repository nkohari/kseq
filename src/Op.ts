import {Ident} from './Ident';

export enum OpKind {
  Insert = 1,
  Remove = 2,
}

export abstract class Op {
  
  kind: OpKind
  
  constructor(kind: OpKind) {
    this.kind = kind;
  }
  
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
  
  abstract toString();
  
}

export class InsertOp extends Op {
  
  constructor(public id: Ident, public value: any) {
    super(OpKind.Insert)
  }
  
  toString() {
    return `+${this.id.toString()}!${this.value.toString()}`
  }
  
}

export class RemoveOp extends Op {
  
  constructor(public id: Ident) {
    super(OpKind.Remove)
  }
  
  toString() {
    return `-${this.id.toString()}`
  }
  
}