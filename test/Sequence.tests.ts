/// <reference path="../typings/main/ambient/mocha/index.d.ts" />
/// <reference path="../typings/main/ambient/chai/index.d.ts" />

import {Sequence, OpKind} from '../src';
import {assert} from 'chai';

describe("Sequence", () => {
  
  describe("constructor()", () => {
    
    it("returns a Sequence instance", () => {
      let seq = new Sequence<string>("test");
      assert.isNotNull(seq);
    });
    
    it("assigns the replica id to the Sequence instance", () => {
      let name = Math.floor(Math.random() * 100000).toString();
      let seq = new Sequence<string>(name);
      assert.equal(name, seq.replica);
    });
    
  });
  
  describe("insert()", () => {
    
    it("returns a valid InsertOp for the operation", () => {
      let seq = new Sequence<string>("test");
      let op = seq.insert("line one", 0);
      assert.equal(op.kind, OpKind.Insert);
      assert.equal(op.value, "line one");
    });
    
    it("can add an atom to the end of the sequence", () => {
      let seq = new Sequence<string>("test");
      seq.insert("line one", 0);
      seq.insert("line two", 1);
      assert.equal(seq.size(), 2);
      assert.equal(seq.get(0), "line one");
      assert.equal(seq.get(1), "line two");
    });
    
    it("can add an atom to the beginning of the sequence", () => {
      let seq = new Sequence<string>("test");
      seq.insert("line one", 0);
      seq.insert("line two", 1);
      seq.insert("line three", 0);
      assert.equal(seq.size(), 3);
      assert.equal(seq.get(0), "line three");
      assert.equal(seq.get(1), "line one");
      assert.equal(seq.get(2), "line two");
    });
    
    it("can add 1000 items at the end", () => {
      let seq = new Sequence<number>("test");
      for (let i = 1; i <= 1000; i++) {
        seq.insert(i, seq.size());
      }
      assert.equal(seq.size(), 1000);
      assert.equal(seq.get(seq.size() - 1), 1000);
    });
    
    it("can add 1000 items at the beginning", () => {
      let seq = new Sequence<number>("test");
      for (let i = 1; i <= 1000; i++) {
        seq.insert(i, 0);
      }
      assert.equal(seq.size(), 1000);
      assert.equal(seq.get(0), 1000);
    });
    
  });
  
});