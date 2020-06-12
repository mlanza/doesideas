define(['symbol', 'promise', 'weak-map', 'set'], function (_Symbol, Promise$1, WeakMap$1, Set$1) { 'use strict';

  _Symbol = _Symbol && _Symbol.hasOwnProperty('default') ? _Symbol['default'] : _Symbol;
  var Promise$1__default = 'default' in Promise$1 ? Promise$1['default'] : Promise$1;
  WeakMap$1 = WeakMap$1 && WeakMap$1.hasOwnProperty('default') ? WeakMap$1['default'] : WeakMap$1;
  Set$1 = Set$1 && Set$1.hasOwnProperty('default') ? Set$1['default'] : Set$1;

  var unbind = Function.call.bind(Function.bind, Function.call);
  var slice = unbind(Array.prototype.slice);
  var indexOf = unbind(Array.prototype.indexOf);
  var log = console.log.bind(console);
  function noop() {}
  function complement(f) {
    return function () {
      return !f.apply(this, arguments);
    };
  }
  function invokes(self, method) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return self[method].apply(self, args);
  }
  function type(self) {
    return self == null ? null : self.constructor;
  }
  function overload() {
    var fs = arguments,
        fallback = fs[fs.length - 1];
    return function () {
      var f = fs[arguments.length] || (arguments.length >= fs.length ? fallback : null);
      return f.apply(this, arguments);
    };
  }
  function subj(f, len) {
    //subjective
    var length = len || f.length;
    return function () {
      for (var _len2 = arguments.length, ys = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        ys[_key2] = arguments[_key2];
      }

      return ys.length >= length ? f.apply(null, ys) : function () {
        for (var _len3 = arguments.length, xs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          xs[_key3] = arguments[_key3];
        }

        return f.apply(null, xs.concat(ys));
      };
    };
  }
  function obj(f, len) {
    //objective
    var length = len || f.length;
    return function () {
      for (var _len4 = arguments.length, xs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        xs[_key4] = arguments[_key4];
      }

      return xs.length >= length ? f.apply(null, xs) : function () {
        for (var _len5 = arguments.length, ys = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          ys[_key5] = arguments[_key5];
        }

        return f.apply(null, xs.concat(ys));
      };
    };
  }
  var placeholder = {};
  function part(f) {
    var xs = slice(arguments, 1),
        n = xs.length;
    return xs.indexOf(placeholder) < 0 ? f.apply(null, xs) : function () {
      var ys = slice(arguments),
          zs = [];

      for (var i = 0; i < n; i++) {
        var x = xs[i];
        zs.push(x === placeholder && ys.length ? ys.shift() : x);
      }

      return part.apply(null, [f].concat(zs).concat(ys));
    };
  }
  function partial(f) {
    for (var _len6 = arguments.length, applied = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      applied[_key6 - 1] = arguments[_key6];
    }

    return function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      return f.apply(this, applied.concat(args));
    };
  }
  function partly(f) {
    return partial(part, f);
  }
  function identity(x) {
    return x;
  }
  function constantly(x) {
    return function () {
      return x;
    };
  }
  function doto(obj) {
    var len = arguments.length <= 1 ? 0 : arguments.length - 1;

    for (var i = 0; i < len; i++) {
      var effect = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
      effect(obj);
    }

    return obj;
  }
  function does() {
    for (var _len8 = arguments.length, effects = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      effects[_key8] = arguments[_key8];
    }

    return function () {
      var len = effects.length;

      for (var i = 0; i < len; i++) {
        var effect = effects[i];
        effect.apply(void 0, arguments);
      }
    };
  }

  function is1(constructor) {
    return function (self) {
      return is2(self, constructor);
    };
  }

  function is2(self, constructor) {
    return self != null && self.constructor === constructor;
  }

  var is = overload(null, is1, is2);
  function isInstance(self, constructor) {
    return self instanceof constructor;
  }
  function unspread(f) {
    return function () {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      return f(args);
    };
  }
  function once(f) {
    var pending = {};
    var result = pending;
    return function () {
      if (result === pending) {
        result = f.apply(void 0, arguments);
      }

      return result;
    };
  }
  function execute(f) {
    for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
      args[_key10 - 1] = arguments[_key10];
    }

    return f.apply(this, args);
  }
  function applying() {
    for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    return function (f) {
      return f.apply(this, args);
    };
  }
  function constructs(Type) {
    return function () {
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }

      return new (Function.prototype.bind.apply(Type, [null].concat(args)))();
    };
  }

  function branch3(pred, yes, no) {
    return function () {
      return pred.apply(void 0, arguments) ? yes.apply(void 0, arguments) : no.apply(void 0, arguments);
    };
  }

  function branchN(pred, f) {
    for (var _len13 = arguments.length, fs = new Array(_len13 > 2 ? _len13 - 2 : 0), _key13 = 2; _key13 < _len13; _key13++) {
      fs[_key13 - 2] = arguments[_key13];
    }

    return function () {
      return pred.apply(void 0, arguments) ? f.apply(void 0, arguments) : branch.apply(void 0, fs).apply(void 0, arguments);
    };
  }

  var branch = overload(null, null, null, branch3, branchN);

  function guard1(pred) {
    return guard2(pred, identity);
  }

  function guard2(pred, f) {
    return branch3(pred, f, noop);
  }

  var guard = overload(null, guard1, guard2);

  function memoize1(f) {
    return memoize2(f, function () {
      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }

      return JSON.stringify(args);
    });
  }

  function memoize2(f, hash) {
    var cache = {};
    return function () {
      var key = hash.apply(this, arguments);

      if (cache.hasOwnProperty(key)) {
        return cache[key];
      } else {
        var result = f.apply(this, arguments);
        cache[key] = result;
        return result;
      }
    };
  }

  var memoize = overload(null, memoize1, memoize2);
  function isNative(f) {
    return /\{\s*\[native code\]\s*\}/.test('' + f);
  }

  function toggles4(on, off, want, self) {
    return want(self) ? on(self) : off(self);
  }

  function toggles5(on, off, _, self, want) {
    return want ? on(self) : off(self);
  }

  var toggles = overload(null, null, null, null, toggles4, toggles5);
  function detach(method) {
    return function (obj) {
      for (var _len15 = arguments.length, args = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
        args[_key15 - 1] = arguments[_key15];
      }

      return obj[method].apply(obj, args);
    };
  }
  function attach(f) {
    return function () {
      for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
      }

      return f.apply(null, [this].concat(args));
    };
  }

  function trampoline1(f) {
    var g = f();

    while (typeof g === "function") {
      g = g();
    }

    return g;
  }

  function trampolineN(f) {
    for (var _len17 = arguments.length, args = new Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
      args[_key17 - 1] = arguments[_key17];
    }

    return trampoline1(function () {
      return f.apply(void 0, args);
    });
  }

  var trampoline = overload(null, trampoline1, trampolineN);
  function forwardTo(key) {
    return function forward(f) {
      return function (self) {
        for (var _len18 = arguments.length, args = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
          args[_key18 - 1] = arguments[_key18];
        }

        return f.apply(this, [self[key]].concat(args));
      };
    };
  }
  function forwardWith(g) {
    return function forward(f) {
      return function (self) {
        for (var _len19 = arguments.length, args = new Array(_len19 > 1 ? _len19 - 1 : 0), _key19 = 1; _key19 < _len19; _key19++) {
          args[_key19 - 1] = arguments[_key19];
        }

        return f.apply(this, [g(self)].concat(args));
      };
    };
  }
  function deprecated() {
    console.warn.apply(null, arguments);
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function ProtocolLookupError(protocol, method, subject, args) {
    this.protocol = protocol;
    this.method = method;
    this.subject = subject;
    this.args = args;
  }
  ProtocolLookupError.prototype = new Error();

  ProtocolLookupError.prototype.toString = function () {
    return "Protocol lookup for ".concat(this.method, " failed.");
  };

  function protocolLookupError() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _construct(ProtocolLookupError, args);
  }

  function Nil() {}
  function isNil(x) {
    return x == null;
  }
  function isSome(x) {
    return x != null;
  }
  function nil() {
    return null;
  }
  Object.defineProperty(Nil, _Symbol.hasInstance, {
    value: isNil
  });

  var TEMPLATE = _Symbol("@protocol-template"),
      INDEX = _Symbol("@protocol-index"),
      MISSING = _Symbol("@protocol-missing");

  function Protocol(template, index) {
    this[INDEX] = index;
    this[TEMPLATE] = template;
  }
  function protocol(template) {
    var p = new Protocol({}, {});
    p.extend(template);
    return p;
  }

  Protocol.prototype.extend = function (template) {
    for (var method in template) {
      this[method] = this.dispatch(method);
    }

    Object.assign(this[TEMPLATE], template);
  };

  Protocol.prototype.dispatch = function (method) {
    var protocol = this;
    return function (self) {
      var f = satisfies2.call(protocol, method, self);

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (!f) {
        throw protocolLookupError(protocol, method, self, args);
      }

      return f.apply(null, [self].concat(args));
    };
  };

  Protocol.prototype.generate = function () {
    var index = this[INDEX];
    return function (method) {
      var sym = index[method] || _Symbol(method);

      index[method] = sym;
      return sym;
    };
  };

  function addMeta(target, key, value) {
    try {
      Object.defineProperty(target, key, {
        //unsupported on some objects like Location
        configurable: true,
        enumerable: false,
        writable: true,
        value: value
      });
    } catch (ex) {
      target[key] = value;
    }
  }

  function specify1(behavior) {
    var protocol = this;
    return function (target) {
      specify2.call(protocol, behavior, target);
    };
  }

  function specify2(behavior, target) {
    var keys = this.generate();
    addMeta(target, keys("__marker__"), this);

    for (var method in behavior) {
      addMeta(target, keys(method), behavior[method]);
    }
  }

  Protocol.prototype.specify = overload(null, specify1, specify2);

  function unspecify1(behavior) {
    var protocol = this;
    return function (target) {
      unspecify2.call(protocol, behavior, target);
    };
  }

  function unspecify2(behavior, target) {
    var keys = this.generate();
    addMeta(target, keys("__marker__"), undefined);

    for (var method in behavior) {
      addMeta(target, keys(method), undefined);
    }
  }

  Protocol.prototype.unspecify = overload(null, unspecify1, unspecify2);
  function implement0() {
    return implement1.call(this, {}); //marker interface
  }

  function implement1(behavior) {
    return implement2.bind(this, behavior);
  }

  function implement2(behavior, target) {
    var tgt = target.prototype;

    if (tgt.constructor === Object) {
      tgt = Object;
    }

    specify2.call(this, behavior, tgt);
  }

  Protocol.prototype.implement = overload(implement0, implement1, implement2);

  function satisfies0() {
    return this.satisfies.bind(this);
  }

  function satisfies1(obj$$1) {
    var target = obj$$1 == null ? new Nil() : obj$$1,
        key = this[INDEX]["__marker__"] || MISSING;
    return target[key] || target.constructor[key];
  }

  function satisfies2(method, obj$$1) {
    var target = obj$$1 == null ? new Nil() : obj$$1,
        key = this[INDEX][method] || MISSING;
    return target[key] || target.constructor[key] || this[TEMPLATE][method];
  }

  Protocol.prototype.satisfies = overload(satisfies0, satisfies1, satisfies2);

  var satisfies$1 = unbind(Protocol.prototype.satisfies);
  var specify = unbind(Protocol.prototype.specify);
  var unspecify = unbind(Protocol.prototype.unspecify);
  var implement = unbind(Protocol.prototype.implement);
  var extend = unbind(Protocol.prototype.extend);
  function reifiable(properties) {
    function Reifiable(properties) {
      Object.assign(this, properties);
    }

    return new Reifiable(properties || {});
  }

  var IAddable = protocol({
    add: null
  });

  var IAppendable = protocol({
    append: null
  });

  var IAssociative = protocol({
    assoc: null,
    contains: null
  });

  var blank = constantly(false);
  var IBlankable = protocol({
    blank: blank
  });

  var IBounds = protocol({
    start: null,
    end: null
  });

  var IChainable = protocol({
    chain: null
  });

  function clone(self) {
    return Object.assign(Object.create(self.constructor.prototype), self);
  }

  var ICloneable = protocol({
    clone: clone
  });

  var ICoerceable = protocol({
    toArray: null,
    toObject: null,
    toPromise: null,
    toDuration: null
  });

  var ICollection = protocol({
    conj: null
  });

  var ICompactable = protocol({
    compact: null
  });

  function compare(x, y) {
    return x > y ? 1 : x < y ? -1 : 0;
  }

  var IComparable = protocol({
    compare: compare
  });

  var IMultipliable = protocol({
    mult: null
  });

  var IReduce = protocol({
    reduce: null
  });

  function reduce2(xf, coll) {
    return IReduce.reduce(coll, xf, xf());
  }

  function reduce3(xf, init, coll) {
    return IReduce.reduce(coll, xf, init);
  }

  var reduce = overload(null, null, reduce2, reduce3);

  function reducing1(rf) {
    return reducing2(rf, identity);
  }

  function reducing2(rf, order) {
    return function (x) {
      for (var _len = arguments.length, xs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        xs[_key - 1] = arguments[_key];
      }

      return IReduce.reduce(order(xs), rf, x);
    };
  }

  var reducing = overload(null, reducing1, reducing2);

  var mult = overload(constantly(1), identity, IMultipliable.mult, reducing(IMultipliable.mult));

  function inverse(self) {
    return IMultipliable.mult(self, -1);
  }

  var IInverse = protocol({
    inverse: inverse
  });

  var ICounted = protocol({
    count: null
  });

  var IDeref$1 = protocol({
    deref: null
  });

  var IDescriptive = protocol();

  var IDisposable = protocol({
    dispose: null
  });

  var IDivisible = protocol({
    divide: null
  });

  var IEmptyableCollection = protocol({
    empty: null
  });

  function equiv(x, y) {
    return x === y;
  }

  var IEquiv = protocol({
    equiv: equiv
  });

  var IFind = protocol({
    find: null
  });

  var IFn = protocol({
    invoke: null
  });

  function fork(self, reject, resolve) {
    return resolve(self);
  }

  var IForkable = protocol({
    fork: fork
  });

  function fmap(self, f) {
    return f(self);
  }

  var IFunctor = protocol({
    fmap: fmap
  });

  var IHierarchy = protocol({
    root: null,
    parent: null,
    parents: null,
    closest: null,
    children: null,
    descendants: null,
    siblings: null,
    nextSibling: null,
    nextSiblings: null,
    prevSibling: null,
    prevSiblings: null
  });

  var IInclusive$1 = protocol({
    includes: null
  });

  var IIndexed = protocol({
    nth: null,
    idx: null
  });

  var IInsertable = protocol({
    before: null,
    after: null
  });

  var IKVReduce$1 = protocol({
    reducekv: null
  });

  var ILocate = protocol({
    locate: null
  });

  function lookup(self, key) {
    return self && self[key];
  }

  var ILookup = protocol({
    lookup: lookup
  });

  var IMap = protocol({
    dissoc: null,
    keys: null,
    vals: null
  });

  var IMapEntry = protocol({
    key: null,
    val: null
  });

  var IMatchable = protocol({
    matches: null
  });

  function reducekv2(xf, coll) {
    return IKVReduce$1.reducekv(coll, xf, xf());
  }
  function reducekv3(xf, init, coll) {
    return IKVReduce$1.reducekv(coll, xf, init);
  }
  var reducekv = overload(null, null, reducekv2, reducekv3);

  function get(self, key, notFound) {
    var found = ILookup.lookup(self, key);
    return found == null ? notFound == null ? null : notFound : found;
  }
  function getIn(self, keys, notFound) {
    var found = IReduce.reduce(keys, get, self);
    return found == null ? notFound == null ? null : notFound : found;
  }

  var ISeq = protocol({
    first: null,
    rest: null
  });

  var first = ISeq.first;
  var rest = ISeq.rest;

  var contains = IAssociative.contains;

  function assocN(self, key, value) {
    var instance = IAssociative.assoc(self, key, value);

    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    return args.length > 0 ? assocN.apply(void 0, [instance].concat(args)) : instance;
  }

  var assoc = overload(null, null, null, IAssociative.assoc, assocN);
  function assocIn(self, keys, value) {
    var key = keys[0];

    switch (keys.length) {
      case 0:
        return self;

      case 1:
        return IAssociative.assoc(self, key, value);

      default:
        return IAssociative.assoc(self, key, assocIn(ILookup.lookup(self, key), ICoerceable.toArray(ISeq.rest(keys)), value));
    }
  }

  function update3(self, key, f) {
    return IAssociative.assoc(self, key, f(ILookup.lookup(self, key)));
  }

  function update4(self, key, f, a) {
    return IAssociative.assoc(self, key, f(ILookup.lookup(self, key), a));
  }

  function update5(self, key, f, a, b) {
    return IAssociative.assoc(self, key, f(ILookup.lookup(self, key), a, b));
  }

  function update6(self, key, f, a, b, c) {
    return IAssociative.assoc(self, key, f(ILookup.lookup(self, key), a, b, c));
  }

  function updateN(self, key, f) {
    var tgt = ILookup.lookup(self, key),
        args = [tgt].concat(slice(arguments, 3));
    return IAssociative.assoc(self, key, f.apply(this, args));
  }

  var update = overload(null, null, null, update3, update4, update5, update6, updateN);

  function updateIn3(self, keys, f) {
    var k = keys[0],
        ks = ICoerceable.toArray(ISeq.rest(keys));
    return ks.length ? IAssociative.assoc(self, k, updateIn3(ILookup.lookup(self, k), ks, f)) : update3(self, k, f);
  }

  function updateIn4(self, keys, f, a) {
    var k = keys[0],
        ks = ICoerceable.toArray(ISeq.rest(keys));
    return ks.length ? IAssociative.assoc(self, k, updateIn4(ILookup.lookup(self, k), ks, f, a)) : update4(self, k, f, a);
  }

  function updateIn5(self, keys, f, a, b) {
    var k = keys[0],
        ks = ICoerceable.toArray(ISeq.rest(keys));
    return ks.length ? IAssociative.assoc(self, k, updateIn5(ILookup.lookup(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
  }

  function updateIn6(self, key, f, a, b, c) {
    var k = keys[0],
        ks = ICoerceable.toArray(ISeq.rest(keys));
    return ks.length ? IAssociative.assoc(self, k, updateIn6(ILookup.lookup(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
  }

  function updateInN(self, keys, f) {
    return updateIn3(self, keys, function (obj$$1) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return f.apply(null, [obj$$1].concat(args));
    });
  }

  var updateIn = overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);
  var rewrite = branch(contains, update, identity);

  function patch(init, x) {
    return IKVReduce$1.reducekv(x, function (memo, key, value) {
      return IAssociative.assoc(memo, key, typeof value === "function" ? value(ILookup.lookup(memo, key)) : value);
    }, init);
  }

  function mergeWith3(xf, init, x) {
    return IKVReduce$1.reducekv(x, function (memo, key, value) {
      return IAssociative.assoc(memo, key, IAssociative.contains(memo, key) ? xf(ILookup.lookup(memo, key), value) : xf(value));
    }, init);
  }

  function mergeWithN(xf, init) {
    for (var _len = arguments.length, xs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      xs[_key - 2] = arguments[_key];
    }

    return IReduce.reduce(xs, function (_arg, _arg2) {
      return mergeWith3(xf, _arg, _arg2);
    }, init);
  }

  var mergeWith = overload(null, null, null, mergeWith3, mergeWithN);
  var IMergeable = protocol({
    merge: patch
  });

  var INameable = protocol({
    name: null
  });

  var INext = protocol({
    next: null
  });

  var IOtherwise = protocol({
    otherwise: identity
  });

  var IPath = protocol({
    path: null
  });

  var IPrependable = protocol({
    prepend: null
  });

  var IQueryable = protocol({
    query: null
  });

  var IRecord = protocol({});

  var IReset = protocol({
    reset: null
  });

  var IReversible = protocol({
    reverse: null
  });

  var ISend = protocol({
    send: null
  });

  var ISeqable = protocol({
    seq: null
  });

  var ISequential = protocol();

  var IYankable = protocol({
    yank: null
  });

  var yank = IYankable.yank;

  var conj = overload(null, identity, ICollection.conj, reducing(ICollection.conj));

  var includes = IInclusive$1.includes;
  function excludes(self, value) {
    return !includes(self, value);
  }
  var transpose = branch(includes, yank, conj);

  function unite(self, value) {
    return includes(self, value) ? self : conj(self, value);
  }

  var ISet = protocol({
    unite: unite,
    disj: null
  });

  var IStateMachine = protocol({
    state: null,
    transition: null,
    transitions: null
  });

  var ISplittable = protocol({
    split: null
  });

  var ISwap = protocol({
    swap: null
  });

  var ITemplate = protocol({
    fill: null
  });

  function EmptyList() {}
  function emptyList() {
    return new EmptyList();
  }
  EmptyList.prototype[_Symbol.toStringTag] = "EmptyList";
  EmptyList.create = emptyList;

  var isArray = Array.isArray.bind(Array);
  function emptyArray() {
    return [];
  }
  function array() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args;
  }

  function reduce$1(self, f, init) {
    return init;
  }

  var behaveAsEmptyList = does(implement(ISequential), implement(IBlankable, {
    blank: constantly(true)
  }), implement(IReversible, {
    reverse: emptyList
  }), implement(ICounted, {
    count: constantly(0)
  }), implement(IEmptyableCollection, {
    empty: identity
  }), implement(IInclusive$1, {
    includes: constantly(false)
  }), implement(IKVReduce$1, {
    reducekv: reduce$1
  }), implement(IReduce, {
    reduce: reduce$1
  }), implement(ICoerceable, {
    toArray: emptyArray
  }), implement(ISeq, {
    first: constantly(null),
    rest: emptyList
  }), implement(INext, {
    next: constantly(null)
  }), implement(ISeqable, {
    seq: constantly(null)
  }));

  behaveAsEmptyList(EmptyList);

  Function.prototype[_Symbol.toStringTag] = "Function";
  function isFunction(self) {
    return self && self.constructor === Function;
  }

  var toArray = ICoerceable.toArray;
  var toObject = ICoerceable.toObject;
  var toPromise = ICoerceable.toPromise;
  var toDuration = ICoerceable.toDuration;

  function Reduced(value) {
    this.value = value;
  }

  Reduced.prototype.valueOf = function () {
    return this.value;
  };

  function reduced$1(value) {
    return new Reduced(value);
  }
  function isReduced(value) {
    return value instanceof Reduced;
  }

  function List(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  function from(_ref) {
    var head = _ref.head,
        tail = _ref.tail;
    return new List(head, tail);
  }

  function cons2(head, tail) {
    return new List(head, tail || emptyList());
  }

  var _consN = reducing(cons2);

  function consN() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _consN.apply(this, args.concat([emptyList()]));
  }

  var cons = overload(emptyList, cons2, cons2, consN);
  List.prototype[_Symbol.toStringTag] = "List";
  List.from = from;
  function isList(self) {
    return self && self.constructor === List || self.constructor === EmptyList;
  }
  function list() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return IReduce.reduce(args.reverse(), function (memo, value) {
      return cons(value, memo);
    }, emptyList());
  }

  function assoc$1(self, key, value) {
    var obj$$1 = {};
    obj$$1[key] = value;
    return obj$$1;
  }

  function reduce$2(self, xf, init) {
    return init;
  }

  function equiv$1(self, other) {
    return null == other;
  }

  function otherwise(self, other) {
    return other;
  }

  function fork$1(self, reject, resolve) {
    return reject(self);
  }

  function conj$1(self, value) {
    return cons(value);
  }

  function merge(self) {
    for (var _len = arguments.length, xs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      xs[_key - 1] = arguments[_key];
    }

    return ICounted.count(xs) ? IMergeable.merge.apply(null, Array.from(xs)) : null;
  }

  var behaveAsNil = does(implement(ICloneable, {
    clone: identity
  }), implement(ICompactable, {
    compact: identity
  }), implement(ICollection, {
    conj: conj$1
  }), implement(IBlankable, {
    blank: constantly(true)
  }), implement(IMergeable, {
    merge: merge
  }), implement(IMap, {
    keys: nil,
    vals: nil,
    dissoc: nil
  }), implement(IForkable, {
    fork: fork$1
  }), implement(IEmptyableCollection, {
    empty: identity
  }), implement(IOtherwise, {
    otherwise: otherwise
  }), implement(IEquiv, {
    equiv: equiv$1
  }), implement(ILookup, {
    lookup: identity
  }), implement(IInclusive$1, {
    includes: constantly(false)
  }), implement(IAssociative, {
    assoc: assoc$1,
    contains: constantly(false)
  }), implement(INext, {
    next: identity
  }), implement(ICoerceable, {
    toArray: emptyArray
  }), implement(ISeq, {
    first: identity,
    rest: emptyList
  }), implement(ISeqable, {
    seq: identity
  }), implement(IIndexed, {
    nth: identity
  }), implement(ICounted, {
    count: constantly(0)
  }), implement(IKVReduce$1, {
    reducekv: reduce$2
  }), implement(IReduce, {
    reduce: reduce$2
  }));

  behaveAsNil(Nil);

  function spread(f) {
    return function (args) {
      return f.apply(void 0, _toConsumableArray(ICoerceable.toArray(args)));
    };
  }
  function realize(g) {
    return isFunction(g) ? g() : g;
  }
  function realized(f) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return apply$1(f, IReduce.reduce(args, function (memo, arg) {
        memo.push(realize(arg));
        return memo;
      }, []));
    };
  }
  function juxt() {
    for (var _len2 = arguments.length, fs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      fs[_key2] = arguments[_key2];
    }

    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return IReduce.reduce(fs, function (memo, f) {
        return memo.concat([f.apply(this, args)]);
      }, []);
    };
  }
  function pipe(f) {
    for (var _len4 = arguments.length, fs = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      fs[_key4 - 1] = arguments[_key4];
    }

    return arguments.length ? function () {
      return IReduce.reduce(fs, function (memo, f) {
        return f(memo);
      }, f.apply(null, arguments));
    } : identity;
  }
  function comp() {
    for (var _len5 = arguments.length, fs = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      fs[_key5] = arguments[_key5];
    }

    var last = fs.length - 1,
        f = fs[last];
    return function () {
      return IReduce.reduce(fs, function (memo, f) {
        return f(memo);
      }, f.apply(null, arguments), last - 1, 0);
    };
  }

  function apply2(f, args) {
    return f.apply(null, ICoerceable.toArray(args));
  }

  function apply3(f, a, args) {
    return f.apply(null, [a].concat(ICoerceable.toArray(args)));
  }

  function apply4(f, a, b, args) {
    return f.apply(null, [a, b].concat(ICoerceable.toArray(args)));
  }

  function apply5(f, a, b, c, args) {
    return f.apply(null, [a, b, c].concat(ICoerceable.toArray(args)));
  }

  function applyN(f, a, b, c, d, args) {
    return f.apply(null, [a, b, c, d].concat(ICoerceable.toArray(args)));
  }

  var apply$1 = overload(null, null, apply2, apply3, apply4, apply5, applyN);

  function curry1(f) {
    return curry2(f, f.length);
  }

  function curry2(f, minimum) {
    return function () {
      var applied = arguments.length ? slice(arguments) : [undefined]; //each invocation assumes advancement

      if (applied.length >= minimum) {
        return f.apply(this, applied);
      } else {
        return curry2(function () {
          return f.apply(this, applied.concat(slice(arguments)));
        }, minimum - applied.length);
      }
    };
  }

  var curry = overload(null, curry1, curry2);
  function multi(dispatch) {
    return function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      var f = apply$1(dispatch, args);

      if (!f) {
        throw Error("Failed dispatch");
      }

      return apply$1(f, args);
    };
  }
  function tee(f) {
    return function (value) {
      f(value);
      return value;
    };
  }
  function see() {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return tee(function (obj$$1) {
      apply$1(log, conj(args, obj$$1));
    });
  }
  function flip(f) {
    return function (b, a) {
      for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
        args[_key8 - 2] = arguments[_key8];
      }

      return f.apply(this, [a, b].concat(args));
    };
  }
  function fnil(f) {
    for (var _len9 = arguments.length, substitutes = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
      substitutes[_key9 - 1] = arguments[_key9];
    }

    return function () {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      for (var x = 0; x < substitutes.length; x++) {
        if (isNil(args[x])) {
          args[x] = substitutes[x];
        }
      }

      return f.apply(void 0, args);
    };
  }
  function nullary(f) {
    return function () {
      return f();
    };
  }
  function unary(f) {
    return function (a) {
      return f(a);
    };
  }
  function binary(f) {
    return function (a, b) {
      return f(a, b);
    };
  }
  function ternary(f) {
    return function (a, b, c) {
      return f(a, b, c);
    };
  }
  function quaternary(f) {
    return function (a, b, c, d) {
      return f(a, b, c, d);
    };
  }
  function nary(f, length) {
    return function () {
      return f.apply(void 0, _toConsumableArray(slice(arguments, 0, length)));
    };
  }
  function arity(f, length) {
    return ([nullary, unary, binary, ternary, quaternary][length] || nary)(f, length);
  }

  function append(f) {
    for (var _len = arguments.length, applied = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      applied[_key - 1] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return f.apply(this, args.concat(applied));
    };
  }

  function invoke(self) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return self.apply(null, args);
  }

  function name(self) {
    return self.name ? self.name : get(/function (.+)\s?\(/.exec(self.toString()), 1); //latter is for IE
  }

  var behaveAsFunction = does(implement(INameable, {
    name: name
  }), implement(IAppendable, {
    append: append
  }), implement(IPrependable, {
    prepend: partial
  }), implement(IFn, {
    invoke: invoke
  }));

  behaveAsFunction(Function);

  function number() {
    return Number.apply(void 0, arguments);
  }
  var num = unary(number);
  var _int = parseInt;
  var _float = parseFloat;
  function isNaN$1(n) {
    return n !== n;
  }
  function isNumber(n) {
    return Number(n) === n;
  }
  function isInteger(n) {
    return Number(n) === n && n % 1 === 0;
  }
  var isInt = isInteger;
  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
  function mod(n, div) {
    return n % div;
  }

  function min2(x, y) {
    return IComparable.compare(x, y) < 0 ? x : y;
  }

  function max2(x, y) {
    return IComparable.compare(x, y) > 0 ? x : y;
  }

  var min = overload(null, identity, min2, reducing(min2));
  var max = overload(null, identity, max2, reducing(max2));
  function isZero(x) {
    return x === 0;
  }
  function isPos(x) {
    return x > 0;
  }
  function isNeg(x) {
    return x < 0;
  }
  function isOdd(n) {
    return n % 2;
  }
  var isEven = complement(isOdd);
  function clamp(self, min, max) {
    return self < min ? min : self > max ? max : self;
  }

  function rand0() {
    return Math.random();
  }

  function rand1(n) {
    return Math.random() * n;
  }

  var rand = overload(rand0, rand1);
  function randInt(n) {
    return Math.floor(rand(n));
  }
  function sum(ns) {
    return IReduce.reduce(ns, IAddable.add, 0);
  }
  function least(ns) {
    return IReduce.reduce(ns, min, Number.POSITIVE_INFINITY);
  }
  function most(ns) {
    return IReduce.reduce(ns, max, Number.NEGATIVE_INFINITY);
  }
  function average(ns) {
    return sum(ns) / ICounted.count(ns);
  }
  function measure(ns) {
    return {
      count: ICounted.count(ns),
      sum: sum(ns),
      least: least(ns),
      most: most(ns),
      average: average(ns)
    };
  }

  function compare$1(self, other) {
    return self === other ? 0 : self - other;
  }

  function add(self, other) {
    return self + other;
  }

  function inverse$1(self) {
    return self * -1;
  }

  function mult$1(self, n) {
    return self * n;
  }

  function divide(self, n) {
    return self / n;
  }

  var start$1 = identity,
      end$1 = identity;
  var behaveAsNumber = does(implement(IDivisible, {
    divide: divide
  }), implement(IMultipliable, {
    mult: mult$1
  }), implement(IBounds, {
    start: start$1,
    end: end$1
  }), implement(IComparable, {
    compare: compare$1
  }), implement(IInverse, {
    inverse: inverse$1
  }), implement(IAddable, {
    add: add
  }));

  behaveAsNumber(Number);

  function LazySeq(perform) {
    this.perform = perform;
  }
  function lazySeq(perform) {
    if (typeof perform !== "function") {
      throw new Error("Lazy Seq needs a thunk.");
    }

    return new LazySeq(once(perform));
  }

  function _boolean() {
    return Boolean.apply(void 0, arguments);
  }
  var bool = _boolean;

  function isBoolean(self) {
    return Boolean(self) === self;
  }
  function not(self) {
    return !self;
  }
  function isTrue(self) {
    return self === true;
  }
  function isFalse(self) {
    return self === false;
  }

  function compare$2(self, other) {
    return self === other ? 0 : self === true ? 1 : -1;
  }

  function inverse$2(self) {
    return !self;
  }

  var behaveAsBoolean = does(implement(IComparable, {
    compare: compare$2
  }), implement(IInverse, {
    inverse: inverse$2
  }));

  behaveAsBoolean(Boolean);

  function compare$3(x, y) {
    if (x === y) {
      return 0;
    } else if (isNil(x)) {
      return -1;
    } else if (isNil(y)) {
      return 1;
    } else if (type(x) === type(y)) {
      return IComparable.compare(x, y);
    } else {
      throw new TypeError("Cannot compare different types.");
    }
  }

  function directed(start, step) {
    return compare$3(IAddable.add(start, step), start);
  }
  function steps(Type, pred) {
    return function (start, end, step) {
      if (start == null && end == null) {
        return new Type();
      }

      if (start != null && !pred(start)) {
        throw Error(Type.name + " passed invalid start value.");
      }

      if (end != null && !pred(end)) {
        throw Error(Type.name + " passed invalid end value.");
      }

      if (start == null && end != null) {
        throw Error(Type.name + " cannot get started without a beginning.");
      }

      var direction = directed(start, step);

      if (direction === 0) {
        throw Error(Type.name + " lacks direction.");
      }

      return new Type(start, end, step, direction);
    };
  }

  function subtract2(self, n) {
    return IAddable.add(self, IInverse.inverse(n));
  }

  var subtract = overload(constantly(0), identity, subtract2, reducing(subtract2));
  var add$1 = overload(constantly(0), identity, IAddable.add, reducing(IAddable.add));

  var _ref = +1;

  var inc = overload(constantly(+1), function (_arg) {
    return IAddable.add(_arg, _ref);
  });

  var _ref2 = -1;

  var dec = overload(constantly(-1), function (_arg2) {
    return IAddable.add(_arg2, _ref2);
  });

  function Range(start, end, step, direction) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.direction = direction;
  }

  function from$1(_ref) {
    var start = _ref.start,
        end = _ref.end,
        step = _ref.step,
        direction = _ref.direction;
    return new Range(start, end, step, direction);
  }

  function emptyRange() {
    return new Range();
  }

  function range0() {
    return range1(Number.POSITIVE_INFINITY);
  }

  function range1(end) {
    return range3(0, end, 1);
  }

  function range2(start, end) {
    return range3(start, end, 1);
  }

  var range3 = steps(Range, isNumber);
  var range = overload(range0, range1, range2, range3);
  Range.from = from$1;
  Range.create = range;
  Range.prototype[_Symbol.toStringTag] = "Range";

  function isString(s) {
    return s != null && typeof s === "string";
  }
  function emptyString() {
    return "";
  }

  function isBlank(str) {
    return str == null || typeof str === "string" && str.trim().length === 0;
  }

  function str1(x) {
    return x == null ? "" : x.toString();
  }

  function str2(x, y) {
    return str1(x) + str1(y);
  }

  function camelToDashed(str) {
    return str.replace(/[A-Z]/, function (x) {
      return "-" + x.toLowerCase();
    });
  }
  var startsWith = unbind(String.prototype.startsWith);
  var endsWith = unbind(String.prototype.endsWith);
  var replace = unbind(String.prototype.replace);
  var subs = unbind(String.prototype.substring);
  var lowerCase = unbind(String.prototype.toLowerCase);
  var upperCase = unbind(String.prototype.toUpperCase);
  var titleCase = function titleCase(_arg) {
    return replace(_arg, /(^|\s|\.)(\S|\.)/g, upperCase);
  };
  var lpad = unbind(String.prototype.padStart);
  var rpad = unbind(String.prototype.padEnd);
  var trim = unbind(String.prototype.trim);
  var rtrim = unbind(String.prototype.trimRight);
  var ltrim = unbind(String.prototype.trimLeft);
  var str = overload(emptyString, str1, str2, reducing(str2));
  function zeros(value, n) {
    return lpad(str(value), n, "0");
  }

  var seq = ISeqable.seq;

  function filter(pred, xs) {
    return ISeqable.seq(xs) ? lazySeq(function () {
      var ys = xs;

      var _loop = function _loop() {
        var head = ISeq.first(ys),
            tail = ISeq.rest(ys);

        if (pred(head)) {
          return {
            v: cons(head, lazySeq(function () {
              return filter(pred, tail);
            }))
          };
        }

        ys = tail;
      };

      while (ISeqable.seq(ys)) {
        var _ret = _loop();

        if (_typeof(_ret) === "object") return _ret.v;
      }

      return emptyList();
    }) : emptyList();
  }
  function Concatenated(colls) {
    this.colls = colls;
  }
  function concatenated(xs) {
    var colls = filter(ISeqable.seq, xs);
    return ISeqable.seq(colls) ? new Concatenated(colls) : emptyList();
  }
  function isConcatenated(self) {
    return self.constructor === Concatenated;
  }

  function from$2(_ref) {
    var colls = _ref.colls;
    return new Concatenated(colls);
  }

  Concatenated.prototype[_Symbol.toStringTag] = "Concatenated";
  Concatenated.create = concatenated;
  Concatenated.from = from$2;
  var concat = overload(emptyList, ISeqable.seq, unspread(concatenated));

  function map2(f, xs) {
    return ISeqable.seq(xs) ? lazySeq(function () {
      return cons(f(ISeq.first(xs)), map2(f, ISeq.rest(xs)));
    }) : emptyList();
  }

  function map3(f, c1, c2) {
    var s1 = ISeqable.seq(c1),
        s2 = ISeqable.seq(c2);
    return s1 && s2 ? lazySeq(function () {
      return cons(f(ISeq.first(s1), ISeq.first(s2)), map3(f, ISeq.rest(s1), ISeq.rest(s2)));
    }) : emptyList();
  }

  function mapN(f) {
    for (var _len = arguments.length, tail = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      tail[_key - 1] = arguments[_key];
    }

    var seqs = map(ISeqable.seq, tail);
    return notAny(isNil, seqs) ? lazySeq(function () {
      return cons(apply$1(f, mapa$1(ISeq.first, seqs)), apply$1(mapN, f, mapa$1(ISeq.rest, seqs)));
    }) : emptyList();
  }

  var map = overload(null, null, map2, map3, mapN);
  var mapa$1 = comp(ICoerceable.toArray, map);
  function keyed(f, keys) {
    return IReduce.reduce(keys, function (memo, key) {
      return IAssociative.assoc(memo, key, f(key));
    }, {});
  }

  function transduce3(xform, f, coll) {
    return transduce4(xform, f, f(), coll);
  }

  function transduce4(xform, f, init, coll) {
    return IReduce.reduce(coll, xform(f), init);
  }

  var transduce = overload(null, null, null, transduce3, transduce4);

  function into2(to, from) {
    return IReduce.reduce(from, ICollection.conj, to);
  }

  function into3(to, xform, from) {
    return transduce(xform, ICollection.conj, to, from);
  }

  var into = overload(emptyArray, identity, into2, into3); //TODO unnecessary if CQS pattern is that commands return self

  function doing1(f) {
    return doing2(f, identity);
  }

  function doing2(f, order) {
    return function (self) {
      for (var _len2 = arguments.length, xs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        xs[_key2 - 1] = arguments[_key2];
      }

      each(function (_arg) {
        return f(self, _arg);
      }, order(xs));
    };
  }

  var doing = overload(null, doing1, doing2); //mutating counterpart to `reducing`

  function each(f, xs) {
    var ys = ISeqable.seq(xs);

    while (ys) {
      f(ISeq.first(ys));
      ys = ISeqable.seq(ISeq.rest(ys));
    }
  }

  function doseq3(f, xs, ys) {
    each(function (x) {
      each(function (y) {
        f(x, y);
      }, ys);
    }, xs);
  }

  function doseq4(f, xs, ys, zs) {
    each(function (x) {
      each(function (y) {
        each(function (z) {
          f(x, y, z);
        }, zs);
      }, ys);
    }, xs);
  }

  function doseqN(f, xs) {
    for (var _len3 = arguments.length, colls = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      colls[_key3 - 2] = arguments[_key3];
    }

    each(function (x) {
      if (ISeqable.seq(colls)) {
        apply$1(doseq, function () {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          apply$1(f, x, args);
        }, colls);
      } else {
        f(x);
      }
    }, xs || []);
  }

  var doseq = overload(null, null, each, doseq3, doseq4, doseqN);
  function eachkv(f, xs) {
    each(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return f(key, value);
    }, entries(xs));
  }
  function eachvk(f, xs) {
    each(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      return f(value, key);
    }, entries(xs));
  }

  function entries2(xs, keys) {
    return ISeqable.seq(keys) ? lazySeq(function () {
      return cons([ISeq.first(keys), ILookup.lookup(xs, ISeq.first(keys))], entries2(xs, ISeq.rest(keys)));
    }) : emptyList();
  }

  function entries1(xs) {
    return entries2(xs, IMap.keys(xs));
  }

  var entries = overload(null, entries1, entries2);
  function mapkv(f, xs) {
    return map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          key = _ref6[0],
          value = _ref6[1];

      return f(key, value);
    }, entries(xs));
  }
  function mapvk(f, xs) {
    return map(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          key = _ref8[0],
          value = _ref8[1];

      return f(value, key);
    }, entries(xs));
  }
  function seek() {
    for (var _len5 = arguments.length, fs = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      fs[_key5] = arguments[_key5];
    }

    return function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return IReduce.reduce(function (memo, f) {
        return memo == null ? f.apply(void 0, args) : reduced$1(memo);
      }, null, fs);
    };
  }
  function some(f, coll) {
    var xs = ISeqable.seq(coll);

    while (xs) {
      var value = f(ISeq.first(xs));

      if (value) {
        return value;
      }

      xs = INext.next(xs);
    }

    return null;
  }
  var notSome = comp(not, some);
  var notAny = notSome;
  function every(pred, coll) {
    var xs = ISeqable.seq(coll);

    while (xs) {
      if (!pred(ISeq.first(xs))) {
        return false;
      }

      xs = INext.next(xs);
    }

    return true;
  }
  var notEvery = comp(not, every);
  function mapSome(f, pred, coll) {
    return IReduce.reduce(self, function (memo, value) {
      return pred(value) ? f(value) : value;
    }, coll);
  }
  function mapcat(f, colls) {
    return concatenated(map(f, colls));
  }
  function filter$1(pred, xs) {
    return ISeqable.seq(xs) ? lazySeq(function () {
      var ys = xs;

      var _loop = function _loop() {
        var head = ISeq.first(ys),
            tail = ISeq.rest(ys);

        if (pred(head)) {
          return {
            v: cons(head, lazySeq(function () {
              return filter$1(pred, tail);
            }))
          };
        }

        ys = tail;
      };

      while (ISeqable.seq(ys)) {
        var _ret = _loop();

        if (_typeof(_ret) === "object") return _ret.v;
      }

      return emptyList();
    }) : emptyList();
  }
  var detect = comp(first, filter$1);
  function cycle(coll) {
    return ISeqable.seq(coll) ? lazySeq(function () {
      return cons(ISeq.first(coll), concat(ISeq.rest(coll), cycle(coll)));
    }) : emptyList();
  }
  function treeSeq(branch$$1, children, root) {
    function walk(node) {
      return cons(node, branch$$1(node) ? mapcat(walk, children(node)) : emptyList());
    }

    return walk(root);
  }
  function flatten(coll) {
    return filter$1(complement(satisfies$1(ISequential)), ISeq.rest(treeSeq(satisfies$1(ISequential), ISeqable.seq, coll)));
  }
  function zip() {
    for (var _len7 = arguments.length, colls = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      colls[_key7] = arguments[_key7];
    }

    return mapcat(identity, map.apply(void 0, [ISeqable.seq].concat(colls)));
  }
  var filtera = comp(ICoerceable.toArray, filter$1);
  function remove$1(pred, xs) {
    return filter$1(complement(pred), xs);
  }
  function keep(f, xs) {
    return filter$1(isSome, map(f, xs));
  }
  function drop(n, coll) {
    var i = n,
        xs = ISeqable.seq(coll);

    while (i > 0 && xs) {
      xs = ISeq.rest(xs);
      i = i - 1;
    }

    return xs;
  }
  function dropWhile(pred, xs) {
    return ISeqable.seq(xs) ? pred(ISeq.first(xs)) ? dropWhile(pred, ISeq.rest(xs)) : xs : emptyList();
  }
  function dropLast(n, coll) {
    return map(function (x, _) {
      return x;
    }, coll, drop(n, coll));
  }
  function take(n, coll) {
    var xs = ISeqable.seq(coll);
    return n > 0 && xs ? lazySeq(function () {
      return cons(ISeq.first(xs), take(n - 1, ISeq.rest(xs)));
    }) : emptyList();
  }
  function takeWhile(pred, xs) {
    return ISeqable.seq(xs) ? lazySeq(function () {
      var item = ISeq.first(xs);
      return pred(item) ? cons(item, lazySeq(function () {
        return takeWhile(pred, ISeq.rest(xs));
      })) : emptyList();
    }) : emptyList();
  }
  function takeNth(n, xs) {
    return ISeqable.seq(xs) ? lazySeq(function () {
      return cons(ISeq.first(xs), takeNth(n, drop(n, xs)));
    }) : emptyList();
  }
  function takeLast(n, coll) {
    return n ? drop(ICounted.count(coll) - n, coll) : emptyList();
  }

  function interleave2(xs, ys) {
    var as = ISeqable.seq(xs),
        bs = ISeqable.seq(ys);
    return as != null && bs != null ? cons(ISeq.first(as), lazySeq(function () {
      return cons(ISeq.first(bs), interleave2(ISeq.rest(as), ISeq.rest(bs)));
    })) : emptyList();
  }

  function interleaveN() {
    for (var _len8 = arguments.length, colls = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      colls[_key8] = arguments[_key8];
    }

    return concatenated(interleaved(colls));
  }

  function interleaved(colls) {
    return ISeqable.seq(filter$1(isNil, colls)) ? emptyList() : lazySeq(function () {
      return cons(map(ISeq.first, colls), interleaved(map(INext.next, colls)));
    });
  }
  var interleave = overload(null, null, interleave2, interleaveN);
  function interpose(sep, xs) {
    return drop(1, interleave2(repeat1(sep), xs));
  }

  function partition2(n, xs) {
    return partition3(n, n, xs);
  }

  function partition3(n, step, xs) {
    var coll = ISeqable.seq(xs);
    if (!coll) return xs;
    var part$$1 = take(n, coll);
    return n === ICounted.count(part$$1) ? cons(part$$1, partition3(n, step, drop(step, coll))) : emptyList();
  }

  function partition4(n, step, pad, xs) {
    var coll = ISeqable.seq(xs);
    if (!coll) return xs;
    var part$$1 = take(n, coll);
    return n === ICounted.count(part$$1) ? cons(part$$1, partition4(n, step, pad, drop(step, coll))) : cons(take(n, concat(part$$1, pad)));
  }

  var partition = overload(null, null, partition2, partition3, partition4);
  function partitionAll1(n) {
    return partial(partitionAll, n);
  }
  function partitionAll2(n, xs) {
    return partitionAll3(n, n, xs);
  }
  function partitionAll3(n, step, xs) {
    var coll = ISeqable.seq(xs);
    if (!coll) return xs;
    return cons(take(n, coll), partitionAll3(n, step, drop(step, coll)));
  }
  var partitionAll = overload(null, partitionAll1, partitionAll2, partitionAll3);
  function partitionBy(f, xs) {
    var coll = ISeqable.seq(xs);
    if (!coll) return xs;
    var head = ISeq.first(coll),
        val = f(head),
        run = cons(head, takeWhile(function (x) {
      return val === f(x);
    }, INext.next(coll)));
    return cons(run, partitionBy(f, ISeqable.seq(drop(ICounted.count(run), coll))));
  }
  function last(coll) {
    var xs = coll,
        ys = null;

    while (ys = INext.next(xs)) {
      xs = ys;
    }

    return ISeq.first(xs);
  }

  function dedupe1(coll) {
    return dedupe2(identity, coll);
  }

  function dedupe2(f, coll) {
    return dedupe3(f, IEquiv.equiv, coll);
  }

  function dedupe3(f, equiv, coll) {
    return ISeqable.seq(coll) ? lazySeq(function () {
      var xs = ISeqable.seq(coll);
      var last = ISeq.first(xs);

      while (INext.next(xs) && equiv(f(ISeq.first(INext.next(xs))), f(last))) {
        xs = INext.next(xs);
      }

      return cons(last, dedupe2(f, INext.next(xs)));
    }) : coll;
  }

  var dedupe = overload(null, dedupe1, dedupe2, dedupe3);

  function repeatedly1(f) {
    return lazySeq(function () {
      return cons(f(), repeatedly1(f));
    });
  }

  function repeatedly2(n, f) {
    return take(n, repeatedly1(f));
  }

  var repeatedly = overload(null, repeatedly1, repeatedly2);

  function repeat1(x) {
    return repeatedly1(constantly(x));
  }

  function repeat2(n, x) {
    return repeatedly2(n, constantly(x));
  }

  var repeat = overload(null, repeat1, repeat2);
  function isEmpty(coll) {
    return !ISeqable.seq(coll);
  }
  function notEmpty(coll) {
    return isEmpty(coll) ? null : coll;
  }

  function asc2(compare, f) {
    return function (a, b) {
      return compare(f(a), f(b));
    };
  }

  function asc1(f) {
    return asc2(IComparable.compare, f);
  }

  var asc = overload(constantly(IComparable.compare), asc1, asc2);

  function desc0() {
    return function (a, b) {
      return IComparable.compare(b, a);
    };
  }

  function desc2(compare, f) {
    return function (a, b) {
      return compare(f(b), f(a));
    };
  }

  function desc1(f) {
    return desc2(IComparable.compare, f);
  }

  var desc = overload(desc0, desc1, desc2);

  function sort1(coll) {
    return sort2(IComparable.compare, coll);
  }

  function sort2(compare, coll) {
    return into([], coll).sort(compare);
  }

  function sortN() {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    var compares = initial(args),
        coll = last(args);

    function compare(x, y) {
      return IReduce.reduce(compares, function (memo, compare) {
        return memo === 0 ? compare(x, y) : reduced$1(memo);
      }, 0);
    }

    return sort2(compare, coll);
  }

  var sort = overload(null, sort1, sort2, sortN);

  function sortBy2(keyFn, coll) {
    return sortBy3(keyFn, IComparable.compare, coll);
  }

  function sortBy3(keyFn, compare, coll) {
    return sort(function (x, y) {
      return IComparable.compare(keyFn(x), keyFn(y));
    }, coll);
  }

  var sortBy = overload(null, null, sortBy2, sortBy3);
  function withIndex(iter) {
    return function (f, xs) {
      var idx = -1;
      return iter(function (x) {
        return f(++idx, x);
      }, xs);
    };
  }
  var butlast = partial(dropLast, 1);
  var initial = butlast;
  var eachIndexed = withIndex(each);
  var mapIndexed = withIndex(map);
  var keepIndexed = withIndex(keep);
  var splitAt = juxt(take, drop);
  var splitWith = juxt(takeWhile, dropWhile);

  function braid3(f, xs, ys) {
    return mapcat(function (x) {
      return map(function (y) {
        return f(x, y);
      }, ys);
    }, xs);
  }

  function braid4(f, xs, ys, zs) {
    return mapcat(function (x) {
      return mapcat(function (y) {
        return map(function (z) {
          return f(x, y, z);
        }, zs);
      }, ys);
    }, xs);
  }

  function braidN(f, xs) {
    for (var _len10 = arguments.length, colls = new Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
      colls[_key10 - 2] = arguments[_key10];
    }

    if (ISeqable.seq(colls)) {
      return mapcat(function (x) {
        return apply$1(braid, function () {
          for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            args[_key11] = arguments[_key11];
          }

          return apply$1(f, x, args);
        }, colls);
      }, xs);
    } else {
      return map(f, xs || []);
    }
  } //Clojure's `for`; however, could not use the name as it's a reserved word in JavaScript.


  var braid = overload(null, null, map, braid3, braid4, braidN);

  function best2(better, xs) {
    var coll = ISeqable.seq(xs);
    return coll ? IReduce.reduce(ISeq.rest(coll), function (a, b) {
      return better(a, b) ? a : b;
    }, ISeq.first(coll)) : null;
  }

  function best3(f, better, xs) {
    var coll = ISeqable.seq(xs);
    return coll ? IReduce.reduce(ISeq.rest(coll), function (a, b) {
      return better(f(a), f(b)) ? a : b;
    }, ISeq.first(coll)) : null;
  }

  var best = overload(null, best2, best3);

  function scan1(xs) {
    return scan2(2, xs);
  }

  function scan2(n, xs) {
    return lazySeq(function () {
      var ys = take(n, xs);
      return ICounted.count(ys) === n ? cons(ys, scan2(n, ISeq.rest(xs))) : emptyList();
    });
  }

  var scan = overload(null, scan1, scan2);

  function isDistinct1(coll) {
    var seen = new Set();
    return IReduce.reduce(coll, function (memo, x) {
      if (memo && seen.has(x)) {
        return reduced$1(false);
      }

      seen.add(x);
      return memo;
    }, true);
  }

  function isDistinctN() {
    for (var _len12 = arguments.length, xs = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      xs[_key12] = arguments[_key12];
    }

    return isDistinct1(xs);
  }

  var isDistinct = overload(null, constantly(true), function (a, b) {
    return a !== b;
  }, isDistinctN);

  function dorun1(coll) {
    var xs = ISeqable.seq(coll);

    while (xs) {
      xs = INext.next(xs);
    }
  }

  function dorun2(n, coll) {
    var xs = ISeqable.seq(coll);

    while (xs && n > 0) {
      n++;
      xs = INext.next(xs);
    }
  }

  var dorun = overload(null, dorun1, dorun2);

  function doall1(coll) {
    dorun(coll);
    return coll;
  }

  function doall2(n, coll) {
    dorun(n, coll);
    return coll;
  }

  var doall = overload(null, doall1, doall2);
  function iterate(f, x) {
    return lazySeq(function () {
      return cons(x, iterate(f, f(x)));
    });
  }
  var integers = range(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1);
  var positives = range(1, Number.MAX_SAFE_INTEGER, 1);
  var negatives = range(-1, Number.MIN_SAFE_INTEGER, -1);
  function dotimes(n, f) {
    each(f, range(n));
  }
  function randNth(coll) {
    return IIndexed.nth(coll, randInt(ICounted.count(coll)));
  }
  function cond() {
    for (var _len13 = arguments.length, xs = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      xs[_key13] = arguments[_key13];
    }

    var conditions = isEven(ICounted.count(xs)) ? xs : Array.from(concat(butlast(xs), [constantly(true), last(xs)]));
    return function () {
      for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
        args[_key14] = arguments[_key14];
      }

      return IReduce.reduce(partition(2, conditions), function (memo, condition) {
        var pred = ISeq.first(condition);
        return pred.apply(void 0, args) ? reduced$1(ISeq.first(ISeq.rest(condition))) : memo;
      }, null);
    };
  }

  function join1(xs) {
    return into("", map2(str, xs));
  }

  function join2(sep, xs) {
    return join1(interpose(sep, xs));
  }

  var join = overload(null, join1, join2);
  function shuffle(coll) {
    var a = Array.from(coll);
    var j, x, i;

    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }

    return a;
  }
  function generate(iterable) {
    //e.g. counter: generate(iterate(inc, 0)) or partial(generate, iterate(inc, 0))) for a counter factory;
    var iter = iterable[_Symbol.iterator]();

    return function () {
      return iter.done ? null : iter.next().value;
    };
  }

  function splice4(self, start, nix, coll) {
    return concat(take(start, self), coll, drop(start + nix, self));
  }

  function splice3(self, start, coll) {
    return splice4(self, start, 0, coll);
  }

  var splice = overload(null, null, null, splice3, splice4);
  function also(f, xs) {
    return concat(xs, mapcat(function (x) {
      var result = f(x);
      return satisfies$1(ISequential, result) ? result : [result];
    }, xs));
  }
  function countBy(f, coll) {
    return IReduce.reduce(coll, function (memo, value) {
      var by = f(value),
          n = memo[by];
      memo[by] = n ? inc(n) : 1;
      return memo;
    }, {});
  }

  function groupBy3(init, f, coll) {
    return IReduce.reduce(coll, function (memo, value) {
      return update(memo, f(value), function (group) {
        return ICollection.conj(group || [], value);
      });
    }, init);
  }

  function groupBy2(f, coll) {
    return groupBy3({}, f, coll);
  }

  var groupBy = overload(null, null, groupBy2, groupBy3);

  function index4(init, key, val, coll) {
    return IReduce.reduce(coll, function (memo, x) {
      return IAssociative.assoc(memo, key(x), val(x));
    }, init);
  }

  function index3(key, val, coll) {
    return index4({}, key, val, coll);
  }

  function index2(key, coll) {
    return index4({}, key, identity, coll);
  }

  var index = overload(null, null, index2, index3, index4);

  function lazyIterable1(iter) {
    return lazyIterable2(iter, emptyList());
  }

  function lazyIterable2(iter, done) {
    var res = iter.next();
    return res.done ? done : lazySeq(function () {
      return cons(res.value, lazyIterable1(iter));
    });
  }

  var lazyIterable = overload(null, lazyIterable1, lazyIterable2);

  function unreduced(self) {
    return isReduced(self) ? self.valueOf() : self;
  }

  function deref(self) {
    return self.valueOf();
  }

  var behaveAsReduced = does(implement(IDeref$1, {
    deref: deref
  }));

  behaveAsReduced(Reduced);

  var compact = partial(filter$1, identity);

  function query(self, pred) {
    return filter$1(pred, self);
  }

  function locate(self, pred) {
    return detect(pred, self);
  }

  function fmap$1(self, f) {
    return map(f, self);
  }

  function conj$2(self, value) {
    return cons(value, self);
  }

  function seq$1(self) {
    return ISeqable.seq(self.perform());
  }

  function blank$1(self) {
    return seq$1(self) == null;
  }

  function equiv$2(as, bs) {
    var xs = ISeqable.seq(as),
        ys = ISeqable.seq(bs);
    return ys == null ? false : xs === ys || IEquiv.equiv(ISeq.first(xs), ISeq.first(ys)) && IEquiv.equiv(ISeq.rest(xs), ISeq.rest(ys));
  }

  function iterate$1(self) {
    var state = self;
    return {
      next: function next() {
        var result = ISeqable.seq(state) ? {
          value: ISeq.first(state),
          done: false
        } : {
          done: true
        };
        state = INext.next(state);
        return result;
      }
    };
  }

  function iterator() {
    return iterate$1(this);
  }

  function iterable(Type) {
    Type.prototype[_Symbol.iterator] = iterator;
  }
  function find(coll, key) {
    return reducekv$1(coll, function (memo, k, v) {
      return key === k ? reduced$1([k, v]) : memo;
    }, null);
  }

  function first$1(self) {
    return ISeq.first(self.perform());
  }

  function rest$1(self) {
    return ISeq.rest(self.perform());
  }

  function next(self) {
    return ISeqable.seq(ISeq.rest(self));
  }

  function nth(self, n) {
    var xs = self,
        idx = 0;

    while (xs) {
      var x = ISeq.first(xs);

      if (idx === n) {
        return x;
      }

      idx++;
      xs = INext.next(xs);
    }

    return null;
  }

  function idx(self, x) {
    var xs = ISeqable.seq(self),
        n = 0;

    while (xs) {
      if (x === ISeq.first(xs)) {
        return n;
      }

      n++;
      xs = INext.next(xs);
    }

    return null;
  }

  function reduce$3(xs, xf, init) {
    var memo = init,
        ys = ISeqable.seq(xs);

    while (ys && !(memo instanceof Reduced)) {
      memo = xf(memo, ISeq.first(ys));
      ys = INext.next(ys);
    }

    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function reducekv$1(xs, xf, init) {
    var memo = init,
        ys = ISeqable.seq(xs);

    while (ys && !(memo instanceof Reduced)) {
      var pair = ISeq.first(ys);
      memo = xf(memo, pair[0], pair[1]);
      ys = INext.next(ys);
    }

    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function toArray$1(xs) {
    var ys = xs;
    var zs = [];

    while (ISeqable.seq(ys) != null) {
      zs.push(ISeq.first(ys));
      ys = ISeq.rest(ys);
    }

    return zs;
  }

  function count(self) {
    return reduce$3(self, function (memo) {
      return memo + 1;
    }, 0);
  }

  function append$1(self, other) {
    return concat(self, [other]);
  }

  function yank$1(self, value) {
    return remove(function (x) {
      return x === value;
    }, self);
  }

  function includes$1(self, value) {
    return ILocate.locate(self, function (x) {
      return x === value;
    });
  }

  var reverse = comp(IReversible.reverse, toArray$1);
  var ireduce = does(implement(IReduce, {
    reduce: reduce$3
  }), implement(IKVReduce$1, {
    reducekv: reducekv$1
  }));
  var behaveAsLazySeq = does(iterable, ireduce, implement(ISequential), implement(IIndexed, {
    nth: nth,
    idx: idx
  }), implement(IReversible, {
    reverse: reverse
  }), implement(IBlankable, {
    blank: blank$1
  }), implement(ICompactable, {
    compact: compact
  }), implement(IInclusive$1, {
    includes: includes$1
  }), implement(IQueryable, {
    query: query
  }), implement(ILocate, {
    locate: locate
  }), implement(IYankable, {
    yank: yank$1
  }), implement(IFunctor, {
    fmap: fmap$1
  }), implement(ICollection, {
    conj: conj$2
  }), implement(ICoerceable, {
    toArray: toArray$1
  }), implement(IAppendable, {
    append: append$1
  }), implement(IPrependable, {
    prepend: conj$2
  }), implement(IReduce, {
    reduce: reduce$3
  }), implement(ICounted, {
    count: count
  }), implement(IEquiv, {
    equiv: equiv$2
  }), implement(IFind, {
    find: find
  }), implement(IEmptyableCollection, {
    empty: emptyList
  }), implement(ISeq, {
    first: first$1,
    rest: rest$1
  }), implement(ISeqable, {
    seq: seq$1
  }), implement(INext, {
    next: next
  }));

  behaveAsLazySeq(LazySeq);

  function Multimap(attrs, empty) {
    this.attrs = attrs;
    this.empty = empty;
  }
  function multimap(attrs, empty) {
    return new Multimap(attrs || {}, empty);
  }

  function toObject$1(self) {
    return self.attrs;
  }

  function contains$1(self, key) {
    return self.attrs.hasOwnProperty(key);
  }

  function lookup$1(self, key) {
    return ILookup.lookup(self.attrs, key);
  }

  function seq$2(self) {
    return ISeqable.seq(self.attrs);
  }

  function count$1(self) {
    return ICounted.count(self.attrs);
  }

  function first$2(self) {
    return ISeq.first(seq$2(self));
  }

  function rest$2(self) {
    return ISeq.rest(seq$2(self));
  }

  function keys$1(self) {
    return IMap.keys(self.attrs);
  }

  function vals(self) {
    return IMap.vals(self.attrs);
  }

  function assoc$2(self, key, value) {
    return self.constructor.from(IAssociative.assoc(self.attrs, key, value));
  }

  function dissoc(self, key) {
    return self.constructor.from(IMap.dissoc(self.attrs, key));
  }

  function equiv$3(self, other) {
    return ICounted.count(self) === ICounted.count(other) && reducekv$2(self, function (memo, key, value) {
      return memo ? IEquiv.equiv(ILookup.lookup(other, key), value) : reduced$1(memo);
    }, true);
  }

  function empty(self) {
    return self.constructor.from({});
  }

  function reduce$4(self, xf, init) {
    return IReduce.reduce(IMap.keys(self), function (memo, key) {
      return xf(memo, [key, lookup$1(self, key)]);
    }, init);
  }

  function reducekv$2(self, xf, init) {
    return IReduce.reduce(IMap.keys(self), function (memo, key) {
      return xf(memo, key, lookup$1(self, key));
    }, init);
  }

  function construction(Type) {
    Type.create = constructs(Type);
    Type.from || (Type.from = function (attrs) {
      return Object.assign(Object.create(Type.prototype), {
        attrs: attrs
      });
    });
  }

  function emptyable(Type) {
    function empty() {
      return new Type();
    }

    implement(IEmptyableCollection, {
      empty: empty
    }, Type);
  }
  var behaveAsRecord = does(construction, emptyable, implement(IRecord), implement(IDescriptive), implement(IReduce, {
    reduce: reduce$4
  }), implement(IKVReduce$1, {
    reducekv: reducekv$2
  }), implement(IEquiv, {
    equiv: equiv$3
  }), implement(ICoerceable, {
    toObject: toObject$1
  }), implement(IEmptyableCollection, {
    empty: empty
  }), implement(IAssociative, {
    assoc: assoc$2,
    contains: contains$1
  }), implement(ILookup, {
    lookup: lookup$1
  }), implement(IMap, {
    dissoc: dissoc,
    keys: keys$1,
    vals: vals
  }), implement(ISeq, {
    first: first$2,
    rest: rest$2
  }), implement(ICounted, {
    count: count$1
  }), implement(ISeqable, {
    seq: seq$2
  }));

  function keys$2(self) {
    return Object.keys(self.attrs);
  }

  function count$2(self) {
    return ICounted.count(seq$3(self));
  }

  function seq$3(self) {
    return concatenated(map(function (key) {
      return map(function (value) {
        return [key, value];
      }, ISeqable.seq(ILookup.lookup(self, key)) || emptyList());
    }, keys$2(self)));
  }

  function first$3(self) {
    return ISeq.first(seq$3(self));
  }

  function rest$3(self) {
    return ISeq.rest(seq$3(self));
  }

  function lookup$2(self, key) {
    return ILookup.lookup(self.attrs, key);
  }

  function assoc$3(self, key, value) {
    var values = lookup$2(self, key) || self.empty(key);
    return new self.constructor(IAssociative.assoc(self.attrs, key, ICollection.conj(values, value)), self.empty);
  }

  function contains$2(self, key) {
    return IAssociative.contains(self.attrs, key);
  }

  function reduce$5(self, xf, init) {
    return IReduce.reduce(seq$3(self), function (memo, pair) {
      return xf(memo, pair);
    }, init);
  }

  function reducekv$3(self, xf, init) {
    return reduce$5(self, function (memo, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return xf(memo, key, value);
    }, init);
  }

  var behaveAsMultimap = does(behaveAsRecord, implement(IMap, {
    keys: keys$2
  }), implement(ICoerceable, {
    toArray: comp(Array.from, seq$3)
  }), implement(IReduce, {
    reduce: reduce$5
  }), implement(IKVReduce$1, {
    reducekv: reducekv$3
  }), implement(ICounted, {
    count: count$2
  }), implement(ISeqable, {
    seq: seq$3
  }), implement(ILookup, {
    lookup: lookup$2
  }), implement(IAssociative, {
    assoc: assoc$3,
    contains: contains$2
  }), implement(ISeq, {
    first: first$3,
    rest: rest$3
  }));

  behaveAsMultimap(Multimap);

  function IndexedSeq(seq, start) {
    this.seq = seq;
    this.start = start;
  }

  function indexedSeq1(seq) {
    return indexedSeq2(seq, 0);
  }

  function indexedSeq2(seq, start) {
    return start < ICounted.count(seq) ? new IndexedSeq(seq, start) : emptyList();
  }

  var indexedSeq = overload(null, indexedSeq1, indexedSeq2);

  function from$3(_ref) {
    var seq = _ref.seq,
        start = _ref.start;
    return indexedSeq(seq, start);
  }

  IndexedSeq.prototype[_Symbol.toStringTag] = "IndexedSeq";
  IndexedSeq.create = indexedSeq;
  IndexedSeq.from = from$3;

  function RevSeq(coll, idx) {
    this.coll = coll;
    this.idx = idx;
  }
  function revSeq(coll, idx) {
    return new RevSeq(coll, idx);
  }

  var query$1 = IQueryable.query;

  function locate$1(self, criteria) {
    return satisfies$1(ILocate, self) ? ILocate.locate(self, criteria) : first(query$1(self, criteria));
  }

  function reverse$1(self) {
    var c = ICounted.count(self);
    return c > 0 ? revSeq(self, c - 1) : null;
  }

  function key(self) {
    return lookup$3(self, 0);
  }

  function val(self) {
    return lookup$3(self, 1);
  }

  function find$1(self, key) {
    return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
  }

  function contains$3(self, key) {
    return key < ICounted.count(self.seq) - self.start;
  }

  function lookup$3(self, key) {
    return ILookup.lookup(self.seq, self.start + key);
  }

  function append$2(self, x) {
    return concat(self, [x]);
  }

  function prepend(self, x) {
    return concat([x], self);
  }

  function next$1(self) {
    var pos = self.start + 1;
    return pos < ICounted.count(self.seq) ? indexedSeq(self.seq, pos) : null;
  }

  function nth$1(self, idx) {
    return IIndexed.nth(self.seq, idx + self.start);
  }

  function idx2(self, x) {
    return idx3(self, x, 0);
  }

  function idx3(self, x, idx) {
    if (first$4(self) === x) {
      return idx;
    }

    var nxt = next$1(self);
    return nxt ? idx3(nxt, x, idx + 1) : null;
  }

  var idx$1 = overload(null, null, idx2, idx3);

  function first$4(self) {
    return nth$1(self, 0);
  }

  function rest$4(self) {
    return indexedSeq(self.seq, self.start + 1);
  }

  function toArray$2(self) {
    return reduce$6(self, function (memo, x) {
      memo.push(x);
      return memo;
    }, []);
  }

  function count$3(self) {
    return ICounted.count(self.seq) - self.start;
  }

  function reduce$6(self, xf, init) {
    var memo = init,
        coll = ISeqable.seq(self);

    while (coll && !isReduced(memo)) {
      memo = xf(memo, ISeq.first(coll));
      coll = INext.next(coll);
    }

    return unreduced(memo);
  }

  function reducekv$4(self, xf, init) {
    var idx = 0;
    return reduce$6(self, function (memo, value) {
      memo = xf(memo, idx, value);
      idx += 1;
      return memo;
    }, init);
  }

  function includes$2(self, x) {
    return locate$1(drop(self.start, self.seq), function (y) {
      return IEquiv.equiv(x, y);
    });
  }

  function query$2(self, pred) {
    return filter$1(pred, self);
  }

  var behaveAsIndexedSeq = does(iterable, implement(IQueryable, {
    query: query$2
  }), implement(ISequential), implement(IIndexed, {
    nth: nth$1,
    idx: idx$1
  }), implement(IReversible, {
    reverse: reverse$1
  }), implement(IMapEntry, {
    key: key,
    val: val
  }), implement(IInclusive$1, {
    includes: includes$2
  }), implement(IFind, {
    find: find$1
  }), implement(IAssociative, {
    contains: contains$3
  }), implement(IAppendable, {
    append: append$2
  }), implement(IPrependable, {
    prepend: prepend
  }), implement(IEmptyableCollection, {
    empty: emptyArray
  }), implement(IReduce, {
    reduce: reduce$6
  }), implement(IKVReduce$1, {
    reducekv: reducekv$4
  }), implement(IFn, {
    invoke: lookup$3
  }), implement(ILookup, {
    lookup: lookup$3
  }), implement(ICollection, {
    conj: append$2
  }), implement(INext, {
    next: next$1
  }), implement(ICoerceable, {
    toArray: toArray$2
  }), implement(ISeq, {
    first: first$4,
    rest: rest$4
  }), implement(ISeqable, {
    seq: identity
  }), implement(ICounted, {
    count: count$3
  }));

  behaveAsIndexedSeq(IndexedSeq);

  function clone$1(self) {
    return new revSeq(self.coll, self.idx);
  }

  function count$4(self) {
    return ICounted.count(self.coll);
  }

  function keys$3(self) {
    return range(count$4(self));
  }

  function vals$1(self) {
    return map(function (_arg) {
      return nth$2(self, _arg);
    }, keys$3(self));
  }

  function nth$2(self, idx) {
    return IIndexed.nth(self.coll, count$4(self) - 1 - idx);
  }

  function first$5(self) {
    return IIndexed.nth(self.coll, self.idx);
  }

  function rest$5(self) {
    return INext.next(self) || emptyList();
  }

  function next$2(self) {
    return self.idx > 0 ? revSeq(self.coll, self.idx - 1) : null;
  }

  function conj$3(self, value) {
    return cons(value, self);
  }

  function reduce2$1(coll, f) {
    var xs = ISeqable.seq(coll);
    return xs ? IReduce.reduce(INext.next(xs), f, ISeq.first(xs)) : f();
  }

  function reduce3$1(coll, f, init) {
    var memo = init,
        xs = ISeqable.seq(coll);

    while (xs) {
      memo = f(memo, ISeq.first(xs));

      if (memo instanceof Reduced) {
        return unreduced(memo);
      }

      xs = INext.next(xs);
    }

    return memo;
  }

  var reduce$7 = overload(null, null, reduce2$1, reduce3$1);
  var behaveAsRevSeq = does(iterable, implement(ISequential), implement(ICounted, {
    count: count$4
  }), implement(IIndexed, {
    nth: nth$2
  }), implement(ILookup, {
    lookup: nth$2
  }), implement(IMap, {
    keys: keys$3,
    vals: vals$1
  }), implement(ICoerceable, {
    toArray: Array.from
  }), implement(IEmptyableCollection, {
    empty: emptyList
  }), implement(IReduce, {
    reduce: reduce$7
  }), implement(ICollection, {
    conj: conj$3
  }), implement(ISeq, {
    first: first$5,
    rest: rest$5
  }), implement(INext, {
    next: next$2
  }), implement(ISeqable, {
    seq: identity
  }), implement(ICloneable, {
    clone: clone$1
  }));

  behaveAsRevSeq(RevSeq);

  var clone$2 = Array.from;

  function _before(self, reference, inserted) {
    var pos = self.indexOf(reference);
    pos === -1 || self.splice(pos, 0, inserted);
  }

  function before(self, reference, inserted) {
    var arr = Array.from(self);

    _before(arr, reference, inserted);

    return arr;
  }

  function _after(self, reference, inserted) {
    var pos = self.indexOf(reference);
    pos === -1 || self.splice(pos + 1, 0, inserted);
  }

  function after(self, reference, inserted) {
    var arr = Array.from(self);

    _after(arr, reference, inserted);

    return arr;
  }

  function keys$4(self) {
    return range(ICounted.count(self));
  }

  function _dissoc$1(self, idx) {
    self.splice(idx, 1);
  }

  function dissoc$1(self, idx) {
    var arr = Array.from(self);

    _dissoc$1(arr, idx);

    return arr;
  }

  function reduce3$2(xs, xf, init) {
    var memo = init,
        to = xs.length - 1;

    for (var i = 0; i <= to; i++) {
      if (isReduced(memo)) break;
      memo = xf(memo, xs[i]);
    }

    return unreduced(memo);
  }

  function reduce4(xs, xf, init, from) {
    return reduce5(xs, xf, init, from, xs.length - 1);
  }

  function reduce5(xs, xf, init, from, to) {
    var memo = init;

    if (from <= to) {
      for (var i = from; i <= to; i++) {
        if (isReduced(memo)) break;
        memo = xf(memo, xs[i]);
      }
    } else {
      for (var _i = from; _i >= to; _i--) {
        if (isReduced(memo)) break;
        memo = xf(memo, xs[_i]);
      }
    }

    return unreduced(memo);
  }

  var reduce$8 = overload(null, null, null, reduce3$2, reduce4, reduce5);

  function reducekv$5(xs, xf, init, from) {
    var memo = init,
        len = xs.length;

    for (var i = from || 0; i < len; i++) {
      if (isReduced(memo)) break;
      memo = xf(memo, i, xs[i]);
    }

    return unreduced(memo);
  }

  function yank$2(self, value) {
    return filter$1(function (x) {
      return x !== value;
    }, self);
  }

  function reverse$2(self) {
    var c = ICounted.count(self);
    return c > 0 ? revSeq(self, c - 1) : null;
  }

  function key$1(self) {
    return self[0];
  }

  function val$1(self) {
    return self[1];
  }

  function equiv$4(self, other) {
    return other != null && self !== other && IKVReduce$1.reducekv(self, function (memo, key, value) {
      return memo ? IEquiv.equiv(value, ILookup.lookup(other, key)) : reduced$1(memo);
    }, satisfies$1(ICounted, other) && ICounted.count(self) === ICounted.count(other));
  }

  function find$2(self, key) {
    return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
  }

  function lookup$4(self, key) {
    return key in self ? self[key] : null;
  }

  function assoc$4(self, key, value) {
    if (lookup$4(self, key) === value) {
      return self;
    }

    var arr = Array.from(self);
    arr.splice(key, 1, value);
    return arr;
  }

  function contains$4(self, key) {
    return key > -1 && key < self.length;
  }

  function seq$4(self) {
    return self.length ? self : null;
  }

  function append$3(self, x) {
    return self.concat([x]);
  }

  function prepend$1(self, x) {
    return [x].concat(self);
  }

  function next$3(self) {
    return self.length > 1 ? ISeq.rest(self) : null;
  }

  function first$6(self) {
    return self[0];
  }

  function rest$6(self) {
    return indexedSeq(self, 1);
  }

  function includes$3(self, x) {
    return self.indexOf(x) > -1;
  }

  function length(self) {
    return self.length;
  }

  var nth$3 = lookup$4;

  function idx$2(self, x) {
    var n = self.indexOf(x);
    return n === -1 ? null : n;
  }

  function toObject$2(self) {
    return reduce$8(self, function (memo, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      memo[key] = value;
      return memo;
    }, {});
  }

  function fmap$2(self, f) {
    return mapa$1(f, self);
  }

  function query$3(self, pred) {
    return filter$1(pred, self);
  }

  var blank$2 = complement(seq$4);
  var iindexed = does(implement(IIndexed, {
    nth: nth$3,
    idx: idx$2
  }), implement(ICounted, {
    count: length
  }));
  var iequiv = implement(IEquiv, {
    equiv: equiv$4
  });
  var behaveAsArray = does(iindexed, iequiv, implement(IQueryable, {
    query: query$3
  }), implement(ISequential), implement(IMap, {
    dissoc: dissoc$1,
    keys: keys$4,
    vals: identity
  }), implement(IMergeable, {
    merge: concat
  }), implement(IInsertable, {
    before: before,
    after: after
  }), implement(IFunctor, {
    fmap: fmap$2
  }), implement(ICoerceable, {
    toObject: toObject$2,
    toArray: identity
  }), implement(IYankable, {
    yank: yank$2
  }), implement(IReversible, {
    reverse: reverse$2
  }), implement(IFind, {
    find: find$2
  }), implement(IMapEntry, {
    key: key$1,
    val: val$1
  }), implement(IInclusive$1, {
    includes: includes$3
  }), implement(IAppendable, {
    append: append$3
  }), implement(IPrependable, {
    prepend: prepend$1
  }), implement(ICloneable, {
    clone: clone$2
  }), implement(IFn, {
    invoke: lookup$4
  }), implement(IEmptyableCollection, {
    empty: emptyArray
  }), implement(IReduce, {
    reduce: reduce$8
  }), implement(IKVReduce$1, {
    reducekv: reducekv$5
  }), implement(ILookup, {
    lookup: lookup$4
  }), implement(IAssociative, {
    assoc: assoc$4,
    contains: contains$4
  }), implement(IBlankable, {
    blank: blank$2
  }), implement(ISeqable, {
    seq: seq$4
  }), implement(ICollection, {
    conj: append$3
  }), implement(INext, {
    next: next$3
  }), implement(ISeq, {
    first: first$6,
    rest: rest$6
  }));

  behaveAsArray(Array);

  function promise(handler) {
    return new Promise$1__default(handler);
  }
  Promise$1__default.from = promise;
  function isPromise(self) {
    return self && self instanceof Promise$1__default;
  }

  function conj$4(self, x) {
    return new self.constructor(ICollection.conj(self.colls, [x]));
  }

  function next$4(self) {
    var tail = ISeq.rest(self);
    return ISeqable.seq(tail) ? tail : null;
  }

  function first$7(self) {
    return ISeq.first(ISeq.first(self.colls));
  }

  function rest$7(self) {
    return apply$1(concat, ISeq.rest(ISeq.first(self.colls)), ISeq.rest(self.colls));
  }

  function toArray$3(self) {
    return reduce$9(self, function (memo, value) {
      memo.push(value);
      return memo;
    }, []);
  }

  function reduce$9(self, xf, init) {
    var memo = init,
        remaining = self;

    while (!isReduced(memo) && ISeqable.seq(remaining)) {
      memo = xf(memo, ISeq.first(remaining));
      remaining = INext.next(remaining);
    }

    return unreduced(memo);
  }

  function reducekv$6(self, xf, init) {
    var memo = init,
        remaining = self,
        idx = 0;

    while (!isReduced(memo) && ISeqable.seq(remaining)) {
      memo = xf(memo, idx, ISeq.first(remaining));
      remaining = INext.next(remaining);
      idx++;
    }

    return unreduced(memo);
  }

  function count$5(self) {
    return reduce$9(self, function (memo, value) {
      return memo + 1;
    }, 0);
  }

  var behaveAsConcatenated = does(iterable, ireduce, implement(ISequential), implement(IEmptyableCollection, {
    empty: emptyList
  }), implement(IKVReduce$1, {
    reducekv: reducekv$6
  }), implement(IReduce, {
    reduce: reduce$9
  }), implement(ICollection, {
    conj: conj$4
  }), implement(INext, {
    next: next$4
  }), implement(ISeq, {
    first: first$7,
    rest: rest$7
  }), implement(ICoerceable, {
    toArray: toArray$3
  }), implement(ISeqable, {
    seq: identity
  }), implement(ICounted, {
    count: count$5
  }));

  behaveAsConcatenated(Concatenated);

  function Indexed(obj) {
    this.obj = obj;
  }
  function indexed(obj) {
    return new Indexed(obj);
  }

  var deref$1 = IDeref$1.deref;

  var fmap$3 = overload(constantly(identity), IFunctor.fmap, reducing(IFunctor.fmap));
  function thrush(unit, init) {
    for (var _len = arguments.length, fs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      fs[_key - 2] = arguments[_key];
    }

    return deref$1(reduce(IFunctor.fmap, unit(init), fs));
  }

  function pipeline1(unit) {
    return partial(pipelineN, unit);
  }

  function pipelineN(unit) {
    for (var _len2 = arguments.length, fs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      fs[_key2 - 1] = arguments[_key2];
    }

    return function (init) {
      return thrush.apply(void 0, [unit, init].concat(fs));
    };
  }

  var pipeline = overload(null, pipeline1, pipelineN);

  function Maybe(value) {
    this.value = value;
  }

  function maybe1(x) {
    return new Maybe(x);
  }

  var maybe = overload(null, maybe1, partial(thrush, maybe1));
  var opt = pipeline(maybe1);
  function isMaybe(self) {
    return self instanceof Maybe;
  }

  function both(memo, value) {
    return memo && value;
  }
  function either(memo, value) {
    return memo || value;
  }
  var all = overload(null, identity, both, reducing(both));
  var any = overload(null, identity, either, reducing(either));
  function and() {
    for (var _len = arguments.length, preds = new Array(_len), _key = 0; _key < _len; _key++) {
      preds[_key] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return IReduce.reduce(preds, function (memo, pred) {
        return memo ? pred.apply(void 0, args) : reduced$1(memo);
      }, true);
    };
  }
  function or() {
    for (var _len3 = arguments.length, preds = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      preds[_key3] = arguments[_key3];
    }

    return function () {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return IReduce.reduce(preds, function (memo, pred) {
        return memo ? reduced$1(memo) : pred.apply(void 0, args);
      }, false);
    };
  }
  function signature() {
    for (var _len5 = arguments.length, preds = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      preds[_key5] = arguments[_key5];
    }

    return function () {
      for (var _len6 = arguments.length, values = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        values[_key6] = arguments[_key6];
      }

      return IKVReduce$1.reducekv(preds, function (memo, idx, pred) {
        return memo ? !pred || pred(values[idx]) : reduced$1(memo);
      }, ICounted.count(preds) === ICounted.count(values));
    };
  }
  function everyPair(pred, xs) {
    var every$$1 = xs.length > 0;

    while (every$$1 && xs.length > 1) {
      every$$1 = pred(xs[0], xs[1]);
      xs = slice(xs, 1);
    }

    return every$$1;
  }

  function someFn1(a) {
    return function () {
      return apply$1(a, arguments);
    };
  }

  function someFn2(a, b) {
    return function () {
      return apply$1(a, arguments) || apply$1(b, arguments);
    };
  }

  function someFn3(a, b, c) {
    return function () {
      return apply$1(a, arguments) || apply$1(b, arguments) || apply$1(c, arguments);
    };
  }

  function someFnN() {
    for (var _len7 = arguments.length, preds = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      preds[_key7] = arguments[_key7];
    }

    return function () {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      return IReduce.reduce(preds, function (result, pred) {
        var r = apply$1(pred, args);
        return r ? reduced$1(r) : result;
      }, false);
    };
  }

  var someFn = overload(null, someFn1, someFn2, someFn3, someFnN);
  function isIdentical(x, y) {
    return x === y; //TODO Object.is?
  }

  function lt2(a, b) {
    return compare$3(a, b) < 0;
  }

  function ltN() {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    return everyPair(lt2, args);
  }

  var lt = overload(constantly(false), constantly(true), lt2, ltN);
  var lte2 = or(lt2, eq2);

  function lteN() {
    for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    return everyPair(lte2, args);
  }

  var lte = overload(constantly(false), constantly(true), lte2, lteN);

  function gt2(a, b) {
    return compare$3(a, b) > 0;
  }

  function gtN() {
    for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    return everyPair(gt2, args);
  }

  var gt = overload(constantly(false), constantly(true), gt2, gtN);
  var gte2 = or(eq2, gt2);

  function gteN() {
    for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }

    return everyPair(gte2, args);
  }

  var gte = overload(constantly(false), constantly(true), gte2, gteN);

  function eq2(a, b) {
    return IEquiv.equiv(a, b);
  }

  function eqN() {
    for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      args[_key13] = arguments[_key13];
    }

    return everyPair(eq2, args);
  }

  var eq = overload(constantly(true), constantly(true), eq2, eqN);
  function notEq() {
    return !eq.apply(void 0, arguments);
  }
  function mapArgs(xf, f) {
    return function () {
      return apply$1(f, mapa$1(function (_arg) {
        return maybe(_arg, xf);
      }, indexed(arguments)));
    };
  }
  function everyPred() {
    for (var _len14 = arguments.length, preds = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
      preds[_key14] = arguments[_key14];
    }

    return function () {
      return IReduce.reduce(slice(arguments), function (memo, arg) {
        return IReduce.reduce(preds, function (memo, pred) {
          var result = memo && pred(arg);
          return result ? result : reduced$1(result);
        }, memo);
      }, true);
    };
  }
  function pre(f, pred) {
    return function () {
      if (!pred.apply(this, arguments)) {
        throw new TypeError("Failed pre-condition.");
      }

      return f.apply(this, arguments);
    };
  }
  function post(f, pred) {
    return function () {
      var result = f.apply(this, arguments);

      if (!pred(result)) {
        throw new TypeError("Failed post-condition.");
      }

      return result;
    };
  }

  function scanKey1(better) {
    return partial(scanKey, better);
  }

  function scanKey3(better, k, x) {
    return x;
  }

  function scanKey4(better, k, x, y) {
    return better(k(x), k(y)) ? x : y;
  }

  function scanKeyN(better, k, x) {
    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    return apply$1(IReduce.reduce, args, partial(scanKey3, better), x);
  }

  var scanKey = overload(null, scanKey1, null, scanKey3, scanKey4, scanKeyN);
  var maxKey = scanKey(gt);
  var minKey = scanKey(lt);
  var prop = overload(null, function (key) {
    return overload(null, function (_arg) {
      return ILookup.lookup(_arg, key);
    }, function (_arg2, _arg3) {
      return IAssociative.assoc(_arg2, key, _arg3);
    });
  }, ILookup.lookup, IAssociative.assoc);

  function absorb2(tgt, src) {
    return IKVReduce$1.reducekv(src || IEmptyableCollection.empty(tgt), function (memo, key, value) {
      var was = ILookup.lookup(memo, key);
      var absorbed;

      if (was == null) {
        absorbed = value;
      } else if (satisfies$1(IDescriptive, value)) {
        absorbed = into(IEmptyableCollection.empty(was), absorb(was, value));
      } else if (satisfies$1(ISequential, value)) {
        absorbed = into(IEmptyableCollection.empty(was), concat(was, value));
      } else {
        absorbed = value;
      }

      return IAssociative.assoc(memo, key, absorbed);
    }, tgt);
  }

  var absorb = overload(constantly({}), identity, absorb2, reducing(absorb2));

  function monthDays(self) {
    return IMergeable.merge(self, {
      month: inc,
      day: 0
    }).getDate();
  }
  function weekday(self) {
    return self ? !weekend(self) : null;
  }
  function weekend(self) {
    var day = dow1(self);
    return day == null ? null : day == 0 || day == 6;
  }

  function dow1(self) {
    return self ? self.getDay() : null;
  }

  function dow2(self, n) {
    return self ? dow1(self) === n : null;
  }

  var dow = overload(null, dow1, dow2);
  var year = prop("year");
  var month = prop("month");
  var day = prop("day");
  var hour = prop("hour");
  var minute = prop("minute");
  var second = prop("second");
  var millisecond = prop("millisecond");
  function quarter(self) {
    return Math.ceil((month(self) + 1) / 3);
  }
  function clockHour(self) {
    var h = self.getHours();
    return (h > 12 ? h - 12 : h) || 12;
  }
  function pm(self) {
    return self.getHours() >= 12;
  } //dow = 0-6 if day is in first week.  Add 7 for every additional week.
  //e.g. Second Saturday is 13 (6 + 7), First Sunday is 0, Second Sunday is 7.

  function rdow(self, n) {
    var dt = ICloneable.clone(self);

    while (n < 0) {
      dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 7, dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
      n += 7;
    }

    if (n > 6) {
      var dys = Math.floor(n / 7) * 7;
      dt.setDate(dt.getDate() + dys);
      n = n % 7;
    }

    var offset = n - dt.getDay();
    dt.setDate(dt.getDate() + offset + (offset < 0 ? 7 : 0));
    return dt;
  }
  function mdow(self, n) {
    return rdow(IMergeable.merge(self, som()), n);
  }
  function isDate(self) {
    return self instanceof Date && !isNaN(self);
  }
  function time(hour, minute, second, millisecond) {
    return {
      hour: hour || 0,
      minute: minute || 0,
      second: second || 0,
      millisecond: millisecond || 0
    };
  }
  function sod() {
    return time(0, 0, 0, 0);
  }
  function eod() {
    return {
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      day: inc
    };
  }
  function noon() {
    return time(12, 0, 0, 0);
  }
  function annually(month, day) {
    return {
      month: month,
      day: day,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  var midnight = sod;
  function som() {
    return {
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  function eom() {
    return {
      month: inc,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  function soy() {
    return {
      month: 0,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  function eoy() {
    return {
      year: inc,
      month: 0,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  function tick(n) {
    return {
      millisecond: n
    };
  }
  function untick() {
    return tick(dec);
  }

  function Period(start, end) {
    this.start = start;
    this.end = end;
  }

  function from$4(_ref) {
    var start = _ref.start,
        end = _ref.end;
    return new Period(start, end);
  }

  function emptyPeriod() {
    return new Period();
  }
  function period1(obj$$1) {
    return period2(IMergeable.merge(obj$$1, sod()), IMergeable.merge(obj$$1, eod()));
  }

  function period2(start, end) {
    //end could be a duration (e.g. `minutes(30)`).
    var pd = new Period(start, end == null || isDate(end) ? end : add$1(start, end));

    if (!(pd.start == null || isDate(pd.start))) {
      throw new Error("Invalid start of period.");
    }

    if (!(pd.end == null || isDate(pd.end))) {
      throw new Error("Invalid end of period.");
    }

    if (pd.start != null && pd.end != null && pd.start > pd.end) {
      throw new Error("Period bounds must be chronological.");
    }

    return pd;
  }

  var period = overload(emptyPeriod, period1, period2);
  Period.from = from$4;
  Period.create = period;
  Period.prototype[_Symbol.toStringTag] = "Period";

  function Benchmark(operation, result, period$$1, duration) {
    this.operation = operation;
    this.result = result;
    this.period = period$$1;
    this.duration = duration;
  }

  function benchmark1(operation) {
    var start = new Date();
    return Promise$1__default.resolve(operation()).then(function (result) {
      var end = new Date();
      return new Benchmark(operation, result, period(start, end), end - start);
    });
  }

  function benchmark2(n, operation) {
    return benchmark3(n, operation, []).then(function (xs) {
      return sort(asc(duration), xs);
    }).then(function (xs) {
      return Object.assign({
        source: xs,
        operation: ISeq.first(xs).operation
      }, measure(mapa$1(duration, xs)));
    });
  }

  function benchmark3(n, operation, benchmarked) {
    return n ? benchmark1(operation).then(function (bm) {
      return benchmark3(n - 1, operation, benchmarked.concat(bm));
    }) : benchmarked;
  }

  var benchmark = overload(null, benchmark1, benchmark2);

  function duration(x) {
    return x.duration;
  }

  function race1(operations) {
    return race2(10, operations);
  }

  function race2(n, operations) {
    return race3(n, operations, []).then(function (measures) {
      return sort(asc(average$1), asc(most$1), measures);
    });
  }

  function race3(n, operations, measures) {
    return Promise$1__default.all([measures, benchmark(n, ISeq.first(operations))]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          xs = _ref2[0],
          x = _ref2[1];

      var measures = xs.concat(x);
      return INext.next(operations) ? race3(n, INext.next(operations), measures) : measures;
    });
  }

  var race = overload(null, race1, race2, race3);

  function average$1(x) {
    return x.average;
  }

  function most$1(x) {
    return x.most;
  }

  function start$2(self) {
    return IBounds.start(self.period);
  }

  function end$2(self) {
    return IBounds.start(self.period);
  }

  var behaveAsBenchmark = does(implement(IBounds, {
    start: start$2,
    end: end$2
  }));

  behaveAsBenchmark(Benchmark);

  function date7(year, month, day, hour, minute, second, millisecond) {
    return new Date(year, month || 0, day || 1, hour || 0, minute || 0, second || 0, millisecond || 0);
  }

  var create = constructs(Date);
  var date = overload(create, create, date7);
  Date.prototype[_Symbol.toStringTag] = "Date";
  Date.create = create;

  function Duration(units) {
    this.units = units;
  }

  function valueOf() {
    var units = this.units;
    return (units.year || 0) * 1000 * 60 * 60 * 24 * 365.25 + (units.month || 0) * 1000 * 60 * 60 * 24 * 30.4375 + (units.day || 0) * 1000 * 60 * 60 * 24 + (units.hour || 0) * 1000 * 60 * 60 + (units.minute || 0) * 1000 * 60 + (units.second || 0) * 1000 + (units.millisecond || 0);
  }

  function from$5(obj$$1) {
    return new Duration(Object.assign({}, obj$$1));
  }

  function unit(key) {
    return function (n) {
      return new Duration(IAssociative.assoc({}, key, n));
    };
  }

  var years = unit("year");
  var months = unit("month");
  var days = unit("day");
  var hours = unit("hour");
  var minutes = unit("minute");
  var seconds = unit("second");
  var milliseconds = unit("millisecond");
  var duration$2 = overload(null, branch(isNumber, milliseconds, constructs(Duration)), function (start, end) {
    return milliseconds(end - start);
  });
  var weeks = comp(days, function (_arg) {
    return mult(_arg, 7);
  });
  Duration.prototype[_Symbol.toStringTag] = "Duration";
  Duration.prototype.valueOf = valueOf;
  Duration.create = duration$2;
  Duration.from = from$5;
  Duration.units = ["year", "month", "day", "hour", "minute", "second", "millisecond"];

  function reducekv$7(self, xf, init) {
    return IReduce.reduce(keys$5(self), function (memo, key) {
      return xf(memo, key, ILookup.lookup(self, key));
    }, init);
  }

  var merge$1 = partial(mergeWith, add$1);

  function mult$2(self, n) {
    return IFunctor.fmap(self, function (value) {
      return value * n;
    });
  }

  function fmap$4(self, f) {
    return new self.constructor(IKVReduce$1.reducekv(self, function (memo, key, value) {
      return IAssociative.assoc(memo, key, f(value));
    }, {}));
  }

  function keys$5(self) {
    return IMap.keys(self.units);
  }

  function dissoc$2(self, key) {
    return new self.constructor(IMap.dissoc(self.units, key));
  }

  function lookup$5(self, key) {
    if (!IInclusive$1.includes(Duration.units, key)) {
      throw new Error("Invalid unit.");
    }

    return ILookup.lookup(self.units, key);
  }

  function contains$5(self, key) {
    return IAssociative.contains(self.units, key);
  }

  function assoc$5(self, key, value) {
    if (!IInclusive$1.includes(Duration.units, key)) {
      throw new Error("Invalid unit.");
    }

    return new self.constructor(IAssociative.assoc(self.units, key, value));
  }

  function divide$1(a, b) {
    return a.valueOf() / b.valueOf();
  }

  var behaveAsDuration = does(implement(IKVReduce$1, {
    reducekv: reducekv$7
  }), implement(IAddable, {
    add: merge$1
  }), implement(IMergeable, {
    merge: merge$1
  }), implement(IFunctor, {
    fmap: fmap$4
  }), implement(IAssociative, {
    assoc: assoc$5,
    contains: contains$5
  }), implement(ILookup, {
    lookup: lookup$5
  }), implement(IMap, {
    keys: keys$5,
    dissoc: dissoc$2
  }), implement(IDivisible, {
    divide: divide$1
  }), implement(IMultipliable, {
    mult: mult$2
  }), implement(ICoerceable, {
    toDuration: identity
  }));

  behaveAsDuration(Duration);

  function _add(self, other) {
    return mergeWith(add$1, self, isNumber(other) ? days(other) : other);
  }

  function lookup$6(self, key) {
    switch (key) {
      case "year":
        return self.getFullYear();

      case "month":
        return self.getMonth();

      case "day":
        return self.getDate();

      case "hour":
        return self.getHours();

      case "minute":
        return self.getMinutes();

      case "second":
        return self.getSeconds();

      case "millisecond":
        return self.getMilliseconds();
    }
  }

  function InvalidKeyError(key, target) {
    this.key = key;
    this.target = target;
  }

  function contains$6(self, key) {
    return keys$6(self).indexOf(key) > -1;
  }

  function keys$6(self) {
    return ["year", "month", "day", "hour", "minute", "second", "millisecond"];
  }

  function vals$2(self) {
    return IReduce.reduce(keys$6(self), function (memo, key) {
      memo.push(ILookup.lookup(self, key));
      return memo;
    }, []);
  }

  function conj$5(self, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return assoc$6(self, key, value);
  } //the benefit of exposing internal state as a map is assocIn and updateIn


  function assoc$6(self, key, value) {
    var dt = new Date(self.valueOf());

    switch (key) {
      case "year":
        dt.setFullYear(value);
        break;

      case "month":
        dt.setMonth(value);
        break;

      case "day":
        dt.setDate(value);
        break;

      case "hour":
        dt.setHours(value);
        break;

      case "minute":
        dt.setMinutes(value);
        break;

      case "second":
        dt.setSeconds(value);
        break;

      case "millisecond":
        dt.setMilliseconds(value);
        break;

      default:
        throw new InvalidKeyError(key, self);
    }

    return dt;
  }

  function clone$3(self) {
    return new Date(self.valueOf());
  }

  function equiv$5(self, other) {
    return other != null && IDeref$1.deref(self) === IDeref$1.deref(other);
  }

  function compare$4(self, other) {
    return other == null ? -1 : IDeref$1.deref(self) - IDeref$1.deref(other);
  }

  function reduce$10(self, xf, init) {
    return IReduce.reduce(keys$6(self), function (memo, key) {
      var value = ILookup.lookup(self, key);
      return xf(memo, [key, value]);
    }, init);
  }

  function reducekv$8(self, xf, init) {
    return reduce$10(self, function (memo, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      return xf(memo, key, value);
    }, init);
  }

  function deref$2(self) {
    return self.valueOf();
  }

  var behaveAsDate = does(implement(IAddable, {
    add: _add
  }), implement(IDeref$1, {
    deref: deref$2
  }), implement(IBounds, {
    start: identity,
    end: identity
  }), implement(ISeqable, {
    seq: identity
  }), implement(IReduce, {
    reduce: reduce$10
  }), implement(IKVReduce$1, {
    reducekv: reducekv$8
  }), implement(IEquiv, {
    equiv: equiv$5
  }), implement(IMap, {
    keys: keys$6,
    vals: vals$2
  }), implement(IComparable, {
    compare: compare$4
  }), implement(ICollection, {
    conj: conj$5
  }), implement(IAssociative, {
    assoc: assoc$6,
    contains: contains$6
  }), implement(ILookup, {
    lookup: lookup$6
  }), implement(ICloneable, {
    clone: clone$3
  }));

  behaveAsDate(Date);

  function error(message) {
    return new Error(message);
  }
  Error.from = error;
  function isError(self) {
    return self && self instanceof Error;
  }

  function fork$2(self, reject, resolve) {
    return reject(self);
  }

  var behaveAsError = does(implement(IForkable, {
    fork: fork$2
  }), implement(IFunctor, {
    fmap: identity
  }));

  behaveAsError(Error);

  function Fluent(value) {
    this.value = value;
  }

  function fluent1(value) {
    return new Fluent(value);
  }

  var fluent = overload(null, fluent1, partial(thrush, fluent1));

  function fmap$5(self, f) {
    return fluent(f(self.value) || self.value);
  }

  function deref$3(self) {
    return self.value;
  }

  var behaveAsFluent = does(implement(IDeref$1, {
    deref: deref$3
  }), implement(IFunctor, {
    fmap: fmap$5
  }));

  behaveAsFluent(Fluent);

  function FiniteStateMachine(state, transitions) {
    this.state = state;
    this.transitions = transitions;
  }
  function fsm(state, transitions) {
    return new FiniteStateMachine(state, transitions);
  }

  var keys$7 = IMap.keys;
  var vals$3 = IMap.vals;

  function dissocN(obj$$1) {
    for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      keys[_key - 1] = arguments[_key];
    }

    return IReduce.reduce(keys, IMap.dissoc, obj$$1);
  }

  var dissoc$3 = overload(null, identity, IMap.dissoc, dissocN);

  function equiv$6(self, other) {
    return state(self) === state(other) && self.transitions === other.transitions;
  }

  function state(self) {
    return self.state;
  }

  function transitions(self) {
    return keys$7(self.transitions[self.state]);
  }

  function transition(self, event) {
    var _ref = self.transitions;
    return maybe(self.transitions, function (_arg) {
      return getIn(_arg, [self.state, event]);
    }, function (_arg2) {
      return fsm(_arg2, _ref);
    }) || self;
  }

  var behaveAsFiniteStateMachine = does(implement(IEquiv, {
    equiv: equiv$6
  }), implement(IStateMachine, {
    state: state,
    transition: transition,
    transitions: transitions
  }));

  behaveAsFiniteStateMachine(FiniteStateMachine);

  function GUID(id) {
    this.id = id;
  }
  GUID.prototype[_Symbol.toStringTag] = "GUID";

  GUID.prototype.toString = function () {
    return this.id;
  };

  function s4() {
    return Math.floor((1 + rand()) * 0x10000).toString(16).substring(1);
  }

  function guid1(id) {
    return new GUID(id);
  }

  function guid0() {
    return guid1(s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
  }

  var guid = overload(guid0, guid1);
  function isGUID(self) {
    return self && self.constructor === GUID;
  }

  function equiv$7(self, other) {
    return other && other.constructor === self.constructor && self.id === other.id;
  }

  var behaveAsGuid = does(implement(IEquiv, {
    equiv: equiv$7
  }));

  behaveAsGuid(GUID);

  function count$6(self) {
    return self.obj.length;
  }

  function nth$4(self, idx) {
    return self.obj[idx];
  }

  function first$8(self) {
    return nth$4(self, 0);
  }

  function rest$8(self) {
    return next$5(self) || emptyList();
  }

  function next$5(self) {
    return count$6(self) > 1 ? indexedSeq(self, 1) : null;
  }

  function seq$5(self) {
    return count$6(self) ? self : null;
  }

  function includes$4(self, value) {
    return !!some(function (x) {
      return x === value;
    }, self);
  }

  var behaveAsIndexed = does(iterable, implement(ISequential), implement(IInclusive$1, {
    includes: includes$4
  }), implement(IIndexed, {
    nth: nth$4
  }), implement(ILookup, {
    lookup: nth$4
  }), implement(INext, {
    next: next$5
  }), implement(ICoerceable, {
    toArray: Array.from
  }), implement(ISeq, {
    first: first$8,
    rest: rest$8
  }), implement(ISeqable, {
    seq: seq$5
  }), implement(ICounted, {
    count: count$6
  }));

  behaveAsIndexed(Indexed);

  function Just(value) {
    this.value = value;
  }

  function just1(value) {
    return new Just(value);
  }

  var just = overload(null, just1, partial(thrush, just1));
  function isJust(self) {
    return self instanceof Just;
  }

  function fmap$6(self, f) {
    return just(f(self.value));
  }

  function otherwise$1(self, other) {
    return self.value;
  }

  function fork$3(self, reject, resolve) {
    return resolve(self.value);
  }

  function deref$4(self) {
    return self.value;
  }

  var behaveAsJust = does(implement(IDeref$1, {
    deref: deref$4
  }), implement(IForkable, {
    fork: fork$3
  }), implement(IOtherwise, {
    otherwise: otherwise$1
  }), implement(IFunctor, {
    fmap: fmap$6
  }));

  behaveAsJust(Just);

  function Lens(root, path) {
    this.root = root;
    this.path = path;
  }
  function lens(root, path) {
    return new Lens(root, path || []);
  }

  function from$6(_ref) {
    var root = _ref.root,
        path = _ref.path;
    return lens(root, path);
  }

  Lens.create = lens;
  Lens.from = from$6;

  var reverse$3 = IReversible.reverse;

  var count$7 = ICounted.count;

  var path = IPath.path;

  function downward(f) {
    return function down(self) {
      var xs = f(self),
          ys = mapcat(down, xs);
      return concat(xs, ys);
    };
  }
  function upward(f) {
    return function up(self) {
      var other = f(self);
      return other ? cons(other, up(other)) : emptyList();
    };
  }
  var root = IHierarchy.root;
  var parent = IHierarchy.parent;
  var parents = IHierarchy.parents;
  var closest = IHierarchy.closest;
  var ancestors = IHierarchy.parents;
  var children = IHierarchy.children;
  var descendants = IHierarchy.descendants;
  var nextSibling = IHierarchy.nextSibling;
  var prevSibling = IHierarchy.prevSibling;
  var nextSiblings = IHierarchy.nextSiblings;
  var prevSiblings = IHierarchy.prevSiblings;
  var siblings = IHierarchy.siblings;
  function leaves(self) {
    return remove$1(comp(count$7, children), descendants(self));
  }

  var _ref$1 = juxt(path, deref$1);

  var asLeaves = comp(function (_arg) {
    return map(_ref$1, _arg);
  }, leaves, lens);

  function path$1(self) {
    return self.path;
  }

  function deref$5(self) {
    return getIn(self.root, self.path);
  }

  function conj$6(self, value) {
    return swap(self, function (_arg) {
      return conj(_arg, value);
    });
  }

  function lookup$7(self, key) {
    return self.constructor.create(self.root, conj(self.path, key));
  }

  function assoc$7(self, key, value) {
    return swap(self, function (_arg2) {
      return IAssociative.assoc(_arg2, key, value);
    });
  }

  function contains$7(self, key) {
    return includes(keys$8(self), key);
  }

  function dissoc$4(self, key) {
    return swap(self, function (_arg3) {
      return IMap.dissoc(_arg3, key);
    });
  }

  function reset(self, value) {
    return self.constructor.create(assocIn(self.root, self.path, value), self.path);
  }

  function swap(self, f) {
    return self.constructor.create(updateIn(self.root, self.path, f), self.path);
  }

  function root$1(self) {
    return self.constructor.create(self.root);
  }

  function children$1(self) {
    return map(function (key) {
      return self.constructor.create(self.root, conj(self.path, key));
    }, keys$8(self));
  }

  function keys$8(self) {
    var value = deref$5(self);
    return satisfies$1(IMap, value) ? IMap.keys(value) : emptyList();
  }

  function vals$4(self) {
    var value = deref$5(self);
    return map(function (_arg4) {
      return get(value, _arg4);
    }, keys$8(self));
  }

  function siblings$1(self) {
    var p = parent$1(self),
        ctx = toArray(butlast(self.path)),
        key = last(self.path);
    return map(function (key) {
      return self.constructor.create(self.root, conj(ctx, key));
    }, remove$1(function (k) {
      return k === key;
    }, p ? keys$8(p) : []));
  }

  function prevSiblings$1(self) {
    var p = parent$1(self),
        ctx = toArray(butlast(self.path)),
        key = last(self.path);
    return map(function (key) {
      return self.constructor.create(self.root, conj(ctx, key));
    }, reverse$3(toArray(take(1, takeWhile(function (k) {
      return k !== key;
    }, p ? keys$8(p) : [])))));
  }

  function nextSiblings$1(self) {
    var p = parent$1(self),
        ctx = toArray(butlast(self.path)),
        key = last(self.path);
    return map(function (key) {
      return self.constructor.create(self.root, conj(ctx, key));
    }, drop(1, dropWhile(function (k) {
      return k !== key;
    }, p ? keys$8(p) : [])));
  }

  var prevSibling$1 = comp(first, prevSiblings$1);
  var nextSibling$1 = comp(first, nextSiblings$1);

  function parent$1(self) {
    return seq(self.path) ? self.constructor.create(self.root, butlast(self.path)) : null;
  }

  function parents$1(self) {
    return lazySeq(function () {
      var p = parent$1(self);
      return p ? cons(p, parents$1(p)) : emptyList();
    });
  }

  function closest$1(self, pred) {
    return locate$1(cons(self, parents$1(self)), comp(pred, deref$5));
  }

  var descendants$1 = downward(children$1);
  var behaveAsLens = does(implement(IPath, {
    path: path$1
  }), implement(ICollection, {
    conj: conj$6
  }), implement(ILookup, {
    lookup: lookup$7
  }), implement(IAssociative, {
    assoc: assoc$7,
    contains: contains$7
  }), implement(IMap, {
    keys: keys$8,
    vals: vals$4,
    dissoc: dissoc$4
  }), implement(ISwap, {
    swap: swap
  }), implement(IReset, {
    reset: reset
  }), implement(IHierarchy, {
    root: root$1,
    children: children$1,
    parents: parents$1,
    parent: parent$1,
    closest: closest$1,
    descendants: descendants$1,
    siblings: siblings$1,
    nextSiblings: nextSiblings$1,
    nextSibling: nextSibling$1,
    prevSiblings: prevSiblings$1,
    prevSibling: prevSibling$1
  }), implement(IDeref$1, {
    deref: deref$5
  }));

  behaveAsLens(Lens);

  function first$9(self) {
    return self.head;
  }

  function rest$9(self) {
    return self.tail;
  }

  var behaveAsList = does(behaveAsLazySeq, implement(ISeqable, {
    seq: identity
  }), implement(ISeq, {
    first: first$9,
    rest: rest$9
  }));

  behaveAsList(List);

  function fmap$7(self, f) {
    return self.value == null ? self : maybe(f(self.value));
  }

  function otherwise$2(self, other) {
    return self.value == null ? other : self.value;
  }

  function fork$4(self, reject, resolve) {
    return resolve(self.value == null ? null : self.value);
  }

  function deref$6(self) {
    return self.value == null ? null : self.value;
  }

  var behaveAsMaybe = does(implement(IDeref$1, {
    deref: deref$6
  }), implement(IForkable, {
    fork: fork$4
  }), implement(IOtherwise, {
    otherwise: otherwise$2
  }), implement(IFunctor, {
    fmap: fmap$7
  }));

  behaveAsMaybe(Maybe);

  function isObject(self) {
    return self && self.constructor === Object;
  }
  function emptyObject() {
    return {};
  }

  var empty$1 = IEmptyableCollection.empty;

  var emptied = branch(satisfies$1(IEmptyableCollection), empty$1, emptyObject);
  function juxtVals(self, value) {
    return IKVReduce$1.reducekv(self, function (memo, key, f) {
      return IAssociative.assoc(memo, key, isFunction(f) ? f(value) : f);
    }, emptied(self));
  }
  function selectKeys(self, keys) {
    return IReduce.reduce(keys, function (memo, key) {
      return IAssociative.assoc(memo, key, ILookup.lookup(self, key));
    }, emptied(self));
  }
  function removeKeys(self, keys) {
    return IKVReduce$1.reducekv(self, function (memo, key, value) {
      return IInclusive$1.includes(keys, key) ? memo : IAssociative.assoc(memo, key, value);
    }, emptied(self));
  }
  function mapKeys(self, f) {
    return IKVReduce$1.reducekv(self, function (memo, key, value) {
      return IAssociative.assoc(memo, f(key), value);
    }, emptied(self));
  }

  function mapVals2(self, f) {
    return IKVReduce$1.reducekv(self, function (memo, key, value) {
      return IAssociative.assoc(memo, key, f(value));
    }, self);
  }

  function mapVals3(init, f, pred) {
    return IReduce.reduce(IMap.keys(init), function (memo, key) {
      return pred(key) ? IAssociative.assoc(memo, key, f(ILookup.lookup(memo, key))) : memo;
    }, init);
  }

  var mapVals = overload(null, null, mapVals2, mapVals3);

  function defaults2(self, defaults) {
    return IKVReduce$1.reducekv(self, IAssociative.assoc, defaults);
  }

  var defaults = overload(null, null, defaults2, reducing(defaults2));
  function compile(self) {
    return isFunction(self) ? self : function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return apply$1(IFn.invoke, self, args);
    };
  }

  var keys$9 = Object.keys;
  var vals$5 = Object.values;
  Object.from = ICoerceable.toObject;

  function fill(self, params) {
    return IKVReduce$1.reducekv(self, function (memo, key, value) {
      var _value;

      return IAssociative.assoc(memo, key, (_value = value, branch(isString, function (_arg) {
        return ITemplate.fill(_arg, params);
      }, isObject, function (_arg2) {
        return fill(_arg2, params);
      }, identity)(_value)));
    }, {});
  }

  function merge$2() {
    for (var _len = arguments.length, maps = new Array(_len), _key = 0; _key < _len; _key++) {
      maps[_key] = arguments[_key];
    }

    return IReduce.reduce(maps, function (memo, map$$1) {
      return IReduce.reduce(ISeqable.seq(map$$1), function (memo, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        memo[key] = value;
        return memo;
      }, memo);
    }, {});
  }

  function blank$3(self) {
    return keys$9(self).length === 0;
  }

  function compact$1(self) {
    return IKVReduce$1.reducekv(self, function (memo, key, value) {
      return value == null ? memo : IAssociative.assoc(memo, key, value);
    }, {});
  }

  function matches(self, template) {
    return IKVReduce$1.reducekv(template, function (memo, key, value) {
      return memo ? IEquiv.equiv(ILookup.lookup(self, key), value) : reduced$1(memo);
    }, true);
  }

  function yank$3(self, entry) {
    var key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);

    if (includes$5(self, entry)) {
      var result = clone$4(self);
      delete result[key];
      return result;
    } else {
      return self;
    }
  }

  function compare$5(self, other) {
    //assume like keys, otherwise use your own comparator!
    return IEquiv.equiv(self, other) ? 0 : satisfies$1(IDescriptive, other) ? IReduce.reduce(IMap.keys(self), function (memo, key) {
      return memo == 0 ? IComparable.compare(ILookup.lookup(self, key), ILookup.lookup(other, key)) : reduced$1(memo);
    }, 0) : -1;
  }

  function conj$7(self, entry) {
    var key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
    var result = ICloneable.clone(self);
    result[key] = val;
    return result;
  }

  function equiv$8(self, other) {
    return self === other ? true : satisfies$1(IDescriptive, other) && ICounted.count(IMap.keys(self)) === ICounted.count(IMap.keys(other)) && IReduce.reduce(IMap.keys(self), function (memo, key) {
      return memo ? IEquiv.equiv(ILookup.lookup(self, key), ILookup.lookup(other, key)) : reduced$1(memo);
    }, true);
  }

  function find$3(self, key) {
    return contains$8(self, key) ? [key, lookup$8(self, key)] : null;
  }

  function includes$5(self, entry) {
    var key = IMapEntry.key(entry),
        val = IMapEntry.val(entry);
    return self[key] === val;
  }

  function lookup$8(self, key) {
    return self[key];
  }

  function first$10(self) {
    var key = ISeq.first(keys$9(self));
    return key ? [key, lookup$8(self, key)] : null;
  }

  function rest$10(self) {
    return next$6(self) || {};
  }

  function next2(self, keys) {
    if (ISeqable.seq(keys)) {
      return lazySeq(function () {
        var key = ISeq.first(keys);
        return cons([key, lookup$8(self, key)], next2(self, INext.next(keys)));
      });
    } else {
      return null;
    }
  }

  function next$6(self) {
    return next2(self, INext.next(keys$9(self)));
  }

  function dissoc$5(self, key) {
    if (IAssociative.contains(self, key)) {
      var result = clone$4(self);
      delete result[key];
      return result;
    } else {
      return self;
    }
  }

  function assoc$8(self, key, value) {
    if (ILookup.lookup(self, key) === value) {
      return self;
    } else {
      var result = clone$4(self);
      result[key] = value;
      return result;
    }
  }

  function contains$8(self, key) {
    return self.hasOwnProperty(key);
  }

  function seq$6(self) {
    if (!count$8(self)) return null;
    return map(function (key) {
      return [key, lookup$8(self, key)];
    }, keys$9(self));
  }

  function count$8(self) {
    return keys$9(self).length;
  }

  function clone$4(self) {
    return Object.assign({}, self);
  }

  function reduce$11(self, xf, init) {
    return IReduce.reduce(keys$9(self), function (memo, key) {
      return xf(memo, [key, lookup$8(self, key)]);
    }, init);
  }

  function reducekv$9(self, xf, init) {
    return IReduce.reduce(keys$9(self), function (memo, key) {
      return xf(memo, key, lookup$8(self, key));
    }, init);
  }

  function toArray$4(self) {
    return reduce$11(self, function (memo, pair) {
      memo.push(pair);
      return memo;
    }, []);
  }

  var behaveAsObject = does(iequiv, implement(IDescriptive), implement(ITemplate, {
    fill: fill
  }), implement(IBlankable, {
    blank: blank$3
  }), implement(IMergeable, {
    merge: merge$2
  }), implement(ICompactable, {
    compact: compact$1
  }), implement(IEquiv, {
    equiv: equiv$8
  }), implement(ICoerceable, {
    toArray: toArray$4,
    toObject: identity
  }), implement(IFind, {
    find: find$3
  }), implement(IYankable, {
    yank: yank$3
  }), implement(IMatchable, {
    matches: matches
  }), implement(IInclusive$1, {
    includes: includes$5
  }), implement(ICollection, {
    conj: conj$7
  }), implement(ICloneable, {
    clone: clone$4
  }), implement(IComparable, {
    compare: compare$5
  }), implement(IReduce, {
    reduce: reduce$11
  }), implement(IKVReduce$1, {
    reducekv: reducekv$9
  }), implement(IMap, {
    dissoc: dissoc$5,
    keys: keys$9,
    vals: vals$5
  }), implement(IFn, {
    invoke: lookup$8
  }), implement(ISeq, {
    first: first$10,
    rest: rest$10
  }), implement(INext, {
    next: next$6
  }), implement(ILookup, {
    lookup: lookup$8
  }), implement(IEmptyableCollection, {
    empty: emptyObject
  }), implement(IAssociative, {
    assoc: assoc$8,
    contains: contains$8
  }), implement(ISeqable, {
    seq: seq$6
  }), implement(ICounted, {
    count: count$8
  }));

  behaveAsObject(Object);

  function Okay(value) {
    this.value = value;
  }
  function okay(x) {
    return isError(x) ? x : new Okay(x);
  }
  function isOkay(x) {
    return x instanceof Okay;
  }

  function fmap$8(self, f) {
    try {
      return okay(f(self.value));
    } catch (ex) {
      return isError(ex) ? ex : new Error(ex);
    }
  }

  function fork$5(self, reject, resolve) {
    return resolve(self);
  }

  var behaveAsOkay = does(implement(IForkable, {
    fork: fork$5
  }), implement(IFunctor, {
    fmap: fmap$8
  }));

  behaveAsOkay(Okay);

  function AssociativeSubset(obj, keys) {
    this.obj = obj;
    this.keys = keys;
  }
  function associativeSubset(obj, keys) {
    return ISeqable.seq(keys) ? new AssociativeSubset(obj, keys) : {};
  }
  function isAssociativeSubset(self) {
    return self.constructor === AssociativeSubset;
  }

  function toObject$3(self) {
    return into({}, self);
  }

  function find$4(self, key) {
    return IInclusive.includes(IMap.keys(self), key) ? [key, ILookup.lookup(self.obj, key)] : null;
  }

  function lookup$9(self, key) {
    return IInclusive.includes(IMap.keys(self), key) ? self.obj[key] : null;
  }

  function dissoc$6(self, key) {
    return new self.constructor(self, remove$1(function (k) {
      return k === key;
    }, self.keys));
  }

  function keys$10(self) {
    return self.keys;
  }

  function vals$6(self) {
    var key = ISeq.first(self.keys);
    return lazySeq(function () {
      return cons(lookup$9(self, key), vals$6(new self.constructor(self.obj, ISeq.rest(self.keys))));
    });
  }

  function seq$7(self) {
    var key = ISeq.first(self.keys);
    return lazySeq(function () {
      return cons([key, lookup$9(self, key)], new self.constructor(self.obj, ISeq.rest(self.keys)));
    });
  }

  function count$9(self) {
    return ICounted.count(self.keys);
  }

  function clone$5(self) {
    return toObject$3(self);
  }

  function reduce$12(self, xf, init) {
    return IReduce.reduce(keys$10(self), function (memo, key) {
      return xf(memo, [key, lookup$9(self, key)]);
    }, init);
  }

  function reducekv$10(self, xf, init) {
    return IReduce.reduce(keys$10(self), function (memo, key) {
      return xf(memo, key, lookup$9(self, key));
    }, init);
  }

  var behaveAsAssociativeSubset = does(iequiv, implement(IDescriptive), implement(ICoerceable, {
    toObject: toObject$3
  }), implement(IFind, {
    find: find$4
  }), implement(IMap, {
    dissoc: dissoc$6,
    keys: keys$10,
    vals: vals$6
  }), implement(IReduce, {
    reduce: reduce$12
  }), implement(IKVReduce$1, {
    reducekv: reducekv$10
  }), implement(ICloneable, {
    clone: clone$5
  }), implement(IEmptyableCollection, {
    empty: emptyObject
  }), implement(IFn, {
    invoke: lookup$9
  }), implement(ILookup, {
    lookup: lookup$9
  }), implement(ISeqable, {
    seq: seq$7
  }), implement(ICounted, {
    count: count$9
  }));

  behaveAsAssociativeSubset(AssociativeSubset);

  function Recurrence(start, end, step, direction) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.direction = direction;
  }

  function from$7(_ref) {
    var start = _ref.start,
        end = _ref.end,
        step = _ref.step,
        direction = _ref.direction;
    return new Recurrence(start, end, step, direction);
  }

  function emptyRecurrence() {
    return new Recurrence();
  }
  function recurrence1(obj$$1) {
    return recurrence2(IMergeable.merge(obj$$1, sod()), IMergeable.merge(obj$$1, eod()));
  }

  function recurrence2(start, end) {
    return recurrence3(start, end, days(end == null || start <= end ? 1 : -1));
  }

  var recurrence3 = steps(Recurrence, isDate);

  function recurrence4(start, end, step, f) {
    var pred = end == null ? constantly(true) : directed(start, end) > 0 ? function (dt) {
      return compare$3(start, dt) <= 0;
    } : directed(start, end) < 0 ? function (dt) {
      return compare$3(start, dt) >= 0;
    } : constantly(true);
    return filter$1(pred, f(recurrence3(start, end, step)));
  }

  var recurrence = overload(emptyRecurrence, recurrence1, recurrence2, recurrence3, recurrence4);
  Recurrence.from = from$7;
  Recurrence.create = recurrence;
  Recurrence.prototype[_Symbol.toStringTag] = "Recurrence";

  function split2(self, step) {
    return map(function (_arg) {
      return period(_arg, step);
    }, recurrence(IBounds.start(self), IBounds.end(self), step));
  }

  function split3(self, step, n) {
    return take(n, split2(self, step));
  }

  var split = overload(null, null, split2, split3);

  function add$2(self, dur) {
    var _ref, _self;

    return IBounds.end(self) ? new self.constructor(IBounds.start(self), (_ref = (_self = self, IBounds.end(_self)), function (_arg2) {
      return IAddable.add(_arg2, dur);
    }(_ref))) : self;
  }

  function merge$3(self, other) {
    return other == null ? self : new self.constructor(min(IBounds.start(self), IBounds.start(other)), max(IBounds.end(other), IBounds.end(other)));
  }

  function divide$2(self, step) {
    return IDivisible.divide(ICoerceable.toDuration(self), step);
  }

  function start$3(self) {
    return self.start;
  }

  function end$3(self) {
    return self.end;
  }

  function includes$6(self, dt) {
    return dt != null && (self.start == null || IComparable.compare(dt, self.start) >= 0) && (self.end == null || IComparable.compare(dt, self.end) < 0);
  }

  function equiv$9(self, other) {
    return other != null && IEquiv.equiv(self.start, other.start) && IEquiv.equiv(self.end, other.end);
  }

  function toDuration$1(self) {
    return self.end == null || self.start == null ? duration$2(Number.POSITIVE_INFINITY) : duration$2(self.end - self.start);
  }

  function compare$6(self, other) {
    //TODO test with sort of periods
    return IComparable.compare(other.start, self.start) || IComparable.compare(other.end, self.end);
  }

  var behaveAsPeriod = does(emptyable, implement(ISplittable, {
    split: split
  }), implement(IAddable, {
    add: add$2
  }), implement(IMergeable, {
    merge: merge$3
  }), implement(IDivisible, {
    divide: divide$2
  }), implement(IComparable, {
    compare: compare$6
  }), implement(ICoerceable, {
    toDuration: toDuration$1
  }), implement(IInclusive$1, {
    includes: includes$6
  }), implement(IBounds, {
    start: start$3,
    end: end$3
  }), implement(IEquiv, {
    equiv: equiv$9
  }));

  behaveAsPeriod(Period);

  function fork2(self, resolve) {
    return IForkable.fork(self, noop, resolve);
  }

  var fork$6 = overload(null, null, fork2, IForkable.fork);

  function awaits(f) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (detect(isPromise, args)) {
        return fmap$3(Promise$1__default.all(args), function (args) {
          return f.apply(this, args);
        });
      } else {
        return f.apply(this, args);
      }
    };
  }
  function fromTask(task) {
    return new Promise$1__default(function (resolve, reject) {
      fork$6(task, reject, resolve);
    });
  }
  Promise$1__default.fromTask = fromTask;

  function fmap$9(self, resolve) {
    return self.then(resolve);
  }

  function fork$7(self, reject, resolve) {
    return self.then(resolve, reject);
  }

  function otherwise$3(self, other) {
    return fmap$9(self, function (value) {
      return value == null ? other : value;
    });
  }

  var behaveAsPromise = does(implement(IOtherwise, {
    otherwise: otherwise$3
  }), implement(IForkable, {
    fork: fork$7
  }), implement(IFunctor, {
    fmap: fmap$9
  }));

  behaveAsPromise(Promise$1__default);

  function seq$8(self) {
    return IEquiv.equiv(self.start, self.end) || self.step == null && self.direction == null && self.start == null && self.end == null ? null : self;
  }

  function first$11(self) {
    return self.end == null ? self.start : IComparable.compare(self.start, self.end) * self.direction < 0 ? self.start : null;
  }

  function rest$11(self) {
    return INext.next(self) || new self.constructor(self.end, self.end, self.step, self.direction);
  }

  function next$7(self) {
    if (!seq$8(self)) return null;
    var stepped = IAddable.add(self.start, self.step);
    return self.end == null || IComparable.compare(stepped, self.end) * self.direction < 0 ? new self.constructor(stepped, self.end, self.step, self.direction) : null;
  }

  function equiv$10(self, other) {
    return other != null && IEquiv.equiv(self.start, other.start) && IEquiv.equiv(self.end, other.end) && IEquiv.equiv(self.step, other.step);
  }

  function reduce$13(self, xf, init) {
    var memo = init,
        coll = seq$8(self);

    while (!isReduced(memo) && coll) {
      memo = xf(memo, ISeq.first(coll));
      coll = INext.next(coll);
    }

    return unreduced(memo);
  }

  function reducekv$11(self, xf, init) {
    var memo = init,
        coll = seq$8(self),
        n = 0;

    while (!isReduced(memo) && coll) {
      memo = xf(memo, n++, ISeq.first(coll));
      coll = INext.next(coll);
    }

    return unreduced(memo);
  }

  function toArray$5(self) {
    return reduce$13(self, function (memo, date) {
      memo.push(date);
      return memo;
    }, []);
  }

  function inverse$3(self) {
    var start = self.end,
        end = self.start,
        step = IInverse.inverse(self.step);
    return new self.constructor(start, end, step, directed(start, step));
  }

  function nth$5(self, idx) {
    return ISeq.first(drop(idx, self));
  }

  function count$10(self) {
    var n = 0,
        xs = self;

    while (ISeqable.seq(xs)) {
      n++;
      xs = ISeq.rest(xs);
    }

    return n;
  }

  function includes$7(self, value) {
    var xs = self;

    if (self.direction > 0) {
      while (ISeqable.seq(xs)) {
        var c = IComparable.compare(ISeq.first(xs), value);
        if (c === 0) return true;
        if (c > 0) break;
        xs = ISeq.rest(xs);
      }
    } else {
      while (ISeqable.seq(xs)) {
        var _c = IComparable.compare(ISeq.first(xs), value);

        if (_c === 0) return true;
        if (_c < 0) break;
        xs = ISeq.rest(xs);
      }
    }

    return false;
  }

  var behaveAsRange = does(iterable, emptyable, implement(ISequential), implement(IInverse, {
    inverse: inverse$3
  }), implement(IIndexed, {
    nth: nth$5
  }), implement(ICounted, {
    count: count$10
  }), implement(IInclusive$1, {
    includes: includes$7
  }), implement(ISeqable, {
    seq: seq$8
  }), implement(ICoerceable, {
    toArray: toArray$5
  }), implement(IReduce, {
    reduce: reduce$13
  }), implement(IKVReduce$1, {
    reducekv: reducekv$11
  }), implement(INext, {
    next: next$7
  }), implement(ISeq, {
    first: first$11,
    rest: rest$11
  }), implement(IEquiv, {
    equiv: equiv$10
  }));

  behaveAsRange(Range);

  behaveAsRange(Recurrence);

  function isRegExp(self) {
    return self.constructor === RegExp;
  }

  var test = unbind(RegExp.prototype.test);
  function reFind(re, s) {
    if (!isString(s)) {
      throw new TypeError("reFind must match against string.");
    }

    var matches = re.exec(s);

    if (matches) {
      return count$7(matches) === 1 ? first(matches) : matches;
    }
  }

  function reFindAll2(text, find) {
    var found = find(text);
    return found ? lazySeq(function () {
      return cons(found, reFindAll2(text, find));
    }) : emptyList();
  }

  function reFindAll(re, text) {
    return reFindAll2(text, function (_arg) {
      return reFind(re, _arg);
    });
  }
  function reMatches(re, s) {
    if (!isString(s)) {
      throw new TypeError("reMatches must match against string.");
    }

    var matches = re.exec(s);

    if (first(matches) === s) {
      return count$7(matches) === 1 ? first(matches) : matches;
    }
  }
  function reSeq(re, s) {
    return lazySeq(function () {
      var matchData = reFind(re, s),
          matchIdx = s.search(re),
          matchStr = matchData instanceof Array ? first(matchData) : matchData,
          postIdx = matchIdx + max(1, count$7(matchStr)),
          postMatch = s.substring(postIdx);
      return matchData ? cons(matchData, reSeq(new RegExp(re.source, re.flags), postMatch)) : emptyList();
    });
  }
  function rePattern(s) {
    if (isRegExp(s)) return s;
    if (!isString(s)) throw new TypeError("rePattern is derived from a string.");
    var found = reFind(/^\(\?([idmsux]*)\)/, s),
        prefix = get(found, 0),
        flags = get(found, 1),
        pattern = s.substring(count$7(prefix));
    return new RegExp(pattern, flags || "");
  }

  function matches$1(self, text) {
    return self.test(text);
  }

  var behaveAsRegExp = does(implement(IMatchable, {
    matches: matches$1
  }));

  behaveAsRegExp(RegExp);

  function seq$9(self) {
    return ISeqable.seq(self.items);
  }

  function toArray$6(self) {
    return ICoerceable.toArray(self.items);
  }

  function first$12(self) {
    return ISeq.first(self.items);
  }

  function rest$12(self) {
    return next$8(self) || empty$2(self);
  }

  function next$8(self) {
    var args = INext.next(self.items);
    return args ? self.constructor.from(args) : null;
  }

  function append$4(self, other) {
    return self.constructor.from(IAppendable.append(self.items, other));
  }

  function prepend$2(self, other) {
    return self.constructor.from(IPrependable.prepend(self.items, other));
  }

  function includes$8(self, name) {
    return IInclusive$1.includes(self.items, name);
  }

  function count$11(self) {
    return ICounted.count(self.items);
  }

  function empty$2(self) {
    return self.constructor.from([]);
  }

  function reduce$14(self, xf, init) {
    return IReduce.reduce(self.items, xf, init);
  }

  function construction$1(Type) {
    Type.create = Type.create || constructs(Type);

    Type.from = Type.from || function (items) {
      return Object.assign(Object.create(Type.prototype), {
        items: items
      });
    };
  }

  var behaveAsSeries = does(construction$1, iterable, implement(ISequential), implement(ICounted, {
    count: count$11
  }), implement(IInclusive$1, {
    includes: includes$8
  }), implement(IAppendable, {
    append: append$4
  }), implement(IPrependable, {
    prepend: prepend$2
  }), implement(IEmptyableCollection, {
    empty: empty$2
  }), implement(ICoerceable, {
    toArray: toArray$6
  }), implement(ISeqable, {
    seq: seq$9
  }), implement(INext, {
    next: next$8
  }), implement(IReduce, {
    reduce: reduce$14
  }), implement(ISeq, {
    first: first$12,
    rest: rest$12
  }));

  function split1(str$$1) {
    return str$$1.split("");
  }

  function split3$1(str$$1, pattern, n) {
    var parts = [];

    while (str$$1 && n !== 0) {
      var found = str$$1.match(pattern);

      if (!found || n < 2) {
        parts.push(str$$1);
        break;
      }

      var pos = str$$1.indexOf(found),
          part$$1 = str$$1.substring(0, pos);
      parts.push(part$$1);
      str$$1 = str$$1.substring(pos + found.length);
      n = n ? n - 1 : n;
    }

    return parts;
  }

  var split$1 = overload(null, split1, unbind(String.prototype.split), split3$1);

  function fill$1(self, params) {
    return IKVReduce$1.reducekv(params, function (text, key, value) {
      return replace(text, new RegExp("\\{" + key + "\\}", 'ig'), value);
    }, self);
  }

  function blank$4(self) {
    return self.trim().length === 0;
  }

  function compact$2(self) {
    return self.trim();
  }

  function compare$7(self, other) {
    return self === other ? 0 : self > other ? 1 : -1;
  }

  function conj$8(self, other) {
    return self + other;
  }

  function seq2(self, idx) {
    return idx < self.length ? lazySeq(function () {
      return cons(self[idx], seq2(self, idx + 1));
    }) : null;
  }

  function seq$10(self) {
    return seq2(self, 0);
  }

  function lookup$10(self, key) {
    return self[key];
  }

  function first$13(self) {
    return self[0] || null;
  }

  function rest$13(self) {
    return next$9(self) || "";
  }

  function next$9(self) {
    return self.substring(1) || null;
  }

  function prepend$3(self, head) {
    return head + self;
  }

  function includes$9(self, str$$1) {
    return self.indexOf(str$$1) > -1;
  }

  function toArray$7(self) {
    return self.split("");
  }

  function reduce$15(self, xf, init) {
    var memo = init;
    var coll = ISeqable.seq(self);

    while (coll && !isReduced(memo)) {
      memo = xf(memo, ISeq.first(coll));
      coll = INext.next(coll);
    }

    return unreduced(memo);
  }

  function matches$2(self, re) {
    return rePattern(re).test(self);
  }

  var behaveAsString = does(iindexed, implement(ISplittable, {
    split: split$1
  }), implement(ICompactable, {
    compact: compact$2
  }), implement(IBlankable, {
    blank: blank$4
  }), implement(ITemplate, {
    fill: fill$1
  }), implement(IMatchable, {
    matches: matches$2
  }), implement(ICollection, {
    conj: conj$8
  }), implement(IReduce, {
    reduce: reduce$15
  }), implement(ICoerceable, {
    toArray: toArray$7
  }), implement(IComparable, {
    compare: compare$7
  }), implement(IInclusive$1, {
    includes: includes$9
  }), implement(IAppendable, {
    append: conj$8
  }), implement(IPrependable, {
    prepend: prepend$3
  }), implement(IEmptyableCollection, {
    empty: emptyString
  }), implement(IFn, {
    invoke: lookup$10
  }), implement(ILookup, {
    lookup: lookup$10
  }), implement(ISeqable, {
    seq: seq$10
  }), implement(ISeq, {
    first: first$13,
    rest: rest$13
  }), implement(INext, {
    next: next$9
  }));

  behaveAsString(String);

  function Task(fork) {
    this.fork = fork;
  }
  function task(fork) {
    return new Task(fork);
  }

  function resolve(value) {
    return task(function (reject, resolve) {
      resolve(value);
    });
  }

  function reject(value) {
    return task(function (reject, resolve) {
      reject(value);
    });
  }

  Task.of = resolve;
  Task.resolve = resolve;
  Task.reject = reject;

  function fmap$10(self, f) {
    return task(function (reject, resolve) {
      self.fork(reject, comp(resolve, f));
    });
  }

  function chain(self, f) {
    return task(function (reject, resolve) {
      self.fork(reject, function (value) {
        IForkable.fork(f(value), reject, resolve);
      });
    });
  }

  function fork$8(self, reject, resolve) {
    self.fork(reject, resolve);
  }

  var behaveAsTask = does(implement(IChainable, {
    chain: chain
  }), implement(IForkable, {
    fork: fork$8
  }), implement(IFunctor, {
    fmap: fmap$10
  }));

  behaveAsTask(Task);

  function isWeakMap(self) {
    return self && self.constructor === WeakMap$1;
  }

  function weakMap1(obj$$1) {
    return new WeakMap$1(obj$$1);
  }

  function weakMap0() {
    return new WeakMap$1();
  }

  var weakMap = overload(weakMap0, weakMap1);

  function assoc$9(self, key, value) {
    return self.set(key, value);
  }

  function contains$9(self, key) {
    return self.has(key);
  }

  function lookup$11(self, key) {
    return self.get(key);
  }

  function count$12(self) {
    return self.size;
  }

  var behaveAsWeakMap = does(implement(ICloneable, {
    clone: identity
  }), implement(ICounted, {
    count: count$12
  }), implement(ILookup, {
    lookup: lookup$11
  }), implement(IAssociative, {
    assoc: assoc$9,
    contains: contains$9
  }));

  behaveAsWeakMap(WeakMap$1);

  var append$5 = overload(null, identity, IAppendable.append, reducing(IAppendable.append));

  var blank$5 = IBlankable.blank;
  function blot(self) {
    return blank$5(self) ? null : self;
  }

  var start$4 = IBounds.start;
  var end$4 = IBounds.end;

  function chronology(item) {
    var s = start$4(item),
        e = end$4(item);
    return s == null || e == null ? [s, e] : [s, e].sort(IComparable.compare);
  } //The end range value must also be the start range value of the next successive range to avoid infinitisimally small gaps.
  //As such, the end range value cannot itself be considered part of a range, for if it did that value would nonsensically belong to two successive ranges.


  function inside(sr, er, b) {
    if (b == null) {
      return false;
    }

    if (sr == null && er == null) {
      return true;
    }

    return (sr == null || IComparable.compare(b, sr) >= 0) && (er == null || IComparable.compare(b, er) < 0);
  }
  function between(a, b) {
    var _chronology = chronology(a),
        _chronology2 = _slicedToArray(_chronology, 2),
        sa = _chronology2[0],
        ea = _chronology2[1],
        _chronology3 = chronology(b),
        _chronology4 = _slicedToArray(_chronology3, 2),
        sb = _chronology4[0],
        eb = _chronology4[1];

    return inside(sa, ea, sb) && inside(sa, ea, eb);
  }
  function overlap(self, other) {
    var make = constructs(self.constructor),
        ss = start$4(self),
        es = end$4(self),
        so = start$4(other),
        eo = end$4(other),
        sn = isNil(ss) || isNil(so) ? ss || so : gt(ss, so) ? ss : so,
        en = isNil(es) || isNil(eo) ? es || eo : lt(es, eo) ? es : eo;
    return lte(sn, en) ? make(sn, en) : null;
  }

  var chain$1 = IChainable.chain;

  var clone$6 = ICloneable.clone;

  function compact$3(self) {
    return satisfies$1(ICompactable, self) ? ICompactable.compact(self) : filter$1(identity, self);
  }
  var only = unspread(compact$3);

  var inverse$4 = IInverse.inverse;

  var dispose = IDisposable.dispose;

  var divide$3 = overload(null, identity, IDivisible.divide, reducing(IDivisible.divide));

  var equiv$11 = IEquiv.equiv;

  var find$5 = IFind.find;

  var invoke$1 = IFn.invoke;

  var nth$6 = IIndexed.nth;
  var idx$3 = IIndexed.idx;

  function afterN(self) {
    var ref = self;

    for (var _len = arguments.length, els = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      els[_key - 1] = arguments[_key];
    }

    while (els.length) {
      var el = els.shift();
      IInsertable.after(ref, el);
      ref = el;
    }
  }

  var after$1 = overload(null, identity, IInsertable.after, afterN);

  function beforeN(self) {
    var ref = self;

    for (var _len2 = arguments.length, els = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      els[_key2 - 1] = arguments[_key2];
    }

    while (els.length) {
      var el = els.pop();
      IInsertable.before(ref, el);
      ref = el;
    }
  }

  var before$1 = overload(null, identity, IInsertable.before, beforeN);

  var key$2 = IMapEntry.key;
  var val$2 = IMapEntry.val;

  var matches$3 = IMatchable.matches;

  var merge$4 = overload(null, identity, IMergeable.merge, reducing(IMergeable.merge));

  var name$1 = INameable.name;

  var next$10 = INext.next;

  var otherwise$4 = IOtherwise.otherwise;

  var prepend$4 = overload(null, identity, IPrependable.prepend, reducing(IPrependable.prepend, reverse$3));

  var reset$1 = IReset.reset;

  var send = ISend.send;

  var disj = ISet.disj;
  var _ref$2 = ISet.unite;

  var union2 = function union2(_arg, _arg2) {
    return reduce(_ref$2, _arg, _arg2);
  };

  function intersection2(xs, ys) {
    return reduce(function (memo, x) {
      return includes(ys, x) ? conj(memo, x) : memo;
    }, empty$1(xs), xs);
  }

  function difference2(xs, ys) {
    return reduce(function (memo, x) {
      return includes(ys, x) ? memo : conj(memo, x);
    }, empty$1(xs), xs);
  }

  function subset(self, other) {
    return every(function (_arg3) {
      return includes(other, _arg3);
    }, self);
  }
  function superset(self, other) {
    return subset(other, self);
  }
  var unite$1 = overload(null, null, ISet.unite, reducing(ISet.unite));
  var union = overload(null, identity, union2, reducing(union2));
  var intersection = overload(null, null, intersection2, reducing(intersection2));
  var difference = overload(null, null, difference2, reducing(difference2));

  var state$1 = IStateMachine.state;
  var transition$1 = IStateMachine.transition;
  var transitions$1 = IStateMachine.transitions;

  var split$2 = ISplittable.split;

  function swap3(self, f, a) {
    return ISwap.swap(self, function (state) {
      return f(state, a);
    });
  }

  function swap4(self, f, a, b) {
    return ISwap.swap(self, function (state) {
      return f(state, a, b);
    });
  }

  function swapN(self, f, a, b, cs) {
    return ISwap.swap(self, function (state) {
      return f.apply(null, [state, a, b].concat(_toConsumableArray(cs)));
    });
  }

  var swap$1 = overload(null, null, ISwap.swap, swap3, swap4, swapN);

  var fill$2 = ITemplate.fill;
  function template(self) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return fill$2(self, args);
  }

  var serieslike = behaveAsSeries;
  var global = window;
  var numeric = function numeric(_arg) {
    return test(/^\d+$/i, _arg);
  };

  function recurs2(pd, step) {
    return recurrence(IBounds.start(pd), IBounds.end(pd), step);
  }

  var _ref$3 = days(1);

  var recurs = overload(null, function (_arg2) {
    return recurs2(_arg2, _ref$3);
  }, recurs2);
  function inclusive(self) {
    return new self.constructor(self.start, add$1(self.end, self.step), self.step, self.direction);
  }

  function cleanlyN(f) {
    try {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return f.apply(void 0, args);
    } catch (_unused) {
      return null;
    }
  }

  var cleanly = overload(null, curry(cleanlyN, 2), cleanlyN); //Like `update` but deals with private attributes not exposed via `lookup` and `assoc`.
  //Used only to define an implementation and not publicly for general purposes — an implementation detail.

  function edit(self, key, f) {
    var obj$$1 = ICloneable.clone(self);

    if (key in obj$$1) {
      obj$$1[key] = f(obj$$1[key]); //must be a mutable copy
    }

    return obj$$1;
  }
  function deconstruct(dur) {
    var memo = dur;

    for (var _len2 = arguments.length, units = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      units[_key2 - 1] = arguments[_key2];
    }

    return mapa$1(function (unit) {
      var n = fmap$3(divide$3(memo, unit), Math.floor);
      memo = subtract(memo, fmap$3(unit, constantly(n)));
      return n;
    }, units);
  }
  function toQueryString(obj$$1) {
    return just(obj$$1, function (_arg5) {
      return mapkv(function (_arg3, _arg4) {
        return str(_arg3, "=", _arg4);
      }, _arg5);
    }, function (_arg6) {
      return join("&", _arg6);
    }, function (_arg7) {
      return collapse("?", _arg7);
    });
  }
  function fromQueryString(url) {
    var params = {};
    each(function (match) {
      var key = decodeURIComponent(match[1]),
          val = decodeURIComponent(match[2]);
      params[key] = val;
    }, reFindAll(/[?&]([^=&]*)=([^=&]*)/g, url));
    return params;
  }
  function unique(xs) {
    return toArray(new Set$1(toArray(xs)));
  }
  var second$1 = branch(function (_arg8) {
    return satisfies$1(ISeq, _arg8);
  }, comp(ISeq.first, INext.next), second);
  function expands(f) {
    function expand() {
      for (var _len3 = arguments.length, contents = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        contents[_key3] = arguments[_key3];
      }

      return locate$1(contents, isFunction) ? postpone.apply(void 0, contents) : f.apply(void 0, contents);
    }

    function postpone() {
      for (var _len4 = arguments.length, contents = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        contents[_key4] = arguments[_key4];
      }

      return function (value) {
        var expanded = map(function (content) {
          return isFunction(content) ? content(value) : content;
        }, contents);
        return apply$1(expand, expanded);
      };
    }

    return expand;
  }
  function xarg(fn, n, f) {
    return function () {
      arguments[n] = f(arguments[n]);
      return fn.apply(this, arguments);
    };
  }
  function xargs(f) {
    for (var _len5 = arguments.length, fs = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      fs[_key5 - 1] = arguments[_key5];
    }

    return function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return apply$1(f, map(execute, fs, args));
    };
  }

  function filled2(f, g) {
    return function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      return ISeqable.seq(filter$1(isNil, args)) ? g.apply(void 0, args) : f.apply(void 0, args);
    };
  }

  function filled1(f) {
    return filled2(f, noop);
  }

  var filled = overload(null, filled1, filled2);
  function elapsed(self) {
    return duration$2(end(self) - start(self));
  }
  function collapse() {
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    return some(isBlank, args) ? "" : join("", args);
  }

  function isNotConstructor(f) {
    return isFunction(f) && !/^[A-Z]./.test(name$1(f));
  } //convenience for wrapping batches of functions.


  function impart(self, f) {
    //set retraction to identity to curb retraction overhead
    return reducekv(function (memo, key, value) {
      return assoc(memo, key, isNotConstructor(value) ? f(value) : value);
    }, {}, self);
  }

  function include2(self, value) {
    return toggles(function (_arg9) {
      return conj(_arg9, value);
    }, function (_arg10) {
      return yank(_arg10, value);
    }, function (_arg11) {
      return includes(_arg11, value);
    }, self);
  }

  function include3(self, value, want) {
    return toggles(function (_arg12) {
      return conj(_arg12, value);
    }, function (_arg13) {
      return yank(_arg13, value);
    }, function (_arg14) {
      return includes(_arg14, value);
    }, self, want);
  }

  var include = overload(null, null, include2, include3);
  var fmt = expands(str);
  function coalesce() {
    for (var _len9 = arguments.length, fs = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      fs[_key9] = arguments[_key9];
    }

    return function () {
      return detect(isSome, map(applying.apply(void 0, arguments), fs));
    };
  }
  function when(pred) {
    for (var _len10 = arguments.length, xs = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
      xs[_key10 - 1] = arguments[_key10];
    }

    return last(map(realize, pred ? xs : null));
  }

  var _ = /*#__PURE__*/Object.freeze({
    serieslike: serieslike,
    global: global,
    numeric: numeric,
    recurs: recurs,
    inclusive: inclusive,
    cleanly: cleanly,
    edit: edit,
    deconstruct: deconstruct,
    toQueryString: toQueryString,
    fromQueryString: fromQueryString,
    unique: unique,
    second: second$1,
    expands: expands,
    xarg: xarg,
    xargs: xargs,
    filled: filled,
    elapsed: elapsed,
    collapse: collapse,
    impart: impart,
    include: include,
    fmt: fmt,
    coalesce: coalesce,
    when: when,
    iterable: iterable,
    unbind: unbind,
    slice: slice,
    indexOf: indexOf,
    log: log,
    noop: noop,
    complement: complement,
    invokes: invokes,
    type: type,
    overload: overload,
    subj: subj,
    obj: obj,
    placeholder: placeholder,
    part: part,
    partial: partial,
    partly: partly,
    identity: identity,
    constantly: constantly,
    doto: doto,
    does: does,
    is: is,
    isInstance: isInstance,
    unspread: unspread,
    once: once,
    execute: execute,
    applying: applying,
    constructs: constructs,
    branch: branch,
    guard: guard,
    memoize: memoize,
    isNative: isNative,
    toggles: toggles,
    detach: detach,
    attach: attach,
    trampoline: trampoline,
    forwardTo: forwardTo,
    forwardWith: forwardWith,
    deprecated: deprecated,
    EmptyList: EmptyList,
    emptyList: emptyList,
    number: number,
    num: num,
    int: _int,
    float: _float,
    isNaN: isNaN$1,
    isNumber: isNumber,
    isInteger: isInteger,
    isInt: isInt,
    isFloat: isFloat,
    mod: mod,
    min: min,
    max: max,
    isZero: isZero,
    isPos: isPos,
    isNeg: isNeg,
    isOdd: isOdd,
    isEven: isEven,
    clamp: clamp,
    rand: rand,
    randInt: randInt,
    sum: sum,
    least: least,
    most: most,
    average: average,
    measure: measure,
    LazySeq: LazySeq,
    lazySeq: lazySeq,
    map: map,
    mapa: mapa$1,
    keyed: keyed,
    transduce: transduce,
    into: into,
    doing: doing,
    each: each,
    doseq: doseq,
    eachkv: eachkv,
    eachvk: eachvk,
    entries: entries,
    mapkv: mapkv,
    mapvk: mapvk,
    seek: seek,
    some: some,
    notSome: notSome,
    notAny: notAny,
    every: every,
    notEvery: notEvery,
    mapSome: mapSome,
    mapcat: mapcat,
    filter: filter$1,
    detect: detect,
    cycle: cycle,
    treeSeq: treeSeq,
    flatten: flatten,
    zip: zip,
    filtera: filtera,
    remove: remove$1,
    keep: keep,
    drop: drop,
    dropWhile: dropWhile,
    dropLast: dropLast,
    take: take,
    takeWhile: takeWhile,
    takeNth: takeNth,
    takeLast: takeLast,
    interleaved: interleaved,
    interleave: interleave,
    interpose: interpose,
    partition: partition,
    partitionAll1: partitionAll1,
    partitionAll2: partitionAll2,
    partitionAll3: partitionAll3,
    partitionAll: partitionAll,
    partitionBy: partitionBy,
    last: last,
    dedupe: dedupe,
    repeatedly: repeatedly,
    repeat: repeat,
    isEmpty: isEmpty,
    notEmpty: notEmpty,
    asc: asc,
    desc: desc,
    sort: sort,
    sortBy: sortBy,
    withIndex: withIndex,
    butlast: butlast,
    initial: initial,
    eachIndexed: eachIndexed,
    mapIndexed: mapIndexed,
    keepIndexed: keepIndexed,
    splitAt: splitAt,
    splitWith: splitWith,
    braid: braid,
    best: best,
    scan: scan,
    isDistinct: isDistinct,
    dorun: dorun,
    doall: doall,
    iterate: iterate,
    integers: integers,
    positives: positives,
    negatives: negatives,
    dotimes: dotimes,
    randNth: randNth,
    cond: cond,
    join: join,
    shuffle: shuffle,
    generate: generate,
    splice: splice,
    also: also,
    countBy: countBy,
    groupBy: groupBy,
    index: index,
    lazyIterable: lazyIterable,
    Multimap: Multimap,
    multimap: multimap,
    isArray: isArray,
    emptyArray: emptyArray,
    array: array,
    Benchmark: Benchmark,
    benchmark: benchmark,
    race: race,
    boolean: _boolean,
    bool: bool,
    isBoolean: isBoolean,
    not: not,
    isTrue: isTrue,
    isFalse: isFalse,
    Concatenated: Concatenated,
    concatenated: concatenated,
    isConcatenated: isConcatenated,
    concat: concat,
    date: date,
    monthDays: monthDays,
    weekday: weekday,
    weekend: weekend,
    dow: dow,
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute,
    millisecond: millisecond,
    quarter: quarter,
    clockHour: clockHour,
    pm: pm,
    rdow: rdow,
    mdow: mdow,
    isDate: isDate,
    time: time,
    sod: sod,
    eod: eod,
    noon: noon,
    annually: annually,
    midnight: midnight,
    som: som,
    eom: eom,
    soy: soy,
    eoy: eoy,
    tick: tick,
    untick: untick,
    Duration: Duration,
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: milliseconds,
    duration: duration$2,
    weeks: weeks,
    error: error,
    isError: isError,
    Fluent: Fluent,
    fluent: fluent,
    FiniteStateMachine: FiniteStateMachine,
    fsm: fsm,
    isFunction: isFunction,
    spread: spread,
    realize: realize,
    realized: realized,
    juxt: juxt,
    pipe: pipe,
    comp: comp,
    apply: apply$1,
    curry: curry,
    multi: multi,
    tee: tee,
    see: see,
    flip: flip,
    fnil: fnil,
    nullary: nullary,
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary,
    nary: nary,
    arity: arity,
    GUID: GUID,
    guid: guid,
    isGUID: isGUID,
    IndexedSeq: IndexedSeq,
    indexedSeq: indexedSeq,
    Indexed: Indexed,
    indexed: indexed,
    Just: Just,
    just: just,
    isJust: isJust,
    Lens: Lens,
    lens: lens,
    List: List,
    cons: cons,
    isList: isList,
    list: list,
    Maybe: Maybe,
    maybe: maybe,
    opt: opt,
    isMaybe: isMaybe,
    Nil: Nil,
    isNil: isNil,
    isSome: isSome,
    nil: nil,
    isObject: isObject,
    emptyObject: emptyObject,
    juxtVals: juxtVals,
    selectKeys: selectKeys,
    removeKeys: removeKeys,
    mapKeys: mapKeys,
    mapVals: mapVals,
    defaults: defaults,
    compile: compile,
    Okay: Okay,
    okay: okay,
    isOkay: isOkay,
    AssociativeSubset: AssociativeSubset,
    associativeSubset: associativeSubset,
    isAssociativeSubset: isAssociativeSubset,
    Period: Period,
    emptyPeriod: emptyPeriod,
    period1: period1,
    period: period,
    promise: promise,
    isPromise: isPromise,
    Promise: Promise$1__default,
    awaits: awaits,
    fromTask: fromTask,
    Protocol: Protocol,
    protocol: protocol,
    implement0: implement0,
    satisfies: satisfies$1,
    specify: specify,
    unspecify: unspecify,
    implement: implement,
    extend: extend,
    reifiable: reifiable,
    ProtocolLookupError: ProtocolLookupError,
    protocolLookupError: protocolLookupError,
    Range: Range,
    emptyRange: emptyRange,
    range: range,
    record: behaveAsRecord,
    Recurrence: Recurrence,
    emptyRecurrence: emptyRecurrence,
    recurrence1: recurrence1,
    recurrence: recurrence,
    Reduced: Reduced,
    reduced: reduced$1,
    isReduced: isReduced,
    unreduced: unreduced,
    isRegExp: isRegExp,
    test: test,
    reFind: reFind,
    reFindAll: reFindAll,
    reMatches: reMatches,
    reSeq: reSeq,
    rePattern: rePattern,
    RevSeq: RevSeq,
    revSeq: revSeq,
    series: behaveAsSeries,
    Symbol: _Symbol,
    isString: isString,
    emptyString: emptyString,
    isBlank: isBlank,
    camelToDashed: camelToDashed,
    startsWith: startsWith,
    endsWith: endsWith,
    replace: replace,
    subs: subs,
    lowerCase: lowerCase,
    upperCase: upperCase,
    titleCase: titleCase,
    lpad: lpad,
    rpad: rpad,
    trim: trim,
    rtrim: rtrim,
    ltrim: ltrim,
    str: str,
    zeros: zeros,
    Task: Task,
    task: task,
    WeakMap: WeakMap$1,
    isWeakMap: isWeakMap,
    weakMap: weakMap,
    IAddable: IAddable,
    IAppendable: IAppendable,
    IAssociative: IAssociative,
    IBlankable: IBlankable,
    IBounds: IBounds,
    IChainable: IChainable,
    ICloneable: ICloneable,
    ICoerceable: ICoerceable,
    ICollection: ICollection,
    ICompactable: ICompactable,
    IComparable: IComparable,
    IInverse: IInverse,
    ICounted: ICounted,
    IDeref: IDeref$1,
    IDescriptive: IDescriptive,
    IDisposable: IDisposable,
    IDivisible: IDivisible,
    IEmptyableCollection: IEmptyableCollection,
    IEquiv: IEquiv,
    IFind: IFind,
    IFn: IFn,
    IForkable: IForkable,
    IFunctor: IFunctor,
    IHierarchy: IHierarchy,
    IInclusive: IInclusive$1,
    IIndexed: IIndexed,
    IInsertable: IInsertable,
    IKVReduce: IKVReduce$1,
    ILocate: ILocate,
    ILookup: ILookup,
    IMap: IMap,
    IMapEntry: IMapEntry,
    IMatchable: IMatchable,
    patch: patch,
    mergeWith: mergeWith,
    IMergeable: IMergeable,
    IMultipliable: IMultipliable,
    INameable: INameable,
    INext: INext,
    IOtherwise: IOtherwise,
    IPath: IPath,
    IPrependable: IPrependable,
    IQueryable: IQueryable,
    IRecord: IRecord,
    IReduce: IReduce,
    IReset: IReset,
    IReversible: IReversible,
    ISend: ISend,
    ISeq: ISeq,
    ISeqable: ISeqable,
    ISequential: ISequential,
    ISet: ISet,
    IStateMachine: IStateMachine,
    ISplittable: ISplittable,
    ISwap: ISwap,
    ITemplate: ITemplate,
    IYankable: IYankable,
    directed: directed,
    steps: steps,
    subtract: subtract,
    add: add$1,
    inc: inc,
    dec: dec,
    append: append$5,
    contains: contains,
    assoc: assoc,
    assocIn: assocIn,
    update: update,
    updateIn: updateIn,
    rewrite: rewrite,
    blank: blank$5,
    blot: blot,
    start: start$4,
    end: end$4,
    inside: inside,
    between: between,
    overlap: overlap,
    chain: chain$1,
    clone: clone$6,
    toArray: toArray,
    toObject: toObject,
    toPromise: toPromise,
    toDuration: toDuration,
    conj: conj,
    compact: compact$3,
    only: only,
    compare: compare$3,
    inverse: inverse$4,
    count: count$7,
    deref: deref$1,
    dispose: dispose,
    divide: divide$3,
    empty: empty$1,
    equiv: equiv$11,
    find: find$5,
    invoke: invoke$1,
    fork: fork$6,
    fmap: fmap$3,
    thrush: thrush,
    pipeline: pipeline,
    downward: downward,
    upward: upward,
    root: root,
    parent: parent,
    parents: parents,
    closest: closest,
    ancestors: ancestors,
    children: children,
    descendants: descendants,
    nextSibling: nextSibling,
    prevSibling: prevSibling,
    nextSiblings: nextSiblings,
    prevSiblings: prevSiblings,
    siblings: siblings,
    leaves: leaves,
    asLeaves: asLeaves,
    nth: nth$6,
    idx: idx$3,
    includes: includes,
    excludes: excludes,
    transpose: transpose,
    after: after$1,
    before: before$1,
    reducekv2: reducekv2,
    reducekv3: reducekv3,
    reducekv: reducekv,
    locate: locate$1,
    get: get,
    getIn: getIn,
    keys: keys$7,
    vals: vals$3,
    dissoc: dissoc$3,
    key: key$2,
    val: val$2,
    matches: matches$3,
    merge: merge$4,
    mult: mult,
    name: name$1,
    next: next$10,
    otherwise: otherwise$4,
    path: path,
    prepend: prepend$4,
    query: query$1,
    reduce: reduce,
    reducing: reducing,
    reset: reset$1,
    reverse: reverse$3,
    send: send,
    first: first,
    rest: rest,
    seq: seq,
    disj: disj,
    subset: subset,
    superset: superset,
    unite: unite$1,
    union: union,
    intersection: intersection,
    difference: difference,
    state: state$1,
    transition: transition$1,
    transitions: transitions$1,
    split: split$2,
    swap: swap$1,
    fill: fill$2,
    template: template,
    yank: yank,
    both: both,
    either: either,
    all: all,
    any: any,
    and: and,
    or: or,
    signature: signature,
    everyPair: everyPair,
    someFn: someFn,
    isIdentical: isIdentical,
    lt: lt,
    lte: lte,
    gt: gt,
    gte: gte,
    eq: eq,
    notEq: notEq,
    mapArgs: mapArgs,
    everyPred: everyPred,
    pre: pre,
    post: post,
    scanKey: scanKey,
    maxKey: maxKey,
    minKey: minKey,
    prop: prop,
    absorb: absorb
  });

  return _;

});
