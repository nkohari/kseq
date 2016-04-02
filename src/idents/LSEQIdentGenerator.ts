import {Ident} from './Ident';
import {IdentGenerator} from './IdentGenerator';
import {Segment} from './Segment';

/**
 * The identifier allocation strategy to use at a specified depth.
 */
enum LSEQStrategy {
  
  /**
   * Generate identifiers by adding a value to the previous digit.
   */
  AddFromLeft = 1,
  
  /**
   * Generate identifiers by subtracting a value to the next digit.
   */
  SubtractFromRight = 2,
  
}

/**
 * An IdentGenerator that implements LSEQ to create identifiers.
 */
export class LSEQIdentGenerator implements IdentGenerator {
  
  replica: string
  startingWidth: number
  maxDistance: number
  strategies: LSEQStrategy[]
  first: Ident
  last: Ident
  
  /**
   * Creates an instance of LSEQIdentGenerator.
   * @param replica       The replica id.
   * @param startingWidth The width (2^x) of the first level of Idents.
   * @param maxDistance   The maximum delta between two Idents.
   * @returns An instance of LSEQIdentGenerator.
   */
  constructor(replica: string, startingWidth: number = 4, maxDistance: number = 10) {
    this.replica = replica;
    this.startingWidth = startingWidth;
    this.maxDistance = maxDistance;
    this.strategies = [];
    this.first = new Ident([Segment(0, this.replica)]);
    this.last = new Ident([Segment(this.getWidthAtDepth(0), this.replica)]);
  }
  
  /**
   * @inheritdoc
   */
  getIdent(before: Ident = this.first, after: Ident = this.last): Ident {
    
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
    
    let boundary = Math.min(distance, this.maxDistance);
    let delta = Math.floor(Math.random() * boundary) + 1;
    let strategy = this.getStrategyAtDepth(depth);
    
    let ident = new Ident(before.slice(depth, this.replica));
    
    if (strategy == LSEQStrategy.AddFromLeft) {
      ident.add(Segment(min + delta, this.replica));
    }
    else {
      ident.add(Segment(max - delta, this.replica));
    }
    
    return ident;
  }
  
  /**
   * Gets the maximum addressable digit at the specified depth. This is
   * generally 2^(depth + startingWidth) - 1, with a maximum of 2^53 - 1
   * (the largest integer that can be stored in a Number.)
   * @param depth The desired depth.
   * @returns The maximum addressable digit at the specified depth.
   */
  private getWidthAtDepth(depth: number): number {
    let power = depth + this.startingWidth;
    if (power > 53) power = 53;
    return 2**power - 1;
  }
  
  /**
   * Gets the digit allocation strategy for the specified depth.
   * If none has been selected, one is chosen at random.
   * @param depth The desired depth.
   * @returns The strategy to use at that depth.
   */
  private getStrategyAtDepth(depth: number): LSEQStrategy {
    let strategy = this.strategies[depth];
    if (!strategy) {
      let random = Math.floor(Math.random() * 2) + 1;
      strategy = this.strategies[depth] = <LSEQStrategy> random;
    }
    return strategy;
  }
  
}