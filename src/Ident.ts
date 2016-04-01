import {Segment} from './Segment';

/**
 * An identifier that can uniquely identify an atom in a sequence.
 */
export class Ident {
  
  /**
   * The ordered set of path segments that make up the identifier.
   */
  path: Segment[]
  
  /**
   * The (logical) timestamp for the identifier. 
   */
  time: number
  
  /**
   * Creates an instance of Ident.
   * @param time The logical timestamp.
   * @param path The ordered set of path segments.
   * @returns An instance of Ident.
   */
  constructor(time: number, path: Segment[]) {
    this.time = time;
    this.path = path;
  }
  
  /**
   * Converts a string representation into an Ident.
   * @param str The string to parse.
   * @returns The parsed instance of Ident.
   */
  static parse(str: string): Ident {
    let [pathString, time] = str.split('#', 1);
    let path = pathString.split('/').map((token) => {
      let [digit, replica] = token.split('.');
      return Segment(Number(digit), replica);
    });
    return new Ident(Number(time), path);
  }
  
  /**
   * Gets the Segment of the identifier at the specified depth.
   * @param depth The desired depth.
   * @returns The Segment at the depth.
   */
  get(depth: number): Segment {
    return this.path[depth];
  }
  
  /**
   * Gets the depth of the path (the number of segments it contains).
   * @returns The depth.
   */
  getDepth(): number {
    return this.path.length;
  }
  
  /**
   * Appends the specified Segment to the end of the path.
   * @param segment The Segment to append.
   */
  add(segment: Segment) {
    this.path.push(segment);
  }
  
  /**
   * Returns a subset of the identifier's path, up until the specified
   * depth. If the identifier is not deep enough, segments are filled
   * in using the specified replica id.
   * @param depth   The desired depth.
   * @param replica The replica id to use to fill in missing segments.
   * @returns An array of Segments representing the subpath.
   */
  slice(depth: number, replica: string): Segment[] {
    let path = [];
    for (let i = 0; i < depth; i++) {
      path.push(this.path[i] || Segment(0, replica));
    }
    return path;
  }
  
  /**
   * Compares the value of this identifier to another.
   * @param other The identifier to compare.
   * @returns -1 if this identifier is lesser,
   *          1 if it is greater,
   *          or 0 if they are equal.
   */
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
  
  /**
   * Encodes the identifier as a compact string representation.
   * @returns The string representation.
   */
  toString(): string {
    let path = this.path.map((seg) => `${seg.digit}.${seg.replica}`).join('/');
    return `${path}#${this.time}`;
  }
  
}