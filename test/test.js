// Copyright 2012 The Obvious Corporation.

/*
 * Tests of oid
 */

/*
 * Modules used
 */

var assert = require("assert");

var oid = require("../lib/oid");
var hash = oid.hash;


/*
 * Helper functions
 */

/**
 * Verify that the given value is valid as an id hash.
 */
function validate(hash) {
    if (typeof hash !== "number") {
        throw new Error("Not a number: " + hash);
    }

    if (hash !== (hash & 0x7fffffff)) {
        throw new Error("Not in range: " + hash);
    }
}

/*
 * Tests
 */

assert.equal(hash(null),      99961);
assert.equal(hash(undefined), 99971);
assert.equal(hash(false),     99991);
assert.equal(hash(true),      99989);

assert.equal(hash(""), 1);
assert.equal(hash("Black Forest Cake"), 824715674);
assert.equal(hash("biscuits"), 1082698090);
assert.equal(hash("croissants"), 112234901);
assert.equal(hash("muffins"), 1400606342);
assert.equal(hash("pie"), 110988);
assert.equal(hash("popovers"), 667514478);
assert.equal(hash("scones"), 1239713053);

// Note: We can't count on numbers hashing to anything in particular.
for (var i = 0; i < 1000; i++) {
    validate(hash(-i));
    validate(hash(i));
    validate(hash(i * 1.23e45));
}

// Just make sure that all the usual sub-types of object can be hashed.
validate(hash([]));
validate(hash([1, 2]));
validate(hash({}));
validate(hash({a: 1, b: 2}));
validate(hash(/Stand back!/));
validate(hash(function x() { return x; }));

console.log("All tests pass!");
