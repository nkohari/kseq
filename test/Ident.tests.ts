/// <reference path="../typings/main/ambient/mocha/index.d.ts" />
/// <reference path="../typings/main/ambient/chai/index.d.ts" />

import {Ident, Segment} from '../src/idents';
import {assert} from 'chai';

describe("Ident", () => {
  
  //--------------------------------------------------------------------------------

  describe("constructor()", () => {
    
    it("returns an Ident instance", () => {
      let ident = new Ident([Segment(0, 'foo')]);
      assert.instanceOf(ident, Ident);
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("getDepth()", () => {
    
    it("returns the correct depth", () => {
      let ident = Ident.parse("0.foo/1.foo/2.foo");
      assert.equal(ident.getDepth(), 3);
    });
 
  });
  
  //--------------------------------------------------------------------------------

  describe("getSegment()", () => {
    
    it("returns the path segment at the specified depth", () => {
      let ident = Ident.parse("0.foo/1.foo/2.foo");
      assert.deepEqual(ident.get(1), Segment(1, 'foo'));
    });
 
    it("if the specified depth is out of bounds, returns undefined", () => {
      let ident = Ident.parse("0.foo/1.foo/2.foo");
      assert.equal(ident.get(12), undefined);
    });
 
  });
  
  //--------------------------------------------------------------------------------

  describe("compare()", () => {
    
    it("when x is compared to itself, returns 0", () => {
      let x = Ident.parse("0.foo");
      assert.equal(x.compare(x), 0);
    });
    
    it("when x is identical to y, returns 0", () => {
      let x = Ident.parse("0.foo/1.foo/2.foo");
      let y = Ident.parse("0.foo/1.foo/2.foo");
      assert.equal(x.compare(y), 0);
    });
    
    it("when x and y are same depth, and x[0].digit < y[0].digit, returns -1", () => {
      let x = Ident.parse("1.foo");
      let y = Ident.parse("2.foo");
      assert.equal(x.compare(y), -1);
    });
    
    it("when x and y are same depth, and x[1].digit < y[1].digit, returns -1", () => {
      let x = Ident.parse("0.foo/1.foo/2.foo");
      let y = Ident.parse("0.foo/2.foo/2.foo");
      assert.equal(x.compare(y), -1);
    });
    
    it("when x and y are same depth, and x[0].digit > y[0].digit, returns 1", () => {
      let x = Ident.parse("2.foo");
      let y = Ident.parse("1.foo");
      assert.equal(x.compare(y), 1);
    });
    
    it("when x and y are same depth, and x[1].digit > y[1].digit, returns 1", () => {
      let x = Ident.parse("0.foo/2.foo/2.foo");
      let y = Ident.parse("0.foo/1.foo/2.foo");
      assert.equal(x.compare(y), 1);
    });
      
    it("when x = [1,3] and y = [1,2,3], returns 1", () => {
      let x = Ident.parse("1.foo/3.foo");
      let y = Ident.parse("1.foo/2.foo/3.foo");
      assert.equal(x.compare(y), 1);
    });
    
    it("when x = [1,2,3] and y = [1,3], returns -1", () => {
      let x = Ident.parse("1.foo/2.foo/3.foo");
      let y = Ident.parse("1.foo/3.foo");
      assert.equal(x.compare(y), -1);
    });    
    
    it("when x[0].site < y[0].site (lexicographically), returns -1", () => {
      let x = Ident.parse("1.bar");
      let y = Ident.parse("1.foo");
      assert.equal(x.compare(y), -1);
    });
    
    it("when x[0].site > y[0].site (lexicographically), returns 1", () => {
      let x = Ident.parse("1.foo");
      let y = Ident.parse("1.bar");
      assert.equal(x.compare(y), 1);
    });
    
    it("passes logoot example", () => {
      let x = Ident.parse("1.a");
      let y = Ident.parse("1.b");
      let z = Ident.parse("1.a/1.c");
      assert.equal(x.compare(y), -1);
      assert.equal(y.compare(z), 1);
    });
    
  });
  
  //--------------------------------------------------------------------------------

});