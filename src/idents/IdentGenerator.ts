import {Ident} from './Ident';

/**
 * Creates Idents using an algorithm that guarantees that the
 * application of operations will be associative, commutative,
 * and idempotent.
 */
export interface IdentGenerator {
  
  /**
   * Issues a new logical timestamp, possibly incrementing the clock.
   * @returns The current logical time.
   */
  getTime(increment?: boolean): number
  
  /**
   * Creates the two special bookend Idents that represent the beginning
   * and end of a sequence.
   * @returns A tuple containing the first and last bookend Idents.
   */
  getBookends(): [Ident, Ident]
  
  /**
   * Creates a new Ident whose value lies somewhere between two other Idents.
   * @param before The Ident that should come directly before the new Ident.
   * @param before The Ident that should come directly after the new Ident.
   * @returns The newly-generated Ident.
   */
  getIdent(before: Ident, after: Ident): Ident
  
}
