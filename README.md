# KSeq

KSeq is an implementation of a simple CRDT (conflict-free replicated data type) that represents
an ordered sequence of items. Designed for use in collaborative editors, it allows various
contributors to concurrently alter the sequence, while preserving both data and intent.

**Note**: This is still a work in progress, and has not yet been deployed in any real-world system.

# Overview

CRDTs are data types on which the same set of operations yields the same state, regardless
of whether the operations are duplicated or received out of order. This means that the
state of multiple replicas will (eventually) converge without the need for consensus between
the replicas. To achieve this, all operations of a CRDT must be:

- *Associative*: `A + (B + C) = (A + B) + C`, that is, grouping of operations doesn't matter.
- *Commutative*: `A + B = B + A`, that is, the order of execution doesn't matter.
- *Idempotent*: `A + A = A`, that is, the duplication of operations doesn't matter.

CRDTs are related to [Operational Transformation](https://en.wikipedia.org/wiki/Operational_transformation) (OT),
which was popularized by Apache (then Google) Wave in 2009. However, OT requires comparatively
complex semantics to transform operations to ensure their commutativity.

Further, for a system to be usable in a collaborative editing system, it must satisfy the
CCI criteria [1]:

- *Causality*: Operations must be executed in the same order on every replica.
- *Convergence*: The state of every replica becomes identical when the system is at rest.
- *Intention*: The expected effect of an operation must be observed on all replicas.

KSeq satisfies the requirements of a CRDT, as well as the CCI criteria. (Actually, while KSeq
does *not* guarantee the causal execution of operations, it does guarantee that the state
will be altered in a way such that it *appears* that the operations were executed in causal order.)

# Approach

KSeq is an operations-based, continuous sequence CRDT [2] based on the Logoot [3]
and LSEQ [4] systems. However, these structures make the assumption of causal delivery of messages,
either limiting their application or requiring an external system to enforce this guarantee.

KSeq combines the *identifier tree* approach used by LSEQ/Logoot with an additional G-Set
to track removal of items, thus eliminating the need for causal delivery at the cost of
storage overhead. (This technique is similar to that used in 2P-Set, but KSeq also provides
a guarantee that the items inserted will be ordered.)

Therefore, a KSeq is a façade over two internal sets:

1. An ordered set **S** of *atoms* representing the values currently contained in the KSeq.
   Each atom is a `[id, value]` tuple, and the set is ordered by the ids.
2. An unordered set **R**, which contains the ids of all atoms that have been removed
   from the KSeq.
   
KSeq supports two basic operations, *insert*, and *remove*. The application of these operations is simple:

```
function insert(id, value) {
  if !R.has(id) then S.add([id, value])
}
  
function remove(id) {
  S.remove(id)
  R.add(id)
}
```

Rather than require consumers to interact with the generation of ids, KSeq exposes a position-based
API similar to a regular array, while adding convenience functions that implement special-cases of
the *insert* and *remove* operations.

For example:

```ts
let list = new KSeq<string>();
list.append('a');
list.insert('b', 0);
list.append('c');
list.remove(1);
assert(list.size() == 2);
assert(list.get(0) == 'b');
assert(list.get(1) == 'c');
```

However, it also returns operations that may be applied to other KSeqs to achieve convergent state:

```ts
let alice = new KSeq<string>('alice');
let bob = new KSeq<string>('bob');
let op1 = alice.append('h');
let op2 = alice.append('i');
// Note that these operations may be applied out of order.
bob.apply(op2);
bob.apply(op1);
assert(bob.get(0) == 'h');
assert(bob.get(1) == 'i');
```

These operations would generally be serialized and passed over a network to a remote machine that housed
its own replica.

# Limitations

While KSeq is tolerant to message loss and incorrect delivery, in order for the state of all replicas
to converge, all operations *must eventually be applied* to all replicas. This is a limitation of
operations-based CRDTs, and is probably best solved through read-repair.

Currently, KSeq is implemented with a rudimentary id generation system using simple JS `Number`s.
This is memory-intensive, and may benefit from an dense bitfield implementation as described in [4].
However, further testing is needed, since the cost of conversion between strings and bitfields
may outweigh the improved memory usage.

As a KSeq is edited, newly-generated identifiers will become longer, and the cardinality of **R** will
continue to grow. This means that the performance of the KSeq will gradually degrade over time. This
could be solved by a garbage collection routine that would remove very old items from **R**, but this
would require at best a heuristic (eg. remove all items older than some wall time) or at worst,
a consensus-based algorithm.

# Further Reading

1. [Achieving Convergence, Causality-Preservation, and Intention-Preservation in Real-Time Cooperative Editing Systems](http://diyhpl.us/~bryan/papers2/distributed/distributed-systems/real-time-cooperative-editing-systems.1998.pdf), Sun et. al. 1998
2. [A Comprehensive Study of Convergent and Commutative Replicated Data Types](http://hal.upmc.fr/inria-00555588/document), Shapiro et. al. 2011
3. [Logoot: A Scalable Optimistic Replication Algorithm for Collaborative Editing on P2P Networks](https://hal.archives-ouvertes.fr/inria-00432368/document), Weiss et. al. 2009
4. [LSEQ: an Adaptive Structure for Sequences in Distributed Collaborative Editing](http://hal.univ-nantes.fr/file/index/docid/921633/filename/fp025-nedelec.pdf), Nédelec, et. al. 2013
