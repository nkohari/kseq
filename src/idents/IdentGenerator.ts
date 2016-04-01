import {Ident} from './Ident';

/**
 * Creates Idents using an algorithm that guarantees that the
 * application of operations will be associative, commutative,
 * and idempotent.
 */
export interface IdentGenerator {
  
  /**
   * Gets the current logical timestamp.
   * @returns The current logical timestamp.
   */
  getTime(): number
  
  /**
   * Creates a new Ident whose value lies somewhere between two other Idents.
   * @param before The Ident that should come directly before the new Ident.
   * @param before The Ident that should come directly after the new Ident.
   * @returns The newly-generated Ident.
   */
  getIdent(before: Ident, after: Ident): Ident
  
}
