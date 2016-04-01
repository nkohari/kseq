import {Ident, Segment} from './Ident';
import {Atom} from './Atom';
import {Storage} from './Storage';
import {ArrayStorage} from './ArrayStorage';
import {Op, OpKind, InsertOp, RemoveOp} from './Op';
import {defaults} from 'lodash';

enum Strategy {
  AddFromLeft = 1,
  SubtractFromRight = 2,
}

export interface Options<T> {
  startingWidth?: number
  maxDistance?: number
  storage?: Storage<T>
}

export function resolveOptions<T>(options: Options<T>): Options<T> {
  return defaults(options, {
    startingWidth: 16,
    maxDistance: 10
  });
}

export class Sequence<T> {
  
  replica: string
  
  private options: Options<T>
  private storage: Storage<T>
  private strategies: { [depth: number]: Strategy };
  private time: number;
  
  constructor(replica: string, options?: Options<T>) {
    this.replica = replica;
    this.options = resolveOptions(options);
    this.storage = this.options.storage || new ArrayStorage<T>();
    this.strategies = {};
    this.time = 0;
    this.storage.add(new Ident(0, [Segment(0, this.replica)]), null);
    this.storage.add(new Ident(0, [Segment(this.getWidthAtDepth(0), this.replica)]), null);
  }
  
  size() {
    return this.storage.size() - 2;
  }
  
  depth() {
    return Object.keys(this.strategies).length;
  }
  
  insert(value: T, pos: number): InsertOp {
    let before = this.storage.get(pos);
    let after  = this.storage.get(pos + 1);
    let id     = this.createIdent(before.id, after.id);
    let op     = new InsertOp(id, value);
    this.apply(op);
    return op;
  }
  
  append(value: T): InsertOp {
    return this.insert(value, this.size());
  }
  
  remove(pos: number): RemoveOp {
    let atom = this.storage.get(pos);
    if (atom) {
      let op = new RemoveOp(atom.id)
      this.apply(op);
      return op;
    }
    return null;
  }
    
  get(pos: number): T {
    const atom = this.storage.get(pos + 1);
    return atom ? atom.value : undefined;
  }
  
  forEach(func: { (T): void }): void {
    this.storage.forEach((atom) => func(atom.value));
  }
  
  map<R>(func: { (T): R }): R[] {
    return this.storage.map((atom) => func(atom.value));
  }
  
  toArray(): T[] {
    return this.storage.map((atom) => atom.value);
  }
  
  toJSON() {
    return {
      r: this.replica,
      t: this.time,
      d: this.storage.map((atom) => [atom.id.toString(), atom.value])
    }
  }
  
  apply(op: Op): void {
    switch (op.kind) {
      case OpKind.Insert:
        let insertOp = <InsertOp> op; 
        this.storage.add(insertOp.id, insertOp.value);
        break;
      case OpKind.Remove:
        let removeOp = <RemoveOp> op; 
        this.storage.remove(removeOp.id);
        break;
      default:
        throw new Error(`Unknown op kind ${op.kind}`);
    }
  }
  
  private createIdent(before: Ident, after: Ident): Ident {
    let distance: number = 0;
    let depth: number = -1;
    let min: number = 0;
    let max: number = 0;
    
    while (distance < 1) {
      depth++;
      let left = before.get(depth);
      let right = after.get(depth);
      min = left ? left.digit : 0;
      max = right ? right.digit : this.getWidthAtDepth(depth);
      distance = max - min - 1;
    }
    
    let boundary = Math.min(distance, this.options.maxDistance);
    let delta = Math.floor(Math.random() * boundary) + 1;
    let strategy = this.getStrategyAtDepth(depth);
    
    let ident = new Ident(++this.time, before.slice(depth, this.replica));
    
    if (strategy == Strategy.AddFromLeft) {
      ident.add(Segment(min + delta, this.replica));
    }
    else {
      ident.add(Segment(max - delta, this.replica));
    }
    
    return ident;
  }
  
  private getWidthAtDepth(depth: number): number {
    let power = depth + this.options.startingWidth;
    if (power > 53) power = 53;
    return Math.pow(2, power) - 1;
  }
  
  private getStrategyAtDepth(depth: number): Strategy {
    let strategy = this.strategies[depth];
    if (!strategy) {
      let random = Math.floor(Math.random() * 2) + 1;
      strategy = this.strategies[depth] = <Strategy> random;
    }
    return strategy;
  }
  
}