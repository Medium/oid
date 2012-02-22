// Copyright 2012 The Obvious Corporation.

/*
 * "oid": Utilities for object identity
 */

/*
 * Modules used
 */

var oidNative = require("../bin/oidNative");


/*
 * Helper functions
 */

/**
 * String hash, similar to Java's definition.
 */
function stringHash(string) {
    var hash = 0;
    var length = string.length;

    for (var i = 0; i < length; i++) {
        hash = ((hash * 31) + string.charCodeAt(i)) & 0x7fffffff;
    }

    return (hash === 0) ? 1 : hash;
}


/*
 * Exported bindings
 */

function hash(value) {
    switch (typeof value) {
        case "number":    return oidNative.numberIdHash(value);
        case "string":    return stringHash(value);
        case "boolean":   return value ? 99989 : 99991; // Two primes.
        case "undefined": return 99971;                 // Likewise.
        default:          return oidNative.objectIdHash(value);
    }
}


/*
 * Initialization
 */

module.exports = {
    hash: hash
};
