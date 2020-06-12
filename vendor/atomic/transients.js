define(['exports', 'atomic/core', 'set'], function (exports, _, Set$1) { 'use strict';

  Set$1 = Set$1 && Set$1.hasOwnProperty('default') ? Set$1['default'] : Set$1;

  var IPersistent = _.protocol({
    persistent: null
  });

  var ITransient = _.protocol({
    "transient": null
  });

  var ITransientCollection = _.protocol({
    conj: null
  });

  var ITransientEmptyableCollection = _.protocol({
    empty: null
  });

  var ITransientAssociative = _.protocol({
    assoc: null
  });

  var ITransientMap = _.protocol({
    dissoc: null
  });

  var ITransientSet = _.protocol({
    disj: null
  });

  var ITransientAppendable = _.protocol({
    append: null
  });

  var ITransientPrependable = _.protocol({
    prepend: null
  });

  var ITransientYankable = _.protocol({
    yank: null
  });

  var ITransientInsertable = _.protocol({
    before: null,
    after: null
  });

  var ITransientReversible = _.protocol({
    reverse: null
  });

  var persistent = IPersistent.persistent;

  var _transient = ITransient["transient"];

  var assoc = ITransientAssociative.assoc;

  var dissoc = ITransientMap.dissoc;

  var disj = ITransientSet.disj;

  var conj = _.overload(null, _.noop, ITransientCollection.conj, _.doing(ITransientCollection.conj));

  var empty = ITransientEmptyableCollection.empty;

  var append = _.overload(null, _.noop, ITransientAppendable.append, _.doing(ITransientAppendable.append));

  var prepend = _.overload(null, _.noop, ITransientPrependable.prepend, _.doing(ITransientPrependable.prepend, _.reverse));

  var yank = ITransientYankable.yank;

  function afterN(self) {
    var ref = self;

    for (var _len = arguments.length, els = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      els[_key - 1] = arguments[_key];
    }

    while (els.length) {
      var el = els.shift();
      ITransientInsertable.after(ref, el);
      ref = el;
    }
  }

  var after = _.overload(null, _.noop, ITransientInsertable.after, afterN);

  function beforeN(self) {
    var ref = self;

    for (var _len2 = arguments.length, els = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      els[_key2 - 1] = arguments[_key2];
    }

    while (els.length) {
      var el = els.pop();
      ITransientInsertable.before(ref, el);
      ref = el;
    }
  }

  var before = _.overload(null, _.noop, ITransientInsertable.before, beforeN);

  var reverse = ITransientReversible.reverse;

  function TransientArray(arr) {
    this.arr = arr;
  }
  function transientArray(arr) {
    return new TransientArray(arr);
  }

  function before$1(self, reference, inserted) {
    var pos = self.arr.indexOf(reference);
    pos === -1 || self.arr.splice(pos, 0, inserted);
  }

  function after$1(self, reference, inserted) {
    var pos = self.arr.indexOf(reference);
    pos === -1 || self.arr.splice(pos + 1, 0, inserted);
  }

  function seq(self) {
    return self.arr.length ? self : null;
  }

  function append$1(self, value) {
    self.arr.push(value);
  }

  function prepend$1(self, value) {
    self.arr.unshift(value);
  }

  function empty$1(self) {
    self.arr = [];
  }

  function reverse$1(self) {
    self.arr.reverse();
  }

  function assoc$1(self, idx, value) {
    self.arr[idx] = value;
  }

  function dissoc$1(self, idx) {
    self.arr.splice(idx, 1);
  }

  function yank$1(self, value) {
    var pos;

    while ((pos = self.arr.indexOf(value)) > -1) {
      self.arr.splice(pos, 1);
    }
  }

  function persistent$1(self) {
    var arr = self.arr;
    delete self.arr;
    return arr;
  }

  var forward = _.forwardTo("arr");
  var find = forward(_.IFind.find);
  var key = forward(_.IMapEntry.key);
  var val = forward(_.IMapEntry.val);
  var contains = forward(_.IAssociative.contains);
  var keys$1 = forward(_.IMap.keys);
  var vals = forward(_.IMap.vals);
  var toObject = forward(_.ICoerceable.toObject);
  var lookup = forward(_.ILookup.lookup);
  var reduce = forward(_.IReduce.reduce);
  var reducekv = forward(_.IKVReduce.reducekv);
  var fmap = forward(_.IFunctor.fmap);
  var includes = forward(_.IInclusive.includes);
  var count = forward(_.ICounted.count);
  var first = forward(_.ISeq.first);
  var rest = forward(_.ISeq.rest);
  var next = forward(_.INext.next);
  var behaveAsTransientArray = _.does(_.implement(_.ISequential), _.implement(IPersistent, {
    persistent: persistent$1
  }), _.implement(_.ISeqable, {
    seq: seq
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(_.INext, {
    next: next
  }), _.implement(_.ICounted, {
    count: count
  }), _.implement(ITransientInsertable, {
    before: before$1,
    after: after$1
  }), _.implement(ITransientCollection, {
    conj: append$1
  }), _.implement(ITransientEmptyableCollection, {
    empty: empty$1
  }), _.implement(_.IFind, {
    find: find
  }), _.implement(ITransientYankable, {
    yank: yank$1
  }), _.implement(_.IMapEntry, {
    key: key,
    val: val
  }), _.implement(_.ILookup, {
    lookup: lookup
  }), _.implement(_.IAssociative, {
    contains: contains
  }), _.implement(ITransientAssociative, {
    assoc: assoc$1
  }), _.implement(ITransientReversible, {
    reverse: reverse$1
  }), _.implement(ITransientMap, {
    dissoc: dissoc$1
  }), _.implement(_.IMap, {
    keys: keys$1,
    vals: vals
  }), _.implement(_.ICoerceable, {
    toObject: toObject
  }), _.implement(_.IReduce, {
    reduce: reduce
  }), _.implement(_.IKVReduce, {
    reducekv: reducekv
  }), _.implement(ITransientAppendable, {
    append: append$1
  }), _.implement(ITransientPrependable, {
    prepend: prepend$1
  }), _.implement(_.IFunctor, {
    fmap: fmap
  }));

  behaveAsTransientArray(TransientArray);

  function TransientObject(obj) {
    this.obj = obj;
  }
  function transientObject(obj) {
    return new TransientObject(obj);
  }

  function conj$1(self, entry) {
    var key = _.IMapEntry.key(entry),
        val = _.IMapEntry.val(entry);
    self.obj[key] = val;
  }

  function dissoc$2(self, key) {
    if (contains$1(self, key)) {
      delete self.obj[key];
    }
  }

  function assoc$2(self, key, value) {
    if (!contains$1(self, key) || !_.IEquiv.equiv(lookup$1(self, key), value)) {
      self.obj[key] = value;
    }
  }

  function clone(self) {
    return transientObject(_.ICloneable.clone(self.obj));
  }

  function compare(a, b) {
    return _.IComparable.compare(a.obj, b == null ? null : b.obj);
  }

  function equiv(a, b) {
    return _.IEquiv.equiv(a.obj, b == null ? null : b.obj);
  }

  function toObject$1(self) {
    return self.obj;
  }

  function empty$2(self) {
    self.obj = {};
  }

  function persistent$2(self) {
    var obj = self.obj;
    delete self.obj;
    return obj;
  }

  var forward$1 = _.forwardTo("obj");
  var keys$2 = forward$1(_.IMap.keys);
  var vals$1 = forward$1(_.IMap.vals);
  var matches = forward$1(_.IMatchable.matches);
  var find$1 = forward$1(_.IFind.find);
  var includes$1 = forward$1(_.IInclusive.includes);
  var lookup$1 = forward$1(_.ILookup.lookup);
  var first$1 = forward$1(_.ISeq.first);
  var rest$1 = forward$1(_.ISeq.rest);
  var next$1 = forward$1(_.INext.next);
  var contains$1 = forward$1(_.IAssociative.contains);
  var seq$1 = forward$1(_.ISeqable.seq);
  var count$1 = forward$1(_.ICounted.count);
  var reduce$1 = forward$1(_.IReduce.reduce);
  var reducekv$1 = forward$1(_.IKVReduce.reducekv);
  var toArray = forward$1(_.ICoerceable.toArray);
  var behaveAsTransientObject = _.does(_.implement(_.IDescriptive), _.implement(IPersistent, {
    persistent: persistent$2
  }), _.implement(ITransientCollection, {
    conj: conj$1
  }), _.implement(_.IComparable, {
    compare: compare
  }), _.implement(ITransientEmptyableCollection, {
    empty: empty$2
  }), _.implement(_.ICoerceable, {
    toArray: toArray,
    toObject: toObject$1
  }), _.implement(_.IFn, {
    invoke: lookup$1
  }), _.implement(_.IReduce, {
    reduce: reduce$1
  }), _.implement(_.IKVReduce, {
    reducekv: reducekv$1
  }), _.implement(_.ICounted, {
    count: count$1
  }), _.implement(_.ICloneable, {
    clone: clone
  }), _.implement(_.ISeqable, {
    seq: seq$1
  }), _.implement(_.ISeq, {
    first: first$1,
    rest: rest$1
  }), _.implement(_.INext, {
    next: next$1
  }), _.implement(_.IFind, {
    find: find$1
  }), _.implement(_.ILookup, {
    lookup: lookup$1
  }), _.implement(_.IAssociative, {
    contains: contains$1
  }), _.implement(ITransientAssociative, {
    assoc: assoc$2
  }), _.implement(_.IInclusive, {
    includes: includes$1
  }), _.implement(_.IEquiv, {
    equiv: equiv
  }), _.implement(_.IMap, {
    keys: keys$2,
    vals: vals$1
  }), _.implement(ITransientMap, {
    dissoc: dissoc$2
  }), _.implement(_.IMatchable, {
    matches: matches
  }));

  behaveAsTransientObject(TransientObject);

  var TransientSet = Set$1;
  function transientSet(entries) {
    return new TransientSet(entries || []);
  }
  function emptyTransientSet() {
    return new TransientSet();
  }

  function seq$2(self) {
    return count$2(self) ? self : null;
  }

  function empty$3(self) {
    self.clear();
  }

  function disj$1(self, value) {
    self["delete"](value);
  }

  function includes$2(self, value) {
    return self.has(value);
  }

  function conj$2(self, value) {
    self.add(value);
  }

  function first$2(self) {
    return self.values().next().value;
  }

  function rest$2(self) {
    var iter = self.values();
    iter.next();
    return _.lazyIterable(iter);
  }

  function next$2(self) {
    var iter = self.values();
    iter.next();
    return _.lazyIterable(iter, null);
  }

  function count$2(self) {
    return self.size;
  }

  var toArray$1 = Array.from;

  function clone$1(self) {
    return transientSet(toArray$1(self));
  }

  function reduce$2(self, xf, init) {
    var memo = init;
    var coll = seq$2(self);

    while (coll) {
      memo = xf(memo, first$2(coll));
      coll = next$2(coll);
    }

    return _.unreduced(memo);
  }

  var behaveAsTransientSet = _.does(_.implement(_.ISequential), _.implement(ITransientCollection, {
    conj: conj$2
  }), _.implement(ITransientSet, {
    disj: disj$1
  }), //TODO unite
  _.implement(_.IReduce, {
    reduce: reduce$2
  }), _.implement(_.ICoerceable, {
    toArray: toArray$1
  }), _.implement(_.ISeqable, {
    seq: seq$2
  }), _.implement(_.IInclusive, {
    includes: includes$2
  }), _.implement(_.ICloneable, {
    clone: clone$1
  }), _.implement(ITransientEmptyableCollection, {
    empty: empty$3
  }), _.implement(_.ICounted, {
    count: count$2
  }), _.implement(_.INext, {
    next: next$2
  }), _.implement(_.ISeq, {
    first: first$2,
    rest: rest$2
  }));

  behaveAsTransientSet(TransientSet);

  function Method(pred, f) {
    this.pred = pred;
    this.f = f;
  }
  function method(pred, f) {
    return new Method(pred, f);
  }

  function invoke(self, args) {
    return _.apply(self.f, args);
  }

  function matches$1(self, args) {
    return _.apply(self.pred, args);
  }

  var behaveAsMethod = _.does(_.implement(_.IMatchable, {
    matches: matches$1
  }), _.implement(_.IFn, {
    invoke: invoke
  }));

  behaveAsMethod(Method);

  function surrogate(f, substitute) {
    return function (self) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      f.apply(null, [substitute].concat(args));
      return self;
    };
  }

  function Multimethod(methods, fallback) {
    this.methods = methods;
    this.fallback = fallback;
  }
  function multimethod(fallback) {
    var instance = new Multimethod([], fallback),
        fn = _.partial(_.IFn.invoke, instance),
        conj = surrogate(ITransientCollection.conj, instance);
    return _.doto(fn, _.specify(ITransientCollection, {
      conj: conj
    }));
  }

  function conj$3(self, method) {
    self.methods.push(method);
  }

  function invoke$1(self) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var method = _.detect(function (_arg) {
      return _.matches(_arg, args);
    }, self.methods);

    if (method) {
      return _.IFn.invoke(method, args);
    } else if (self.fallback) {
      return self.fallback.apply(self, args);
    } else {
      throw new Error("No handler for these args.");
    }
  }

  var behaveAsMultimethod = _.does(_.implement(_.IFn, {
    invoke: invoke$1
  }), _.implement(ITransientCollection, {
    conj: conj$3
  }));

  behaveAsMultimethod(Multimethod);

  function toTransient(Type, construct) {
    function _transient(self) {
      return construct(_.clone(self));
    }

    _.doto(Type, _.implement(ITransient, {
      "transient": _transient
    }));
  }

  toTransient(Object, transientObject);
  toTransient(Array, transientArray);
  toTransient(Set$1, transientSet);
  function withMutations(self, f) {
    return IPersistent.persistent(f(ITransient["transient"](self)));
  }

  exports.withMutations = withMutations;
  exports.IPersistent = IPersistent;
  exports.ITransient = ITransient;
  exports.ITransientCollection = ITransientCollection;
  exports.ITransientEmptyableCollection = ITransientEmptyableCollection;
  exports.ITransientAssociative = ITransientAssociative;
  exports.ITransientMap = ITransientMap;
  exports.ITransientSet = ITransientSet;
  exports.ITransientAppendable = ITransientAppendable;
  exports.ITransientPrependable = ITransientPrependable;
  exports.ITransientYankable = ITransientYankable;
  exports.ITransientInsertable = ITransientInsertable;
  exports.ITransientReversible = ITransientReversible;
  exports.persistent = persistent;
  exports.transient = _transient;
  exports.assoc = assoc;
  exports.dissoc = dissoc;
  exports.disj = disj;
  exports.conj = conj;
  exports.empty = empty;
  exports.append = append;
  exports.prepend = prepend;
  exports.yank = yank;
  exports.after = after;
  exports.before = before;
  exports.reverse = reverse;
  exports.TransientArray = TransientArray;
  exports.transientArray = transientArray;
  exports.TransientObject = TransientObject;
  exports.transientObject = transientObject;
  exports.TransientSet = TransientSet;
  exports.transientSet = transientSet;
  exports.emptyTransientSet = emptyTransientSet;
  exports.Method = Method;
  exports.method = method;
  exports.Multimethod = Multimethod;
  exports.multimethod = multimethod;

  Object.defineProperty(exports, '__esModule', { value: true });

});
