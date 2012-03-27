// Copyright 2012 The Obvious Corporation.

/*
 * Tests of oid
 */

/*
 * Modules used
 */

"use strict";

var assert = require("assert");
var util   = require("util");

var oid = require("../lib/oid");


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

function testHashBasics() {
    var hash = oid.hash;

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
}

function testMapBasics() {
    var map = oid.createMap();

    assert.equal(map.get(1), undefined);
    assert.equal(map.get(1, "blort"), "blort");
    assert.equal(map.has(1), false);
    assert.equal(map.has("yo"), false);
    assert.equal(map.has([]), false);
    assert.equal(map.size(), 0);
    
    assert.equal(map.set("foo", "bar"), undefined);
    assert.equal(map.get("foo"), "bar");
    assert.equal(map.has("foo"), true);
    assert.equal(map.size(), 1);

    assert.equal(map.set(1, "zorch", "xyz"), "xyz");
    assert.equal(map.get(1), "zorch");
    assert.equal(map.get(1, "blort"), "zorch");
    assert.equal(map.set(1, "spaz"), "zorch");
    assert.equal(map.get(1), "spaz");
    assert.equal(map.size(), 2);

    var x = {};
    assert.equal(map.set(x, "fizmo"), undefined);
    assert.equal(map.get(x), "fizmo");
    assert.equal(map.get({}), undefined);
    assert.equal(map.has(x), true);
    assert.equal(map.has({}), false);
    assert.equal(map.size(), 3);
    assert.equal(map.remove({}), undefined);
    assert.equal(map.has(x), true);
    assert.equal(map.remove({}, "igram"), "igram");
    assert.equal(map.remove(x), "fizmo");
    assert.equal(map.has(x), false);
    assert.equal(map.size(), 2);

    map.set(undefined, "hi");
    assert.equal(map.get(undefined), "hi");

    x = [1, 2, 3];
    map.set(x, undefined);
    assert.equal(map.has(x), true);
    assert.equal(map.get(x), undefined);
    assert.equal(map.get(x, "aha"), undefined);
}

function testSetBasics() {
    var set = oid.createSet();

    assert.equal(set.has(1), false);
    assert.equal(set.has("blort"), false);
    assert.equal(set.has([]), false);
    assert.equal(set.has(false), false);
    assert.equal(set.has(null), false);
    assert.equal(set.has(undefined), false);
    assert.equal(set.has(true), false);
    assert.equal(set.size(), 0);

    assert.equal(set.add("x"), true);
    assert.equal(set.add("x"), false);
    assert.equal(set.has("x"), true);
    assert.equal(set.size(), 1);
    assert.equal(set.remove("x"), true);
    assert.equal(set.size(), 0);
    assert.equal(set.remove("x"), false);
    assert.equal(set.has("x"), false);
    assert.equal(set.size(), 0);

    assert.equal(set.add(undefined), true);
    assert.equal(set.has(undefined), true);

    assert.equal(set.add(1.23), true);
    assert.equal(set.has(1.23), true);
    
    var x = {};
    assert.equal(set.add(x), true);
    assert.equal(set.has(x), true);
    assert.equal(set.has({}), false);
    assert.equal(set.remove({}), false);
    assert.equal(set.has(x), true);
    assert.equal(set.remove(x), true);
    assert.equal(set.has(x), false);
}

function testMap_forEach() {
    var pairs = [
        { k: [],      v: "empty one" },
        { k: [],      v: "empty two" },
        { k: [],      v: "empty three" },
        { k: [],      v: "empty four" },
        { k: [],      v: "empty five" },
        { k: 10,      v: "ten" },
        { k: {a: 1},  v: "a-one" },
        { k: [1,2,3], v: 123 }
    ];

    var map = oid.createMap();
    pairs.forEach(function (p) { map.set(p.k, p.v); });

    function killPair(k, v) {
        for (var i = 0; i < pairs.length; i++) {
            var one = pairs[i];
            if ((one.k === k) && (one.v === v)) {
                pairs.splice(i, 1);
                return;
            }
        }
        throw new Error(util.format("Did not find:", k, v));
    }

    map.forEach(killPair);
    assert.equal(pairs.length, 0);
}

function testSet_forEach() {
    var elements = [
        [], [], [], [], [], [1,2,3], [1,2,3], {a:1}, {a:1},
        "foo", 2.4, 4.8
    ];

    var set = oid.createSet();
    elements.forEach(function (e) { set.add(e); });

    function killElement(v) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] === v) {
                elements.splice(i, 1);
                return;
            }
        }
        throw new Error(util.format("Did not find:", v));
    }

    set.forEach(killElement);
    assert.equal(elements.length, 0);
}

testHashBasics();
testMapBasics();
testSetBasics();
testMap_forEach();
testSet_forEach();

console.log("All tests pass!");
