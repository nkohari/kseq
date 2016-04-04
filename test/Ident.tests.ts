/// <reference path="../typings/main/ambient/chai/index.d.ts" />
/// <reference path="../typings/main/ambient/mocha/index.d.ts" />

import {Ident, Segment} from '../src/idents';
import {assert} from 'chai';

describe("Ident", () => {
  
  //--------------------------------------------------------------------------------

  describe("constructor()", () => {
    
    it("returns an Ident instance", () => {
      let ident = new Ident(0, [Segment(0, 'foo')]);
      assert.instanceOf(ident, Ident);
    });
    
  });
  
  //--------------------------------------------------------------------------------
  
  describe("parse()", () => {
    
    describe("when provided an ident with one segment", () => {
      
      it("correctly parses the time", () => {
        let ident = Ident.parse("0#1:foo");
        assert.equal(ident.time, 0);
      });
      
      it("correctly parses the path of the segment", () => {
        let ident = Ident.parse("0#1:foo");
        assert.equal(ident.depth(), 1);
        let segment = ident.get(0);
        assert.equal(segment.digit, 1);
        assert.equal(segment.replica, 'foo');
      });
      
    });
    
    describe("when provided an ident with multiple segments from the same replica", () => {
      
      it("correctly parses the path", () => {
        let ident = Ident.parse("0#1:foo.2.3");
        assert.equal(ident.depth(), 3);
        let expected = [1,2,3];
        for (let i = 0; i < ident.depth(); i++) {
          assert.equal(ident.get(i).digit, expected[i]);
        }
      });
      
      it("correctly infers the replica name from previous segments", () => {
        let ident = Ident.parse("0#1:foo.2.3");
        assert.equal(ident.depth(), 3);
        for (let i = 0; i < ident.depth(); i++) {
          assert.equal(ident.get(i).replica, 'foo');
        }
      });
      
    });
    
    describe("when provided an ident with multiple segments from different replicas", () => {
      
      it("correctly parses the path", () => {
        let ident = Ident.parse("0#1:foo.2.3:bar.4");
        assert.equal(ident.depth(), 4);
        let expected = [1,2,3,4];
        for (let i = 0; i < ident.depth(); i++) {
          assert.equal(ident.get(i).digit, expected[i]);
        }
      });
      
      it("correctly infers the replica name from previous segments", () => {
        let ident = Ident.parse("0#1:foo.2.3:bar.4");
        assert.equal(ident.depth(), 4);
        let expected = ['foo', 'foo', 'bar', 'bar'];
        for (let i = 0; i < ident.depth(); i++) {
          assert.equal(ident.get(i).replica, expected[i]);
        }
      });
      
    });
    
    describe("when provided an invalid ident without a time", () => {
      
      it("throws an Error", () => {
        let func = () => {
          Ident.parse("derp");
        };
        assert.throws(func, Error);
      });
      
    });
    
    describe("when provided an invalid ident without a path", () => {
      
      it("throws an Error", () => {
        let func = () => {
          Ident.parse("0");
        };
        assert.throws(func, Error);
      });
      
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("getDepth()", () => {
    
    it("returns the correct depth", () => {
      let ident = Ident.parse("1#0:foo.1.2");
      assert.equal(ident.depth(), 3);
    });
 
  });
  
  //--------------------------------------------------------------------------------

  describe("getSegment()", () => {
    
    it("returns the path segment at the specified depth", () => {
      let ident = Ident.parse("1#0:foo.1.2");
      assert.deepEqual(ident.get(1), Segment(1, 'foo'));
    });
 
    it("if the specified depth is out of bounds, returns undefined", () => {
      let ident = Ident.parse("1#0:foo.1.2");
      assert.equal(ident.get(12), undefined);
    });
 
  });
  
  //--------------------------------------------------------------------------------

  describe("compare()", () => {
    
    it("when x is compared to itself, returns 0", () => {
      let x = Ident.parse("1#0:foo");
      assert.equal(x.compare(x), 0);
    });
    
    it("when x is identical to y, returns 0", () => {
      let x = Ident.parse("1#0:foo.1.2");
      let y = Ident.parse("1#0:foo.1.2");
      assert.equal(x.compare(y), 0);
    });
    
    it("when x and y are same depth, and x[0].digit < y[0].digit, returns -1", () => {
      let x = Ident.parse("1#1:foo");
      let y = Ident.parse("1#2:foo");
      assert.equal(x.compare(y), -1);
    });
    
    it("when x and y are same depth, and x[1].digit < y[1].digit, returns -1", () => {
      let x = Ident.parse("1#0:foo.1.2");
      let y = Ident.parse("1#0:foo.2.2");
      assert.equal(x.compare(y), -1);
    });
    
    it("when x and y are same depth, and x[0].digit > y[0].digit, returns 1", () => {
      let x = Ident.parse("1#2:foo");
      let y = Ident.parse("1#1:foo");
      assert.equal(x.compare(y), 1);
    });
    
    it("when x and y are same depth, and x[1].digit > y[1].digit, returns 1", () => {
      let x = Ident.parse("1#0:foo.2.2");
      let y = Ident.parse("1#0:foo.1.2");
      assert.equal(x.compare(y), 1);
    });
      
    it("when x = [1,3] and y = [1,2,3], returns 1", () => {
      let x = Ident.parse("1#1:foo.3");
      let y = Ident.parse("1#1:foo.2.3");
      assert.equal(x.compare(y), 1);
    });
    
    it("when x = [1,2,3] and y = [1,3], returns -1", () => {
      let x = Ident.parse("1#1:foo.2.3");
      let y = Ident.parse("1#1:foo.3");
      assert.equal(x.compare(y), -1);
    });    
    
    it("when x[0].time < y[0].time, returns -1", () => {
      let x = Ident.parse("1#1:foo");
      let y = Ident.parse("2#1:foo");
      assert.equal(x.compare(y), -1);
    });
    
    it("when x[0].time > y[0].time, returns 1", () => {
      let x = Ident.parse("2#1:foo");
      let y = Ident.parse("1#1:foo");
      assert.equal(x.compare(y), 1);
    });
    
    it("when x[0].site < y[0].site (lexicographically), returns -1", () => {
      let x = Ident.parse("1#1:bar");
      let y = Ident.parse("1#1:foo");
      assert.equal(x.compare(y), -1);
    });
    
    it("when x[0].site > y[0].site (lexicographically), returns 1", () => {
      let x = Ident.parse("1#1:foo");
      let y = Ident.parse("1#1:bar");
      assert.equal(x.compare(y), 1);
    });
    
    it("passes logoot example", () => {
      let x = Ident.parse("1#1:a");
      let y = Ident.parse("2#1:b");
      let z = Ident.parse("3#1:a.1:c");
      assert.equal(x.compare(y), -1);
      assert.equal(y.compare(z), 1);
    });
    
  });
  
  //--------------------------------------------------------------------------------

});