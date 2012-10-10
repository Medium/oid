oid
===

This Node module provides a simple utility for object identity hashing
and two related classes. This can be useful any time you need to do
triple-equals (`===`) style comparisons across arbitrary numbers of
objects. Instead of doing an O(N^2) set of comparisons, you can
instead get the identity hashes of the things you want to compare, and
use those in clever ways to whittle down the required comparisons,
often allowing O(1) implementations.


Building and Installing
-----------------------

```shell
npm install oid
```

Or grab the source and

```shell
node-waf configure build
```

**Note**: This module contains native code, and so you will have
to have a C compiler available. Consult your OS documentation for
details on setting that up.


Testing
-------

```shell
npm test
```

Or

```shell
node ./test/test.js
```

Example
-------

This example (also available in the example directory) deduplicates
the elements of an array in O(N) time (instead of O(N^2)), by taking
advantage of an identity set.

```javascript
function dedup(orig) {
    var result = [];
    var elements = oid.createSet();

    for (var i = 0; i < orig.length; i++) {
        var one = orig[i];
        if (elements.add(one)) {
            result.push(one);
        }
    }

    return result;
}
```

Here's a transcript of a use of this function as well as the more
fundamental `hash()` function. Note that the literal syntax `[]`
creates a new object with a distinct identity each time it is
executed.

```
> x = []
[]
> y = []
[]
> z = y
[]
> x === y
false
> oid.hash(x) === oid.hash(y)
false
> z === y
true
> oid.hash(z) === oid.hash(y)
true
> a = dedup([x, y, x, x, y, y, 1, 2, 3, 1, 2, 3, x, y, "yumminess"])
[ [], [], 1, 2, 3, 'yumminess' ]
> a[0] === x
true
> a[1] === y
true
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

For booleans, `null`, and `undefined`, this returns a particular
predefined value (different for each), which are all prime numbers
representable with five digits in base ten.

### idmap = oid.createMap()

See below.

### idset = oid.createSet()

See below.


Identity Maps
-------------

An identity map is a set of key-value associations, where the
keys are arbitrary objects or values, compared by identity.

### idmap = oid.createMap()

This constructs and returns a new identity map.

### idmap.get(key, ifNotFound) => value

Get the value associated with the given key. If there is no mapping
for the key, return the `ifNotFound` argument (which defaults to
`undefined`).

### idmap.set(key, value, ifNotFound) => previousValue

Set the value associated with the given key to the given value, and
return the previously associated value. If there was no previous
mapping for the key, return the `ifNotFound` argument (which defaults
to `undefined`).

### idmap.has(key) => boolean

Return `true` if there is a mapping for the given key or `false`
if not.

### idmap.remove(key, ifNotFound) => previousValue

Remove the mapping for the given key, returning its formerly
associated value or the `ifNotFound` value if the key wasn't formerly
mapped.

### idmap.size() => int

Get the number of elements in the map.

### idmap.forEach(callback)

Call the given callback as `callback(key, value)` for each association
in the map. There is no guarantee about what order the callbacks will
be made in.

Identity Sets
-------------

An identity set is a set (unordered list of unique elements) of
objects / values, where set membership is determined by identity
comparison.

### idset = oid.createSet()

This constructs and returns a new identity set.

### idset.has(value) => boolean

Return `true` if there the given value is in the set or `false` if not.

### idset.add(value) => boolean

Add the given value to the set. Returns `true` if this operation
actually changed the set (that is, `true` if the item wasn't already
in the set).

### idset.remove(value) => boolean

Remove the given value from the set. Returns `true` if this operation
actually changed the set (that is, `true` if the item in fact was in
the set to begin with).

### idset.size() => int

Get the number of elements in the set.

### idset.forEach(callback)

Call the given callback as `callback(value)` for each element
of the set. There is no guarantee about what order the callbacks will
be made in.

To Do
-----

* The two collection classes probably ought to have more iteration methods.

* A weak-key identity map class and a weak-contents identity set class
  would probably be handy.

* It seems reasonable that this module provide efficient implementations
  of deep variants of `clone()` and `isEqual()`.


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
