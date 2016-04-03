/// <reference path="../typings/main/ambient/mocha/index.d.ts" />
/// <reference path="../typings/main/ambient/chai/index.d.ts" />

import {ArrayAtomList} from '../src/storage';
import {Ident, Segment} from '../src/idents';
import {assert} from 'chai';

describe("ArrayAtomList", () => {
  
  //--------------------------------------------------------------------------------

  describe("constructor()", () => {
    
    it("returns an ArrayAtomList instance", () => {
      let list = new ArrayAtomList<string>();
      assert.instanceOf(list, ArrayAtomList);
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("indexOf()", () => {
    
    it("compares idents by value, not identity", () => {
      let list = new ArrayAtomList<string>();
      list.add(Ident.parse("1#0.foo"), 'line one');
      let ident = Ident.parse("1#0.foo");
      assert.equal(list.indexOf(ident), 0);
    });
        
    describe("when the ident doesn't exist in the list", () => {
      
      it("returns -1", () => {
        let list = new ArrayAtomList<string>();
        let x = Ident.parse("1#0.foo");
        let y = Ident.parse("1#1.foo");
        list.add(x, 'line one');
        assert.equal(list.indexOf(y), -1);
      });
      
    });
    
    describe("when the ident exists in the list", () => {

      it("returns the position of the atom with the ident", () => {
        let list = new ArrayAtomList<string>();
        let x = Ident.parse("1#0.foo");
        let y = Ident.parse("1#0.bar");
        let z = Ident.parse("1#0.zap");
        list.add(x, 'line one');
        list.add(y, 'line two');
        list.add(z, 'line three');
        assert.equal(list.indexOf(x), 1);
      });
      
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("add()", () => {
    
    describe("when the ident doesn't already exist in the list", () => {
      
      it("adds a new atom", () => {
        let list = new ArrayAtomList<string>();
        let ident = Ident.parse("1#0.foo");
        let value = 'line one'
        list.add(ident, value);
        let atom = list.get(0);
        assert.equal(atom.id.compare(ident), 0);
        assert.equal(atom.value, value);
      });
      
      it("returns the insert position", () => {
        let list = new ArrayAtomList<string>();
        let ident = Ident.parse("1#0.foo");
        let ret = list.add(ident, 'line one');
        assert.equal(ret, 0);
      });
      
    });
    
    describe("when the ident already exists in the list", () => {

      it("does not add an atom", () => {
        let list = new ArrayAtomList<string>();
        let x = Ident.parse("1#0.foo");
        let y = Ident.parse("1#0.foo");
        list.add(x, 'line one');
        list.add(y, 'line two');
        assert.equal(list.size(), 1);
        assert.equal(list.get(0).value, 'line one');
      });

      it("returns -1", () => {
        let list = new ArrayAtomList<string>();
        let x = Ident.parse("1#0.foo");
        let y = Ident.parse("1#0.foo");
        list.add(x, 'line one');
        let ret = list.add(y, 'line two');
        assert.equal(ret, -1);
      });
      
    });
      
  });
  
  //--------------------------------------------------------------------------------

  describe("remove()", () => {
    
    describe("when the ident exists in the list", () => {

      it("removes the atom with the ident", () => {
        let list = new ArrayAtomList<string>();
        let ident = Ident.parse("1#0.foo");
        list.add(ident, 'line one');
        assert.equal(list.size(), 1);
        list.remove(ident);
        assert.equal(list.size(), 0);
      });
      
      it("returns the position that the atom occupied", () => {
        let list = new ArrayAtomList<string>();
        let ident = Ident.parse("1#0.foo");
        list.add(ident, 'line one');
        let pos = list.remove(ident);
        assert.equal(pos, 0);
      });
      
    });
    
    describe("when the ident doesn't exist in the list", () => {

      it("returns -1", () => {
        let list = new ArrayAtomList<string>();
        let ident = Ident.parse("1#0.foo");
        let pos = list.remove(ident);
        assert.equal(pos, -1);
      });
      
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("forEach()", () => {
    
    it("applies the function to each atom in the list", () => {
      let list = new ArrayAtomList<string>();
      let x = Ident.parse("1#0.foo");
      let y = Ident.parse("1#1.foo");
      list.add(x, 'line one');
      list.add(y, 'line two');
      let calls = [];
      list.forEach((atom) => calls.push(atom.value));
      assert.deepEqual(calls, ['line one', 'line two']);
    });
    
  });
    
  //--------------------------------------------------------------------------------

  describe("map()", () => {
    
    it("applies the function to each atom in the list", () => {
      let list = new ArrayAtomList<string>();
      let x = Ident.parse("1#0.foo");
      let y = Ident.parse("1#1.foo");
      list.add(x, 'line one');
      list.add(y, 'line two');
      let values = list.map((atom) => atom.value);
      assert.deepEqual(values, ['line one', 'line two']);
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("toArray()", () => {
    
    it("returns an array of atoms in the list", () => {
      let list = new ArrayAtomList<string>();
      let x = Ident.parse("1#0.foo");
      let y = Ident.parse("1#1.foo");
      list.add(x, 'line one');
      list.add(y, 'line two');
      let atoms = list.toArray();
      let values = atoms.map((atom) => atom.value);
      assert.deepEqual(values, ['line one', 'line two']);
    });
    
  });
   
  //--------------------------------------------------------------------------------
    
});