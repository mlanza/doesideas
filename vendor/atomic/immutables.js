define(['exports', 'immutable', 'atomic/core', 'atomic/transients'], function (exports, imm, _, mut) { 'use strict';

  function set(coll) {
    return coll instanceof imm.Set ? coll : new imm.Set(_.ICoerceable.toArray(coll));
  }
  function emptySet() {
    return new imm.Set();
  }

  var IHash = _.protocol({
    //hashing is an algorithm for improved immutable lookup and is not intended for mutables.
    hash: null
  });

  function list(obj) {
    return obj instanceof imm.List ? obj : new imm.List(obj);
  }

  function conj(self, value) {
    return self.push(value);
  }

  function first(self) {
    return self.first();
  }

  function rest(self) {
    return self.rest();
  }

  function empty(self) {
    return self.clear();
  }

  function count(self) {
    return self.count();
  }

  function seq(self) {
    return first(self) ? self : null;
  }

  var behaveAsList = _.does(_.iterable, _.implement(_.IEmptyableCollection, {
    empty: empty
  }), _.implement(_.ICloneable, {
    clone: _.identity
  }), _.implement(_.ISeqable, {
    seq: seq
  }), _.implement(_.ICounted, {
    count: count
  }), _.implement(_.ICollection, {
    conj: conj
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }));

  behaveAsList(imm.List);

  function map(obj) {
    return obj instanceof imm.Map ? obj : new imm.Map(obj);
  }

  function assoc(self, key, value) {
    return self.set(key, value);
  }

  function contains(self, key) {
    return self.has(key);
  }

  function lookup(self, key) {
    return self.get(key);
  }

  function count$1(self) {
    return self.size;
  }

  function keys$1(self) {
    return _.lazyIterable(self.keys());
  }

  function vals(self) {
    return _.lazyIterable(self.values());
  }

  function dissoc(self, key) {
    return self.remove(self, key);
  }

  var behaveAsMap = _.does(_.iterable, _.implement(_.IMap, {
    keys: keys$1,
    vals: vals,
    dissoc: dissoc
  }), _.implement(_.ICloneable, {
    clone: _.identity
  }), _.implement(_.ICounted, {
    count: count$1
  }), _.implement(_.ILookup, {
    lookup: lookup
  }), _.implement(_.IAssociative, {
    assoc: assoc,
    contains: contains
  }));

  behaveAsMap(imm.Map);

  function distinct2(coll, seen) {
    return _.seq(coll) ? _.lazySeq(function () {
      var xs = coll;

      while (_.seq(xs)) {
        var x = _.first(xs);
        xs = _.rest(xs);

        if (!_.includes(seen, x)) {
          return _.cons(x, distinct2(xs, _.conj(seen, x)));
        }
      }

      return _.emptyList();
    }) : _.emptyList();
  }

  function distinct(coll) {
    return distinct2(coll, set());
  }

  function _transient(self) {
    return mut.transientSet(toArray(self));
  }

  function seq$1(self) {
    return count$2(self) ? self : null;
  }

  function toArray(self) {
    return self.toArray();
  }

  function includes(self, value) {
    return self.has(value);
  }

  function conj$1(self, value) {
    return self.add(value);
  }

  function disj(self, value) {
    return self["delete"](value);
  }

  function first$1(self) {
    return self.first();
  }

  function rest$1(self) {
    var tail = self.rest();
    return tail.size > 0 ? tail : emptySet();
  }

  function next(self) {
    var tail = self.rest();
    return tail.size > 0 ? tail : null;
  }

  function count$2(self) {
    return self.size;
  }

  function reduce(self, xf, init) {
    var memo = init;
    var coll = seq$1(self);

    while (coll) {
      memo = xf(memo, first$1(coll));
      coll = next(coll);
    }

    return _.unreduced(memo);
  }

  var behaveAsSet = _.does(_.iterable, _.implement(_.ISequential), _.implement(mut.ITransient, {
    "transient": _transient
  }), _.implement(_.IReduce, {
    reduce: reduce
  }), _.implement(_.ICoerceable, {
    toArray: toArray
  }), _.implement(_.ISeqable, {
    seq: seq$1
  }), _.implement(_.IInclusive, {
    includes: includes
  }), _.implement(_.ISet, {
    disj: disj,
    unite: conj$1
  }), _.implement(_.ICloneable, {
    clone: _.identity
  }), _.implement(_.IEmptyableCollection, {
    empty: emptySet
  }), _.implement(_.ICollection, {
    conj: conj$1
  }), _.implement(_.ICounted, {
    count: count$2
  }), _.implement(_.INext, {
    next: next
  }), _.implement(_.ISeq, {
    first: first$1,
    rest: rest$1
  }));

  behaveAsSet(imm.Set);

  function Members(items) {
    this.items = items;
  }
  function members(self) {
    return new Members(distinct(_.satisfies(_.ISequential, self) ? self : _.cons(self)));
  }
  function emptyMembers() {
    return new Members();
  }
  Members.from = members;

  function fmap(self, f) {
    return members(_.mapcat(function (item) {
      var result = f(item);
      return _.satisfies(_.ISequential, result) ? result : [result];
    }, self.items));
  }

  function first$2(self) {
    return _.ISeq.first(self.items);
  }

  function rest$2(self) {
    var result = next$1(self);
    return result ? members(result) : emptyMembers();
  }

  function next$1(self) {
    var result = _.INext.next(self.items);
    return result ? members(result) : null;
  }

  var behaveAsMembers = _.does(_.serieslike, _.implement(_.INext, {
    next: next$1
  }), _.implement(_.ISeq, {
    first: first$2,
    rest: rest$2
  }), _.implement(_.IFunctor, {
    fmap: fmap
  }));

  behaveAsMembers(Members);

  var hash = IHash.hash;

  (function () {
    function persistent(self) {
      return set(_.toArray(self));
    }

    _.doto(mut.TransientSet, _.implement(mut.IPersistent, {
      persistent: persistent
    }));
  })();

  var cache = _.Symbol["for"]("hashCode");

  function cachedHashCode() {
    var result = this[cache] || IHash.hash(this);

    if (!Object.isFrozen(this) && this[cache] == null) {
      this[cache] = result;
    }

    return result;
  }

  function hashCode() {
    return IHash.hash(this);
  }

  function equals(other) {
    return _.IEquiv.equiv(this, other);
  }

  function addProp(obj, key, value) {
    if (obj.hasOwnProperty(key)) {
      throw new Error("Property `" + key + "` already defined on " + obj.constructor.name + ".");
    } else {
      Object.defineProperty(obj, key, {
        value: value,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  } // There be dragons! Integrate with Immutable. Object literals despite their use elsewhere are, in this world, immutable.


  addProp(Object.prototype, "hashCode", cachedHashCode);
  addProp(Object.prototype, "equals", equals);
  addProp(Number.prototype, "hashCode", hashCode);
  addProp(String.prototype, "hashCode", hashCode);
  function hashed(hs) {
    return _.reduce(function (h1, h2) {
      return 3 * h1 + h2;
    }, 0, hs);
  }
  function hashing(os) {
    return hashed(_.map(IHash.hash, os));
  }

  (function () {
    function hash(self) {
      return self.valueOf();
    }

    _.each(_.implement(IHash, {
      hash: hash
    }), [Date]);
  })();

  (function () {
    _.each(_.implement(IHash, {
      hash: hashing
    }), [Array, _.Concatenated, _.List, _.EmptyList]);
  })();

  (function () {
    _.each(_.implement(IHash, {
      hash: _.constantly(imm.hash(null))
    }), [_.Nil]);
  })();

  (function () {
    var seed = _.generate(_.positives);
    var uniques = _.weakMap();

    function hash(self) {
      if (!uniques.has(self)) {
        uniques.set(self, seed());
      }

      return uniques.get(self);
    }

    _.each(_.implement(IHash, {
      hash: hash
    }), [Function]);
  })();

  (function () {
    function hash(self) {
      return _.reduce(function (memo, key) {
        return hashing([memo, key, _.get(self, key)]);
      }, 0, _.sort(_.keys(self)));
    }

    _.each(_.implement(IHash, {
      hash: hash
    }), [Object, _.AssociativeSubset, _.Indexed, _.IndexedSeq]);
  })();

  (function () {
    _.each(_.implement(IHash, {
      hash: imm.hash
    }), [String, Number, Boolean]);
  })();

  (function () {
    function hash(self) {
      return IHash.hash(self.id);
    }

    _.doto(_.GUID, _.implement(IHash, {
      hash: hash
    }));
  })();

  exports.List = imm.List;
  exports.Map = imm.Map;
  exports.Set = imm.Set;
  exports.hashed = hashed;
  exports.hashing = hashing;
  exports.list = list;
  exports.map = map;
  exports.set = set;
  exports.emptySet = emptySet;
  exports.distinct = distinct;
  exports.Members = Members;
  exports.members = members;
  exports.emptyMembers = emptyMembers;
  exports.IHash = IHash;
  exports.hash = hash;

  Object.defineProperty(exports, '__esModule', { value: true });

});
