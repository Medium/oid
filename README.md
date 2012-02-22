oid
===

This Node module provides a simple utility for object identity hashing.
This can be useful any time you need to do triple-equals style comparisons
across arbitrary numbers of objects. You can instead get the identity hash
of the things you want to compare, and use those in clever ways to avoid
a lot of triple-equals comparisons.

A future version of this module may provide a couple common uses of this
functionality, namely identity-keyed maps and sets.


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

This library currently provides just one function.

Top-Level Exports
-----------------

### oid.hash(value)

Return an identity hash of the given value. The return value is guaranteed
to be a positive (non-negative and non-zero) integer value. The return value
is *never* guaranteed to be unique.

For regular objects (including arrays and functions), this returns an
arbitrary internally-generated id number.

For strings, this returns a hash based on the characters contained in
the string. The algorithm used is similar to that used by `String.hashCode()`
in Java.

For numbers, this returns a hash based on the numeric value. More specifically,
it is produced by inspecting the underlying byte representation of the
value. As such, it is not guaranteed to be stable across different
implementations of JavaScript.

For booleans, null, and the undefined value, this returns a particular
predefined value (different for each), which are all prime numbers
representable with five digits in base ten.

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
