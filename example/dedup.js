// Copyright 2012 The Obvious Corporation.

var oid = require("../lib/oid");

/**
 * Deduplicate an array, based on object identity.  Given an array,
 * this produces a new array that contains the original's content in
 * the original order, except that if there are any duplicate elements
 * (as compared by ===), only the first is present in the result.
 */
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

module.exports = {
    dedup: dedup
};
