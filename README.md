oid
===

This Node module provides a simple utility for object identity hashing
and two related classes. This can be useful any time you need to do
triple-equals (`===`) style comparisons across arbitrary numbers of
objects. Instead of doing an O(N^2) set of comparisons, you can
instead get the identity hash of the things you want to compare, and
use those in clever ways to whittle down the required comparisons,
often allowing O(1) implementations.


Installing
----------

```shell
npm install oid
```

Or grab the source and

```shell
node-waf configure build
```

Testing
-------

```shell
node ./test/test.js
```

Usage
-----

This library provides one regular function and two constructors.

Top-Level Functions
-------------------

### oid.hash(value)

Return an identity hash of the given value or object. The return value
from two calls to this function are guaranteed to be the same when
given the same input, where "same" is the relationship defined by the
triple-equals (`===`) operator of JavaScript.

The return value is furthermore guaranteed to be a positive
(non-negative and non-zero) integer value.

The return value is *never* guaranteed to be unique across multiple
values. That is, there are many pairs of values or objects that are
not the same but which *do* have the same identity hash. Somewhat
more mathematically: `hash(x) !== hash(y)` implies that `x !== y`, but
`hash(x) === hash(y)` does not imply that `x === y`.

For normal objects (including arrays, functions, and regular
expressions), this returns an arbitrary internally-generated id
number.

For strings, this returns a hash based on the characters contained in
the string. The algorithm used is similar to (but not quite identical
to) that used by `String.hashCode()` in Java.

For numbers, this returns a hash based on the numeric value. More specifically,
it is produced by inspecting the underlying byte representation of the
value. As such, it is not guaranteed to be stable across different
implementations of JavaScript.

For booleans, null, and the undefined value, this returns a particular
predefined value (different for each), which are all prime numbers
representable with five digits in base ten.

Identity Maps
-------------

### idmap = oid.createMap()

This constructs a map (key-value association), where the keys are
arbitrary objects or values, compared by identity.

### idmap.get(key, ifNotFound)

Get the value associated with the given key. If there is no mapping
for the key, return the `ifNotFound` argument (which defaults to
undefined).

### idmap.set(key, value, ifNotFound)

Set the value associated with the given key to the given value, and
return the previously associated value. If there was no previous
mapping for the key, return the ifNotFound argument (which defaults to
undefined).

### idmap.has(key)

Return `true` if there is a mapping for the given key or `false`
if not.

### idmap.remove(key, ifNotFound)

Remove the mapping for the given key, returning its formerly
associated value or the ifNotFound value if the key wasn't formerly
mapped.

Identity Sets
-------------

### idset = oid.createSet()

This constructs a set (unordered list of objects and/or values),
where set membership is determined by identity comparison.

### idset.has(value)

Return `true` if there the given value is in the set or `false` if not.

### idset.add(value)

Add the given value to the set. Returns `true` if this operation
actually changed the set (that is, `true` if the item wasn't already
in the set).

### idset.remove(value)

Remove the given value from the set. Returns `true` if this operation
actually changed the set (that is, `true` if the item in fact was in
the set to begin with).


Contributing
------------

Questions, comments, bug reports, and pull requests are all welcome.
Submit them at [the project on GitHub](https://github.com/Obvious/oid/).

Bug reports that include steps-to-reproduce (including code) are the
best. Even better, make them in the form of pull requests that update
the test suite. Thanks!

Author
------

[Dan Bornstein](https://github.com/danfuzz)
([personal website](http://www.milk.com/)), supported by
[The Obvious Corporation](http://obvious.com/).

License
-------

Copyright 2012 [The Obvious Corporation](http://obvious.com/).

Licensed under the Apache License, Version 2.0. 
See the top-level file `LICENSE.txt` and
(http://www.apache.org/licenses/LICENSE-2.0).
