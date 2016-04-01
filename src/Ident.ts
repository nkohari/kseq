export interface Segment {
  digit: number
  replica: string
}

export function Segment(digit: number, replica: string): Segment {
  return {digit, replica};
}

export class Ident {
  
  path: Segment[]
  time: number
  
  constructor(time: number, path: Segment[]) {
    this.time = time;
    this.path = path;
  }
  
  static parse(str: string): Ident {
    let [pathString, time] = str.split('#', 1);
    let path = pathString.split('/').map((token) => {
      let [digit, replica] = token.split('.');
      return Segment(Number(digit), replica);
    });
    return new Ident(Number(time), path);
  }
  
  get(depth: number): Segment {
    return this.path[depth];
  }
  
  getDepth(): number {
    return this.path.length;
  }
  
  add(segment: Segment) {
    this.path.push(segment);
  }
  
  slice(depth: number, replica: string): Segment[] {
    let path = [];
    for (let i = 0; i < depth; i++) {
      path.push(this.path[i] || Segment(0, replica));
    }
    return path;
  }
  
  compare(other: Ident): number {
    let depth = Math.max(this.path.length, other.path.length);
    for (let i = 0; i < depth; i++) {
      let my = this.get(i);
      let their = other.get(i);
      if (my === undefined && their !== undefined) return -1;
      if (my !== undefined && their === undefined) return 1;
      if (my.digit < their.digit) return -1;
      if (my.digit > their.digit) return 1;
      if (my.replica < their.replica) return -1;
      if (my.replica > their.replica) return 1;
    }
    if (this.time < other.time) return -1;
    if (this.time > other.time) return 1;
    return 0;
  }
  
  toString() {
    let path = this.path.map((seg) => `${seg.digit}.${seg.replica}`).join('/');
    return `${path}#${this.time}`;
  }
  
}