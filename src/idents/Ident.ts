import {Segment} from './Segment';

/**
 * An identifier that can uniquely identify an atom in a sequence.
 */
export class Ident {
  
  /**
   * The local logical time of the replica that created the identifier.
   */
  time: number
  
  /**
   * The ordered set of path segments that make up the identifier.
   */
  private path: Segment[]
  
  /**
   * Creates an instance of Ident.
   * @param time The local logical time of the creating replica.
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
    try {
      let [time, pathstr] = str.split('#');
      if (time === undefined || time.length == 0) {
        throw new Error("The ident is missing a timestamp");
      }
      if (pathstr === undefined || pathstr.length == 0) {
        throw new Error("The ident is missing a path");
      }
      let prev = undefined;
      let path = pathstr.split('.').map((token) => {
        let [digit, replica] = token.split(':', 2);
        if (!replica) replica = prev;
        else prev = replica;
        return Segment(Number(digit), replica);
      });
      return new Ident(Number(time), path);
    }
    catch (err) {
      throw new Error(`Error parsing Ident: ${err}`);
    }
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
  depth(): number {
    return this.path.length;
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
    let prev = undefined;
    let path = this.path.map((seg) => {
      if (seg.replica == prev) {
        return seg.digit;
      }
      else {
        prev = seg.replica;
        return `${seg.digit}:${seg.replica}`;
      }
    });
    return `${this.time}#${path.join('.')}`;
  }
  
}