/// <reference path="../typings/main/ambient/mocha/index.d.ts" />
/// <reference path="../typings/main/ambient/chai/index.d.ts" />

import {Ident, Segment} from '../src/Ident';
import {assert} from 'chai';

describe("Ident", () => {
  
  describe("constructor()", () => {
    
    it("returns an Ident instance", () => {
      let seq = new Ident(0, [Segment(0, 'foo')]);
      assert.instanceOf(seq, Ident);
    });
    
  });
  
  describe("getDepth()", () => {
    
    it("returns the correct depth", () => {
      let ident = new Ident(0, [Segment(0, 'foo'), Segment(1, 'foo'), Segment(2, 'foo')]);
      assert.equal(ident.getDepth(), 3);
    });
 
  });
  
  describe("getSegment()", () => {
    
    it("returns the path segment at the specified depth", () => {
      let ident = new Ident(0, [Segment(0, 'foo'), Segment(1, 'foo'), Segment(2, 'foo')]);
      assert.deepEqual(ident.get(1), Segment(1, 'foo'));
    });
 
    it("if the specified depth is out of bounds, returns undefined", () => {
      let ident = new Ident(0, [Segment(0, 'foo'), Segment(1, 'foo'), Segment(2, 'foo')]);
      assert.equal(ident.get(12), undefined);
    });
 
  });
  
  describe("compare()", () => {
    
    it("when x is compared to itself, returns 0", () => {
      let x = new Ident(0, [Segment(1, 'foo')]);
      assert.equal(x.compare(x), 0);
    });
    
    it("when x is identical to y, returns 0", () => {
      let x = new Ident(0, [Segment(0, 'foo'), Segment(1, 'foo'), Segment(2, 'foo')]);
      let y = new Ident(0, [Segment(0, 'foo'), Segment(1, 'foo'), Segment(2, 'foo')]);
      assert.equal(x.compare(y), 0);
    });
    
    it("when x and y are same depth, and x[0].digit < y[0].digit, returns -1", () => {
      let x = new Ident(0, [Segment(1, 'foo')]);
      let y = new Ident(0, [Segment(2, 'foo')]);
      assert.equal(x.compare(y), -1);
    });
    
    it("when x and y are same depth, and x[1].digit < y[1].digit, returns -1", () => {
      let x = new Ident(0, [Segment(1, 'foo'), Segment(2, 'foo'), Segment(3, 'foo')]);
      let y = new Ident(0, [Segment(1, 'foo'), Segment(3, 'foo'), Segment(3, 'foo')]);
      assert.equal(x.compare(y), -1);
    });
    
    it("when x and y are same depth, and x[0].digit > y[0].digit, returns 1", () => {
      let x = new Ident(0, [Segment(2, 'foo')]);
      let y = new Ident(0, [Segment(1, 'foo')]);
      assert.equal(x.compare(y), 1);
    });
    
    it("when x and y are same depth, and x[1].digit > y[1].digit, returns 1", () => {
      let x = new Ident(0, [Segment(1, 'foo'), Segment(3, 'foo'), Segment(3, 'foo')]);
      let y = new Ident(0, [Segment(1, 'foo'), Segment(2, 'foo'), Segment(3, 'foo')]);
      assert.equal(x.compare(y), 1);
    });
      
    it("when x = [1,3] and y = [1,2,3], returns 1", () => {
      let x = new Ident(0, [Segment(1, 'foo'), Segment(3, 'foo')]);
      let y = new Ident(0, [Segment(1, 'foo'), Segment(2, 'foo'), Segment(3, 'foo')]);
      assert.equal(x.compare(y), 1);
    });
    
    it("when x = [1,2,3] and y = [1,3], returns -1", () => {
      let x = new Ident(0, [Segment(1, 'foo'), Segment(2, 'foo'), Segment(3, 'foo')]);
      let y = new Ident(0, [Segment(1, 'foo'), Segment(3, 'foo')]);
      assert.equal(x.compare(y), -1);
    });
    
    it("when x.time < y.time, returns -1", () => {
      let x = new Ident(0, [Segment(1, 'foo')]);
      let y = new Ident(1, [Segment(1, 'foo')]);
      assert.equal(x.compare(y), -1);
    });
    
    it("when x.time > y.time, returns 1", () => {
      let x = new Ident(1, [Segment(1, 'foo')]);
      let y = new Ident(0, [Segment(1, 'foo')]);
      assert.equal(x.compare(y), 1);
    });
    
    it("when x[0].site < y[0].site (lexicographically), returns -1", () => {
      let x = new Ident(0, [Segment(1, 'bar')]);
      let y = new Ident(0, [Segment(1, 'foo')]);
      assert.equal(x.compare(y), -1);
    });
    
    it("when x[0].site > y[0].site (lexicographically), returns 1", () => {
      let x = new Ident(0, [Segment(1, 'foo')]);
      let y = new Ident(0, [Segment(1, 'bar')]);
      assert.equal(x.compare(y), 1);
    });
    
    it("passes logoot example", () => {
      let x = new Ident(0, [Segment(1, 'a')]);
      let y = new Ident(2, [Segment(1, 'b')]);
      let z = new Ident(23, [Segment(1, 'a'), Segment(1, 'c')]);
      assert.equal(x.compare(y), -1);
      assert.equal(y.compare(z), 1);
    });
    
  });
  
});