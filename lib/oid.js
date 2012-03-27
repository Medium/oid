// Copyright 2012 The Obvious Corporation.

/*
 * "oid": Utilities for object identity
 */

/*
 * Modules used
 */

"use strict";

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

/**
 * Construct a set (unordered list of objects) keyed by object/value
 * identity.
 */
function createSet() {
    var items = {}; // map from hash to array of objects/values
    var count = 0;

    /**
     * Get the number of elements in the set.
     */
    function size() {
        return count;
    }

    /**
     * Return true if there the given value is in the set or false if not.
     */
    function has(value) {
        var candidates = items[hash(value)];

        if (!candidates) {
            return false;
        }

        for (var i = candidates.length - 1; i >= 0; i--) {
            if (value === candidates[i]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Add the given value to the set. Returns true if this operation
     * actually changed the set (that is, true if the item wasn't already
     * in the set).
     */
    function add(value) {
        var h = hash(value);
        var candidates = items[h];

        if (!candidates) {
            candidates = items[h] = [];
        }

        for (var i = candidates.length - 1; i >= 0; i--) {
            if (value === candidates[i]) {
                return false; // Already in set.
            }
        }

        candidates.push(value);
        count++;
        return true;
    }

    /**
     * Remove the given value from the set. Returns true if this operation
     * actually changed the set (that is, true if the item in fact was in
     * the set to begin with).
     */
    function remove(value) {
        var candidates = items[hash(value)];

        if (!candidates) {
            return false; // Not present in set.
        }

        for (var i = candidates.length - 1; i >= 0; i--) {
            if (value === candidates[i]) {
                candidates.splice(i, 1);
                count--;
                return true;
            }
        }

        return false; // Not present in set.
    }

    /**
     * Call the given callback on each element. The callback is called
     * with a single argument (the element). There is no guarantee
     * about the order of callbacks.
     */
    function forEach(callback) {
        Object.keys(items).forEach(forHash);

        function forHash(hash) {
            items[hash].forEach(callback);
        }
    }

    return {
        add:     add,
        forEach: forEach,
        has:     has,
        remove:  remove,
        size:    size
    };
}

/**
 * Construct a map (association list) keyed by object/value identity.
 */
function createMap() {
    var mappings = {}; // map from hash to array of {key, value} bindings.
    var count = 0;

    /**
     * Get the number of elements in the map.
     */
    function size() {
        return count;
    }

    /**
     * Get the value associated with the given key. If there is
     * no mapping for the key, return the ifNotFound argument (which
     * defaults to undefined).
     */
    function get(key, ifNotFound) {
        var candidates = mappings[hash(key)];

        if (!candidates) {
            return ifNotFound;
        }

        for (var i = candidates.length - 1; i >= 0; i--) {
            var one = candidates[i];
            if (one.key === key) {
                return one.value;
            }
        }

        return ifNotFound;
    }

    /**
     * Set the value associated with the given key to the given value,
     * and return the previously associated value. If there was no
     * previous mapping for the key, return the ifNotFound argument
     * (which defaults to undefined).
     */
    function set(key, value, ifNotFound) {
        var h = hash(key);
        var candidates = mappings[h];

        if (!candidates) {
            candidates = mappings[h] = [];
        }

        for (var i = candidates.length - 1; i >= 0; i--) {
            var one = candidates[i];
            if (one.key === key) {
                var result = one.value;
                one.value = value;
                return result;
            }
        }

        candidates.push({ key: key, value: value });
        count++;
        return ifNotFound;
    }

    /**
     * Return true if there is a mapping for the given key or false
     * if not.
     */
    function has(key) {
        // Use the internal variable "mappings" as the ifNotFound
        // value, since we know it can't appear in the map.
        return get(key, mappings) !== mappings;
    }

    /**
     * Remove the mapping for the given key, returning its formerly
     * associated value or the ifNotFound value if the key wasn't
     * formerly mapped.
     */
    function remove(key, ifNotFound) {
        var candidates = mappings[hash(key)];

        if (!candidates) {
            return ifNotFound;
        }

        for (var i = candidates.length - 1; i >= 0; i--) {
            var one = candidates[i];
            if (one.key === key) {
                var result = one.value;
                candidates.splice(i, 1);
                count--;
                return result;
            }
        }

        return ifNotFound;
    }

    /**
     * Call the given callback on each mapping. The callback is called
     * with two arguments, (key, value). There is no guarantee about the
     * order of callbacks.
     */
    function forEach(callback) {
        Object.keys(mappings).forEach(forHash);

        function forHash(hash) {
            var arr = mappings[hash];
            for (var i = arr.length - 1; i >= 0; i--) {
                var one = arr[i];
                callback(one.key, one.value);
            }
        }
    }

    return {
        forEach: forEach,
        has:     has,
        get:     get,
        remove:  remove,
        set:     set,
        size:    size
    };
}

/**
 * Return the identity hash code of the given value.
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
    createMap: createMap,
    createSet: createSet,
    hash: hash
};
