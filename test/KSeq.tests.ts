/// <reference path="../typings/main/ambient/chai/index.d.ts" />
/// <reference path="../typings/main/ambient/mocha/index.d.ts" />

import {KSeq, OpKind, InsertOp, RemoveOp} from '../src';
import {Ident} from '../src/idents';
import {assert} from 'chai';

function getWallTime(): number {
  return Math.floor(new Date().valueOf() / 1000);
}

describe("KSeq", () => {
  
  //--------------------------------------------------------------------------------

  describe("constructor()", () => {
    
    it("returns a KSeq instance", () => {
      let seq = new KSeq<string>("test");
      assert.isNotNull(seq);
    });
    
    it("assigns the replica id to the KSeq instance", () => {
      let name = Math.floor(Math.random() * 100000).toString();
      let seq = new KSeq<string>(name);
      assert.equal(name, seq.name);
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("insert()", () => {
    
    describe("when the position is negative", () => {
      
      it("throws a RangeError", () => {
        let seq = new KSeq<string>("test");
        let func = () => {
          seq.insert('a', -1);
        };
        assert.throws(func, RangeError);
      });
      
    });
    
    it("returns a valid InsertOp for the operation", () => {
      let seq = new KSeq<string>("test");
      let op = seq.insert('a', 0);
      assert.equal(op.kind, OpKind.Insert);
      assert.equal(op.value, 'a');
    });
    
    it("can add an atom to the end of the sequence", () => {
      let seq = new KSeq<string>("test");
      seq.insert('a', 0);
      seq.insert('b', 1);
      assert.equal(seq.size(), 2);
      assert.equal(seq.get(0), 'a');
      assert.equal(seq.get(1), 'b');
    });
    
    it("can add an atom to the beginning of the sequence", () => {
      let seq = new KSeq<string>("test");
      seq.insert('a', 0);
      seq.insert('b', 1);
      seq.insert('c', 0);
      assert.equal(seq.size(), 3);
      assert.equal(seq.get(0), 'c');
      assert.equal(seq.get(1), 'a');
      assert.equal(seq.get(2), 'b');
    });
    
    it("can add 1000 items at the end", () => {
      let seq = new KSeq<number>("test");
      for (let i = 1; i <= 1000; i++) {
        seq.insert(i, seq.size());
      }
      assert.equal(seq.size(), 1000);
      assert.equal(seq.get(seq.size() - 1), 1000);
    });
    
    it("can add 1000 items at the beginning", () => {
      let seq = new KSeq<number>("test");
      for (let i = 1; i <= 1000; i++) {
        seq.insert(i, 0);
      }
      assert.equal(seq.size(), 1000);
      assert.equal(seq.get(0), 1000);
    });
    
  });
  
  //--------------------------------------------------------------------------------

  describe("remove()", () => {
    
    describe("when the position is negative", () => {
      
      it("throws a RangeError", () => {
        let seq = new KSeq<string>("test");
        let func = () => {
          seq.remove(-1);
        };
        assert.throws(func, RangeError);
      });
      
    });   
     
    describe("when the position is out of range", () => {
      
      it("returns null", () => {
        let seq = new KSeq<string>("test");
        let ret = seq.remove(100);
        assert.equal(ret, null);
      });
      
    });
    
    describe("when an atom exists at the position", () => {
      
      it("returns a valid RemoveOp for the operation", () => {
        let seq = new KSeq<string>("test");
        seq.insert('a', 0);
        assert.equal(seq.get(0), 'a');
        let op = seq.remove(0);
        assert.equal(op.kind, OpKind.Remove);
      });
      
      it("removes the atom at that position", () => {
        let seq = new KSeq<string>("test");
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
  
  //--------------------------------------------------------------------------------

  describe("apply()", () => {
    
    describe("when passed an InsertOp", () => {
      
      describe("when the specified atom does not exist", () => {
        
        it("adds the atom", () => {
          let seq1 = new KSeq<string>("alice");
          let seq2 = new KSeq<string>("bob");
          let op = seq1.insert('a', 0);
          seq2.apply(op);
          assert.equal(seq2.size(), 1);
          assert.equal(seq2.get(0), 'a');
        });
        
      });
      
      describe("when an atom with the specified ident already exists", () => {

        it("ignores the operation", () => {
          let seq = new KSeq<number>("test");
          let op1 = seq.insert(42, 0);
          assert.equal(seq.size(), 1);
          assert.equal(seq.get(0), 42);
          let op2 = new InsertOp("test", getWallTime(), op1.id, 99);
          seq.apply(op2);
          assert.equal(seq.size(), 1);
        });
        
      });
      
      describe("when an atom with the specified ident has already been removed", () => {

        it("ignores the operation", () => {
          let seq = new KSeq<number>("test");
          let op1 = seq.append(42);
          seq.append(99);
          seq.remove(0);
          assert.equal(seq.size(), 1);
          let op2 = new InsertOp("test", getWallTime(), op1.id, 123);
          seq.apply(op2);
          assert.equal(seq.size(), 1);
        });
        
      });
      
    });
    
    describe("when passed a RemoveOp", () => {
      
      describe("when the specified atom does not exist", () => {
        
        it("ignores the operation", () => {
          let seq1 = new KSeq<string>("alice");
          let seq2 = new KSeq<string>("bob");
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
          let seq1 = new KSeq<number>("alice");
          let seq2 = new KSeq<number>("bob");
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
      
      describe("when an atom with the specified ident has already been removed", () => {

        it("ignores the operation", () => {
          let seq = new KSeq<number>("test");
          let op1 = seq.append(42);
          seq.append(99);
          seq.remove(0);
          assert.equal(seq.size(), 1);
          let op2 = new RemoveOp("test", getWallTime(), op1.id);
          seq.apply(op2);
          assert.equal(seq.size(), 1);
        });
        
      });
            
    });
    
  });
  
  //--------------------------------------------------------------------------------
  
  describe("is a CRDT", () => {
    
    it("supports insert/remove (base case)", () => {
      let seq = new KSeq<string>("alice");
      seq.append("test");
      assert.equal(seq.size(), 1);
      let ident = Ident.parse("1#0.bob");
      let op1 = new InsertOp("bob", getWallTime(), ident, "hello");
      let op2 = new RemoveOp("bob", getWallTime(), ident);
      seq.apply(op1);
      assert.equal(seq.size(), 2);
      seq.apply(op2);
      assert.equal(seq.size(), 1);
    });
    
    it("idempotence: supports insert/insert (message duplication)", () => {
      let seq = new KSeq<string>("alice");
      seq.append("test");
      assert.equal(seq.size(), 1);
      let ident = Ident.parse("1#0.bob");
      let op = new InsertOp("bob", getWallTime(), ident, "hello");
      seq.apply(op);
      assert.equal(seq.size(), 2);
      seq.apply(op);
      assert.equal(seq.size(), 2);
    });
    
    it("idempotence: supports remove/remove (message duplication)", () => {
      let seq = new KSeq<string>("alice");
      seq.append("test");
      assert.equal(seq.size(), 1);
      let ident = Ident.parse("1#0.bob");
      let op1 = new InsertOp("bob", getWallTime(), ident, "hello");
      let op2 = new RemoveOp("bob", getWallTime(), ident);
      seq.apply(op1);
      assert.equal(seq.size(), 2);
      seq.apply(op2);
      assert.equal(seq.size(), 1);
      seq.apply(op2);
      assert.equal(seq.size(), 1);
    });
    
    it("commutative: supports remove/insert (messages out of order)", () => {
      let seq = new KSeq<string>("alice");
      seq.append("test");
      assert.equal(seq.size(), 1);
      let ident = Ident.parse("1#0.bob");
      let op1 = new InsertOp("bob", getWallTime(), ident, "hello");
      let op2 = new RemoveOp("bob", getWallTime(), ident);
      seq.apply(op2);
      assert.equal(seq.size(), 1);
      seq.apply(op1);
      assert.equal(seq.size(), 1);
    });
    
  });
  
  //--------------------------------------------------------------------------------
  
});