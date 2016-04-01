/// <reference path="../typings/main/ambient/mocha/index.d.ts" />
/// <reference path="../typings/main/ambient/chai/index.d.ts" />

import {Sequence, OpKind, InsertOp, RemoveOp, LSEQIdentGenerator} from '../src';
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
    
    describe("when the position is negative", () => {
      
      it("throws a RangeError", () => {
        let seq = new Sequence<string>("test");
        let func = () => {
          seq.insert('a', -1);
        };
        assert.throws(func, RangeError);
      });
      
    });
    
    it("returns a valid InsertOp for the operation", () => {
      let seq = new Sequence<string>("test");
      let op = seq.insert('a', 0);
      assert.equal(op.kind, OpKind.Insert);
      assert.equal(op.value, 'a');
    });
    
    it("can add an atom to the end of the sequence", () => {
      let seq = new Sequence<string>("test");
      seq.insert('a', 0);
      seq.insert('b', 1);
      assert.equal(seq.size(), 2);
      assert.equal(seq.get(0), 'a');
      assert.equal(seq.get(1), 'b');
    });
    
    it("can add an atom to the beginning of the sequence", () => {
      let seq = new Sequence<string>("test");
      seq.insert('a', 0);
      seq.insert('b', 1);
      seq.insert('c', 0);
      assert.equal(seq.size(), 3);
      assert.equal(seq.get(0), 'c');
      assert.equal(seq.get(1), 'a');
      assert.equal(seq.get(2), 'b');
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
  
  describe("remove()", () => {
    
    describe("when the position is negative", () => {
      
      it("throws a RangeError", () => {
        let seq = new Sequence<string>("test");
        let func = () => {
          seq.remove(-1);
        };
        assert.throws(func, RangeError);
      });
      
    });   
     
    describe("when the position is out of range", () => {
      
      it("returns null", () => {
        let seq = new Sequence<string>("test");
        let ret = seq.remove(100);
        assert.equal(ret, null);
      });
      
    });
    
    describe("when an atom exists at the position", () => {
      
      it("returns a valid RemoveOp for the operation", () => {
        let seq = new Sequence<string>("test");
        seq.insert('a', 0);
        assert.equal(seq.get(0), 'a');
        let op = seq.remove(0);
        assert.equal(op.kind, OpKind.Remove);
      });
      
      it("removes the atom at that position", () => {
        let seq = new Sequence<string>("test");
        seq.insert('a', 0);
        seq.insert('b', 1);
        seq.insert('c', 2);
        assert.equal(seq.size(), 3);
        seq.remove(1);
        assert.equal(seq.size(), 2);
        assert.equal(seq.get(1), 'c');
      });
      
    });
    
  });
  
  describe("apply()", () => {
    
    describe("when passed an InsertOp", () => {
      
      describe("when an atom with the specified ident already exists", () => {

        it("ignores the operation", () => {
          let seq = new Sequence<number>("test");
          let op1 = seq.insert(42, 0);
          assert.equal(seq.size(), 1);
          assert.equal(seq.get(0), 42);
          let op2 = new InsertOp(op1.id, 99);
          seq.apply(op2);
          assert.equal(seq.size(), 1);
        });
        
      });
      
      describe("when the specified atom does not exist", () => {
        
        it("adds the atom", () => {
          let seq1 = new Sequence<string>("alice");
          let seq2 = new Sequence<string>("bob");
          let op = seq1.insert('a', 0);
          seq2.apply(op);
          assert.equal(seq2.size(), 1);
          assert.equal(seq2.get(0), 'a');
        });
        
      });
      
    });
    
    describe("when passed a RemoveOp", () => {
      
      describe("when the specified atom does not exist", () => {
        
        it("ignores the operation", () => {
          let seq1 = new Sequence<string>("alice");
          let seq2 = new Sequence<string>("bob");
          seq1.insert('a', 0);
          seq2.insert('b', 0);
          let op = seq1.remove(0);
          assert.isNotNull(op);
          seq2.apply(op);
          assert.equal(seq2.size(), 1);
          assert.equal(seq2.get(0), 'b');
        });
        
      });
      
      describe("when the specified atom exists", () => {
        
        it("removes the atom", () => {
          let seq1 = new Sequence<number>("alice");
          let seq2 = new Sequence<number>("bob");
          let insertOp = seq1.insert(42, 0);
          seq2.apply(insertOp);
          assert.equal(seq1.size(), seq2.size());
          assert.equal(seq1.get(0), seq2.get(0));
          let removeOp = seq2.remove(0);
          seq1.apply(removeOp);
          assert.equal(seq1.size(), seq2.size());
          assert.equal(seq1.get(0), seq2.get(0));          
        });

      });
      
    });
    
  });
  
});