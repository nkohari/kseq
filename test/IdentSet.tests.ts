/// <reference path="../typings/main/ambient/chai/index.d.ts" />
/// <reference path="../typings/main/ambient/mocha/index.d.ts" />

import {IdentSet, Ident} from '../src/idents';
import {assert} from 'chai';

describe("IdentSet", () => {
  
  //--------------------------------------------------------------------------------
  
  describe("constructor()", () => {
    
    describe("with no iterable", () => {
      
      it("returns an empty IdentSet", () => {
        let set = new IdentSet();
        assert.instanceOf(set, IdentSet);
        assert.equal(set.size(), 0);
      });
      
    });
    
    describe("with an iterable of Idents", () => {

      it("returns an IdentSet populated with the idents", () => {
        let set = new IdentSet([Ident.parse("1#0.foo"), Ident.parse("2#1.foo")]);
        assert.instanceOf(set, IdentSet);
        assert.equal(set.size(), 2);
        assert.isTrue(set.has("1#0.foo"));
        assert.isTrue(set.has("2#1.foo"));
      });
      
    });
    
    describe("with an iterable of serialized Idents", () => {

      it("returns an IdentSet populated with the idents", () => {
        let set = new IdentSet(["1#0.foo", "2#1.foo"]);
        assert.instanceOf(set, IdentSet);
        assert.equal(set.size(), 2);
        assert.isTrue(set.has("1#0.foo"));
        assert.isTrue(set.has("2#1.foo"));
      });      
    });
    
  });

  //--------------------------------------------------------------------------------
  
  describe("size()", () => {
    
    it("returns the number of entries in the set", () => {
      let set = new IdentSet(["1#0.foo", "2#1.foo", "3#2.foo"]);
      assert.equal(set.size(), 3);
    })
    
  });
  
  //--------------------------------------------------------------------------------
  
  describe("add()", () => {
    
    describe("when passed an Ident", () => {
      
      describe("when the ident is not already in the set", () => {
        
        it("adds the ident to the set", () => {
          let set = new IdentSet();
          set.add(Ident.parse("1#0.foo"));
          assert.equal(set.size(), 1);
          assert.isTrue(set.has("1#0.foo"));
        });
        
      });
      
      describe("when the ident is already in the set", () => {
        
        it("does not alter the set", () => {
          let set = new IdentSet(["1#0.foo"]);
          set.add(Ident.parse("1#0.foo"));
          assert.equal(set.size(), 1);
        });
        
      });
      
    });
    
    describe("when passed a serialized ident", () => {
      
      describe("when the ident is not already in the set", () => {
        
        it("adds the ident to the set", () => {
          let set = new IdentSet();
          set.add("1#0.foo");
          assert.equal(set.size(), 1);
          assert.isTrue(set.has("1#0.foo"));
        });
        
      });
      
      describe("when the ident is already in the set", () => {
        
        it("does not alter the set", () => {
          let set = new IdentSet(["1#0.foo"]);
          set.add("1#0.foo");
          assert.equal(set.size(), 1);
        });
        
      });
      
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("has()", () => {
    
    describe("when passed an Ident", () => {
      
      describe("when the ident is in the set", () => {
        
        it("returns true", () => {
          let set = new IdentSet(["1#0.foo"]);
          let ident = Ident.parse("1#0.foo");
          assert.isTrue(set.has(ident));
        });
        
      });
      
      describe("when the ident is not in the set", () => {

        it("returns false", () => {
          let set = new IdentSet();
          let ident = Ident.parse("1#0.foo");
          assert.isFalse(set.has(ident));
        });
        
      });
      
    });
    
    describe("when passed serialized ident", () => {
      
      describe("when the ident is in the set", () => {
        
        it("returns true", () => {
          let set = new IdentSet(["1#0.foo"]);
          assert.isTrue(set.has("1#0.foo"));
        });
        
      });
      
      describe("when the ident is not in the set", () => {

        it("returns false", () => {
          let set = new IdentSet();
          assert.isFalse(set.has("1#0.foo"));
        });
        
      });
      
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("remove()", () => {
    
    describe("when passed an Ident", () => {

      describe("when the ident is in the set", () => {
        
        it("removes the ident", () => {
          let set = new IdentSet(["1#0.foo"]);
          let ident = Ident.parse("1#0.foo");
          assert.isTrue(set.has(ident));
          set.remove(ident);
          assert.isFalse(set.has(ident));
        });
        
      });
      
      describe("when the ident is not in the set", () => {

        it("does not alter the set", () => {
          let set = new IdentSet(["1#0.foo"]);
          let ident = Ident.parse("2#1.foo");
          assert.equal(set.size(), 1);
          assert.isFalse(set.has(ident));
          set.remove(ident);
          assert.equal(set.size(), 1);
        });
        
      });
      
    });
    
    describe("when passed a serialized ident", () => {

      describe("when the ident is in the set", () => {
        
        it("removes the ident", () => {
          let set = new IdentSet(["1#0.foo"]);
          assert.isTrue(set.has("1#0.foo"));
          set.remove("1#0.foo");
          assert.isFalse(set.has("1#0.foo"));
        });
        
      });
      
      describe("when the ident is not in the set", () => {

        it("does not alter the set", () => {
          let set = new IdentSet(["1#0.foo"]);
          assert.equal(set.size(), 1);
          assert.isFalse(set.has("2#1.foo"));
          set.remove("2#1.foo");
          assert.equal(set.size(), 1);
        });
        
      });
      
    });
    
  });

  //--------------------------------------------------------------------------------

});
