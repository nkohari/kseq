/// <reference path="../typings/main/ambient/mocha/index.d.ts" />
/// <reference path="../typings/main/ambient/chai/index.d.ts" />

import {ArrayStorage} from '../src/ArrayStorage';
import {Ident, Segment} from '../src/Ident';
import {assert} from 'chai';

describe("ArrayStorage", () => {
  
  describe("constructor()", () => {
    
    it("returns an ArrayStorage instance", () => {
      let storage = new ArrayStorage<string>();
      assert.instanceOf(storage, ArrayStorage);
    });
    
  });
  
  describe("indexOf()", () => {
    
    it("when no atom with the ident exists, returns -1", () => {
      let storage = new ArrayStorage<string>();
      let x = new Ident(0, [Segment(0, 'foo')]);
      let y = new Ident(0, [Segment(1, 'foo')]);
      storage.add(x, 'line one');
      assert.equal(storage.indexOf(y), -1);
    });
    
    it("when an atom with the ident exists, returns the position", () => {
      let storage = new ArrayStorage<string>();
      let x = new Ident(0, [Segment(0, 'foo')]);
      let y = new Ident(0, [Segment(0, 'bar')]);
      let z = new Ident(0, [Segment(0, 'zap')]);
      storage.add(x, 'line one');
      storage.add(y, 'line two');
      storage.add(z, 'line three');
      assert.equal(storage.indexOf(x), 1);
    });
    
    it("idents are compared by value, not identity", () => {
      let storage = new ArrayStorage<string>();
      storage.add(new Ident(0, [Segment(0, 'foo')]), 'line one');
      storage.add(new Ident(0, [Segment(2, 'foo')]), 'line two');
      storage.add(new Ident(0, [Segment(1, 'foo')]), 'line three');
      let ident = new Ident(0, [Segment(1, 'foo')]);
      assert.equal(storage.indexOf(ident), 1);
    });
    
  });
  
  describe("add()", () => {

    it("adds the item to the storage", () => {
      let storage = new ArrayStorage<string>();
      let ident = new Ident(0, [Segment(0, 'foo')]);
      let value = 'line one'
      storage.add(ident, value);
      let atom = storage.get(0);
      assert.equal(atom.value, value);
    });
      
  });
  
});