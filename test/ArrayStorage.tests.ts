/// <reference path="../typings/main/ambient/mocha/index.d.ts" />
/// <reference path="../typings/main/ambient/chai/index.d.ts" />

import {ArrayStorage} from '../src/storage';
import {Ident, Segment} from '../src/idents';
import {assert} from 'chai';

describe("ArrayStorage", () => {
  
  describe("constructor()", () => {
    
    it("returns an ArrayStorage instance", () => {
      let storage = new ArrayStorage<string>();
      assert.instanceOf(storage, ArrayStorage);
    });
    
  });
  
  describe("indexOf()", () => {
    
    it("compares idents by value, not identity", () => {
      let storage = new ArrayStorage<string>();
      storage.add(new Ident(0, [Segment(0, 'foo')]), 'line one');
      let ident = new Ident(0, [Segment(0, 'foo')]);
      assert.equal(storage.indexOf(ident), 0);
    });
        
    describe("when the ident doesn't exist in the list", () => {
      
      it("returns -1", () => {
        let storage = new ArrayStorage<string>();
        let x = new Ident(0, [Segment(0, 'foo')]);
        let y = new Ident(0, [Segment(1, 'foo')]);
        storage.add(x, 'line one');
        assert.equal(storage.indexOf(y), -1);
      });
      
    });
    
    describe("when the ident exists in the list", () => {

      it("returns the position of the atom with the ident", () => {
        let storage = new ArrayStorage<string>();
        let x = new Ident(0, [Segment(0, 'foo')]);
        let y = new Ident(0, [Segment(0, 'bar')]);
        let z = new Ident(0, [Segment(0, 'zap')]);
        storage.add(x, 'line one');
        storage.add(y, 'line two');
        storage.add(z, 'line three');
        assert.equal(storage.indexOf(x), 1);
      });
      
    });
    
  });
  
  describe("add()", () => {
    
    describe("when the ident doesn't already exist in the list", () => {
      
      it("adds a new atom", () => {
        let storage = new ArrayStorage<string>();
        let ident = new Ident(0, [Segment(0, 'foo')]);
        let value = 'line one'
        storage.add(ident, value);
        let atom = storage.get(0);
        assert.equal(atom.id.compare(ident), 0);
        assert.equal(atom.value, value);
      });
      
      it("returns the insert position", () => {
        let storage = new ArrayStorage<string>();
        let ident = new Ident(0, [Segment(0, 'foo')]);
        let ret = storage.add(ident, 'line one');
        assert.equal(ret, 0);
      });
      
    });
    
    describe("when the ident already exists in the list", () => {

      it("does not add an atom", () => {
        let storage = new ArrayStorage<string>();
        let x = new Ident(0, [Segment(0, 'foo')]);
        let y = new Ident(0, [Segment(0, 'foo')]);
        storage.add(x, 'line one');
        storage.add(y, 'line two');
        assert.equal(storage.size(), 1);
        assert.equal(storage.get(0).value, 'line one');
      });

      it("returns -1", () => {
        let storage = new ArrayStorage<string>();
        let x = new Ident(0, [Segment(0, 'foo')]);
        let y = new Ident(0, [Segment(0, 'foo')]);
        storage.add(x, 'line one');
        let ret = storage.add(y, 'line two');
        assert.equal(ret, -1);
      });
      
    });
      
  });
  
  describe("remove()", () => {
    
    describe("when the ident exists in the list", () => {

      it("removes the atom with the ident", () => {
        let storage = new ArrayStorage<string>();
        let ident = new Ident(0, [Segment(0, 'foo')]);
        storage.add(ident, 'line one');
        assert.equal(storage.size(), 1);
        storage.remove(ident);
        assert.equal(storage.size(), 0);
      });
      
      it("returns the position that the atom occupied", () => {
        let storage = new ArrayStorage<string>();
        let ident = new Ident(0, [Segment(0, 'foo')]);
        storage.add(ident, 'line one');
        let pos = storage.remove(ident);
        assert.equal(pos, 0);
      });
      
    });
    
    describe("when the ident doesn't exist in the list", () => {

      it("returns -1", () => {
        let storage = new ArrayStorage<string>();
        let ident = new Ident(0, [Segment(0, 'foo')]);
        let pos = storage.remove(ident);
        assert.equal(pos, -1);
      });
      
    });
    
  });
  
  describe("forEach()", () => {
    
    it("applies the function to each atom in the list", () => {
      let storage = new ArrayStorage<string>();
      let x = new Ident(0, [Segment(0, 'foo')]);
      let y = new Ident(1, [Segment(1, 'foo')]);
      storage.add(x, 'line one');
      storage.add(y, 'line two');
      let calls = [];
      storage.forEach((atom) => calls.push(atom.value));
      assert.deepEqual(calls, ['line one', 'line two']);
    });
    
  });
    
  describe("map()", () => {
    
    it("applies the function to each atom in the list", () => {
      let storage = new ArrayStorage<string>();
      let x = new Ident(0, [Segment(0, 'foo')]);
      let y = new Ident(1, [Segment(1, 'foo')]);
      storage.add(x, 'line one');
      storage.add(y, 'line two');
      let values = storage.map((atom) => atom.value);
      assert.deepEqual(values, ['line one', 'line two']);
    });
    
  });
  
  describe("toArray()", () => {
    
    it("returns an array of atoms in the list", () => {
      let storage = new ArrayStorage<string>();
      let x = new Ident(0, [Segment(0, 'foo')]);
      let y = new Ident(1, [Segment(1, 'foo')]);
      storage.add(x, 'line one');
      storage.add(y, 'line two');
      let atoms = storage.toArray();
      let values = atoms.map((atom) => atom.value);
      assert.deepEqual(values, ['line one', 'line two']);
    });
    
  });
    
});