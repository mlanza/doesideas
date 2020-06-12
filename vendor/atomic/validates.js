define(['exports', 'atomic/core'], function (exports, _) { 'use strict';

  var ICheckable = _.protocol({
    check: null
  });

  var IConstrainable = _.protocol({
    //constraints are validation which expose their data for use iby the UI
    constraints: null
  });

  var IExplains = _.protocol({
    explain: null
  });

  var IScope = _.protocol({
    scope: null,
    at: null
  });

  var ISelection = _.protocol({
    options: null
  });

  function And(constraints) {
    this.constraints = constraints;
  }
  function and() {
    for (var _len = arguments.length, constraints = new Array(_len), _key = 0; _key < _len; _key++) {
      constraints[_key] = arguments[_key];
    }

    return new And(constraints);
  }

  function Issue(constraint, path) {
    this.constraint = constraint;
    this.path = path;
  }
  function issue(constraint, path) {
    return new Issue(constraint, path || null);
  }

  function issues1(obj) {
    return _.seq(ICheckable.check(IConstrainable.constraints(obj), obj));
  }

  function issues2(xs, f) {
    if (xs == null) {
      return null;
    } else if (_.isPromise(xs)) {
      return _.fmap(xs, function (x) {
        return issues2(x, f);
      });
    } else if (_.satisfies(_.ISeq, xs)) {
      var _ref, _ref2, _map;

      return _ref = (_ref2 = (_map = _.map(f, xs), _.flatten(_map)), _.compact(_ref2)), _.blot(_ref);
    }
  }

  var issues = _.overload(null, issues1, issues2);

  function issuing2(x, issue) {
    return issuing3(x, _.identity, issue);
  }

  function issuing3(x, valid, issue) {
    if (_.isPromise(x)) {
      return _.fmap(x, valid, function (_arg) {
        return issuing(_arg, valid, issue);
      });
    } else if (valid(x)) {
      return null;
    } else {
      return [issue];
    }
  }

  var issuing = _.overload(null, null, issuing2, issuing3);

  function deref(self) {
    return self.constraint;
  }

  function scope(self, key) {
    return issue(self.constraint, _.toArray(_.cons(key, self.path)));
  }

  function at(self, path) {
    return issue(self.constraint, path);
  }

  var behaveAsIssue = _.does(_.implement(_.IDeref, {
    deref: deref
  }), _.implement(IScope, {
    scope: scope,
    at: at
  }));

  behaveAsIssue(Issue);

  function check(self, value) {
    return issues(self.constraints, function (_arg) {
      return ICheckable.check(_arg, value);
    });
  }

  function conj(self, constraint) {
    return _.apply(and, _.ICollection.conj(self.constraints, constraint));
  }

  function first(self) {
    return _.ISeq.first(self.constraints);
  }

  function rest(self) {
    return _.ISeq.rest(self.constraints);
  }

  function empty(self) {
    return and();
  }

  function seq(self) {
    return _.ISeqable.seq(self.constraints) ? self : null;
  }

  function next(self) {
    return seq(rest(self));
  }

  var behaveAsAnd = _.does(_.implement(_.ISeqable, {
    seq: seq
  }), _.implement(_.INext, {
    next: next
  }), _.implement(_.IEmptyableCollection, {
    empty: empty
  }), _.implement(_.ICollection, {
    conj: conj
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(_.IAppendable, {
    append: conj
  }), _.implement(ICheckable, {
    check: check
  }));

  behaveAsAnd(And);

  function Annotation(note, constraint) {
    this.note = note;
    this.constraint = constraint;
  }
  function anno(note, constraint) {
    return new Annotation(note, constraint);
  }

  function deref$1(self) {
    return self.constraint;
  }

  function explain(self) {
    return self.note;
  }

  function check$1(self, value) {
    return issues(ICheckable.check(self.constraint, value), function (iss) {
      return issue(anno(self.note, iss.constraint), iss.path);
    });
  }

  function append(self, constraint) {
    return anno(self.note, _.IAppendable.append(self.constraint, constraint));
  }

  var behaveAsAnnotation = _.does(_.implement(_.IDeref, {
    deref: deref$1
  }), _.implement(IExplains, {
    explain: explain
  }), _.implement(_.IAppendable, {
    append: append
  }), _.implement(ICheckable, {
    check: check$1
  }));

  behaveAsAnnotation(Annotation);

  function Bounds(start, end, f) {
    this.start = start;
    this.end = end;
    this.f = f;
  }

  function bounds3(start, end, f) {
    return new Bounds(start, end, f);
  }

  function bounds2(start, end) {
    return bounds3(start, end, _.identity);
  }

  function bounds1(end) {
    return bounds2(null, end);
  }

  var bounds = _.overload(null, bounds1, bounds2, bounds3);

  function start$1(self) {
    return self.start;
  }

  function end$1(self) {
    return self.end;
  }

  function includes(self, value) {
    return _.between(self, value);
  }

  function check$2(self, obj) {
    var value = self.f(obj);
    return self.start != null && value <= self.start || self.end != null && value >= self.end ? [issue(self)] : null;
  }

  var behaveAsBounds = _.does(_.implement(ICheckable, {
    check: check$2
  }), _.implement(_.IInclusive, {
    includes: includes
  }), _.implement(_.IBounds, {
    start: start$1,
    end: end$1
  }));

  behaveAsBounds(Bounds);

  function Cardinality(least, most) {
    this.least = least;
    this.most = most;
  }

  function validCardinality(least, most) {
    return _.isInteger(least) && least >= 0 && most >= 0 && least <= most && (_.isInteger(most) || most === Infinity);
  }

  var card = _.fnil(_.pre(_.constructs(Cardinality), validCardinality), 0, Infinity);
  var opt = card(0, 1);
  var req = card(1, 1);
  var unlimited = card(0, Infinity);

  function start$2(self) {
    return self.least;
  }

  function end$2(self) {
    return self.most;
  }

  function includes$1(self, value) {
    return _.isInteger(value) && _.between(self, value);
  }

  function check$3(self, coll) {
    var n = _.count(coll);
    return n < self.least || n > self.most ? [issue(self)] : null;
  }

  var behaveAsCardinality = _.does(_.implement(ICheckable, {
    check: check$3
  }), _.implement(_.IInclusive, {
    includes: includes$1
  }), _.implement(_.IBounds, {
    start: start$2,
    end: end$2
  }));

  behaveAsCardinality(Cardinality);

  function Catches(constraint) {
    this.constraint = constraint;
  }
  function catches(constraint) {
    return new Catches(constraint);
  }

  function check$4(self, obj) {
    try {
      return ICheckable.check(self.constraint, obj);
    } catch (ex) {
      return [issue(self)];
    }
  }

  var behaveAsCatches = _.does(_.implement(ICheckable, {
    check: check$4
  }));

  behaveAsCatches(Catches);

  function Characters(start, end, f) {
    this.start = start;
    this.end = end;
    this.f = f;
  }

  function chars2(start, end) {
    return new Characters(start, end, _.count);
  }

  function chars1(end) {
    return chars2(null, end);
  }

  var chars = _.overload(null, chars1, chars2);

  behaveAsBounds(Characters);

  function Choice(options) {
    this.options = options;
  }
  function choice(options) {
    return new Choice(options);
  }

  function options(self) {
    return self.options;
  }

  function check$5(self, value) {
    return _.includes(self.options, value) ? null : [issue(self)];
  }

  var behaveAsChoice = _.does(_.implement(ISelection, {
    options: options
  }), _.implement(ICheckable, {
    check: check$5
  }));

  behaveAsChoice(Choice);

  function CollOf(constraint) {
    this.constraint = constraint;
  }
  function collOf(constraint) {
    return new CollOf(constraint);
  }

  function check$6(self, coll) {
    return _.maybe(coll, function (_arg2) {
      return _.mapIndexed(function (idx, item) {
        return _.map(function (_arg) {
          return IScope.scope(_arg, idx);
        }, ICheckable.check(self.constraint, item));
      }, _arg2);
    }, _.concatenated, _.compact, _.toArray, _.blot);
  }

  var behaveAsCollOf = _.does(_.implement(ICheckable, {
    check: check$6
  }));

  behaveAsCollOf(CollOf);

  function Isa(types) {
    this.types = types;
  }
  function isa() {
    for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }

    return new Isa(types);
  }

  function check$7(self, obj) {
    return _.some(function (_arg) {
      return _.is(obj, _arg);
    }, self.types) ? null : [issue(self)];
  }

  function options$1(self) {
    return self.types;
  }

  var behaveAsIsa = _.does(_.implement(ISelection, {
    options: options$1
  }), _.implement(ICheckable, {
    check: check$7
  }));

  behaveAsIsa(Isa);

  function Map$1(f, constraint) {
    this.f = f;
    this.constraint = constraint;
  }
  function map(f, constraint) {
    return new Map$1(f, constraint);
  }

  function check$8(self, obj) {
    try {
      var value = _.invoke(self.f, obj);
      return ICheckable.check(self.constraint, value);
    } catch (ex) {
      return [issue(self.constraint)];
    }
  }

  var behaveAsMap = _.does(_.implement(ICheckable, {
    check: check$8
  }));

  behaveAsMap(Map$1);

  function Optional(key, constraint) {
    this.key = key;
    this.constraint = constraint;
  }
  function optional(key, constraint) {
    return new Optional(key, constraint || null);
  }

  function check$9(self, obj) {
    var found = _.get(obj, self.key);

    if (_.blank(found)) {
      return null;
    } else {
      var _ref = self.key;
      return issues(ICheckable.check(self.constraint, found), function (_arg) {
        return IScope.scope(_arg, _ref);
      });
    }
  }

  function append$1(self, constraint) {
    return optional(self.key, and(self.constraint, constraint));
  }

  var behaveAsOptional = _.does(_.implement(_.IAppendable, {
    append: append$1
  }), _.implement(ICheckable, {
    check: check$9
  }));

  behaveAsOptional(Optional);

  function Or(constraints) {
    this.constraints = constraints;
  }
  function or() {
    for (var _len = arguments.length, constraints = new Array(_len), _key = 0; _key < _len; _key++) {
      constraints[_key] = arguments[_key];
    }

    return new Or(constraints);
  }

  function check$10(self, value) {
    return _.detect(_.isSome, _.map(function (_arg) {
      return ICheckable.check(_arg, value);
    }, self.constraints));
  }

  function conj$1(self, constraint) {
    return apply(or, _.ICollection.conj(self.constraints, constraint));
  }

  function first$1(self) {
    return _.ISeq.first(self.constraints);
  }

  function rest$1(self) {
    return _.ISeq.rest(self.constraints);
  }

  function empty$1(self) {
    return or();
  }

  function seq$1(self) {
    return _.ISeqable.seq(self.constraints) ? self : null;
  }

  function next$1(self) {
    return seq$1(rest$1(self));
  }

  var behaveAsOr = _.does(_.implement(_.ISeqable, {
    seq: seq$1
  }), _.implement(_.INext, {
    next: next$1
  }), _.implement(_.IEmptyableCollection, {
    empty: empty$1
  }), _.implement(_.ICollection, {
    conj: conj$1
  }), _.implement(_.ISeq, {
    first: first$1,
    rest: rest$1
  }), _.implement(_.IAppendable, {
    append: conj$1
  }), _.implement(ICheckable, {
    check: check$10
  }));

  behaveAsOr(Or);

  function Predicate(f, args) {
    this.f = f;
    this.args = args;
  }
  function pred(f) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return new Predicate(f, args);
  }

  function check$11(self, obj) {
    var pos = _.indexOf(self.args, null),
        args = _.assoc(self.args, pos, obj);
    return _.apply(self.f, args) ? null : [issue(self)];
  }

  var behaveAsPredicate = _.does(_.implement(ICheckable, {
    check: check$11
  }));

  behaveAsPredicate(Predicate);

  function Required(key, constraint) {
    this.key = key;
    this.constraint = constraint;
  }
  function required(key, constraint) {
    return new Required(key, constraint || null);
  }

  function check$12(self, obj) {
    var found = _.get(obj, self.key);

    if (_.blank(found)) {
      return [issue(self, [self.key])];
    } else {
      var _ref = self.key;
      return issues(ICheckable.check(self.constraint, found), function (_arg) {
        return IScope.scope(_arg, _ref);
      });
    }
  }

  function append$2(self, constraint) {
    return required(self.key, and(self.constraint, constraint));
  }

  var behaveAsRequired = _.does(_.implement(_.IAppendable, {
    append: append$2
  }), _.implement(ICheckable, {
    check: check$12
  }));

  behaveAsRequired(Required);

  function Scoped(key, constraint) {
    this.key = key;
    this.constraint = constraint;
  }
  function scoped(key, constraint) {
    return new Scoped(key, constraint);
  }

  function check$13(self, value) {
    return issues(ICheckable.check(self.constraint, value), function (iss) {
      return issue(self.constraint, _.toArray(_.cons(self.key, iss.path)));
    });
  }

  var behaveAsScoped = _.does(_.implement(ICheckable, {
    check: check$13
  }));

  behaveAsScoped(Scoped);

  function When(pred, constraint) {
    this.pred = pred;
    this.constraint = constraint;
  }
  function when(pred, constraint) {
    return new When(pred, constraint);
  }

  function check$14(self, obj) {
    return self.pred(obj) ? ICheckable.check(self.constraint, obj) : null;
  }

  var behaveAsWhen = _.does(_.implement(ICheckable, {
    check: check$14
  }));

  behaveAsWhen(When);

  function parses(parse, constraint) {
    return anno({
      type: 'parse',
      parse: parse
    }, catches(map(_.branch(_.isString, parse, _.identity), constraint)));
  }

  function check3(self, parse, value) {
    return ICheckable.check(parses(parse, self), value);
  }

  var check$15 = _.awaits(_.overload(null, null, ICheckable.check, check3));

  function constraints2(self, f) {
    return IConstrainable.constraints(self, _.isFunction(f) ? f(IConstrainable.constraints(self)) : f);
  }

  var constraints = _.overload(null, IConstrainable.constraints, constraints2);
  function constrain(self, constraint) {
    return constraints(self, function (_arg) {
      return _.append(_arg, constraint);
    });
  }

  var explain$1 = IExplains.explain;

  var scope$1 = IScope.scope;
  var at$1 = IScope.at;

  var options$2 = ISelection.options;

  function toPred(constraint) {
    return function (obj) {
      var issues$$1 = ICheckable.check(constraint, obj);
      return !issues$$1;
    };
  }
  function present(constraint) {
    return or(_.isNil, constraint);
  }
  function atLeast(n) {
    return anno({
      type: 'at-least',
      n: n
    }, map(_.count, pred(_.gte, null, n)));
  }
  function atMost(n) {
    return anno({
      type: 'at-most',
      n: n
    }, map(_.count, pred(_.lte, null, n)));
  }
  function exactly(n) {
    return anno({
      type: 'exactly',
      n: n
    }, map(_.count, pred(_.eq, null, n)));
  }
  function between(min, max) {
    return min == max ? anno({
      type: 'equal',
      value: min
    }, pred(_.eq, null, min)) : anno({
      type: 'between',
      min: min,
      max: max
    }, or(anno({
      type: 'min',
      min: min
    }, pred(_.gte, null, min)), anno({
      type: 'max',
      max: max
    }, pred(_.lte, null, max))));
  }
  function keyed(keys) {
    return _.apply(_.juxt, _.mapa(function (key) {
      return function (_arg) {
        return _.get(_arg, key);
      };
    }, keys));
  }
  function supplied(cond, keys) {
    return scoped(_.first(keys), map(keyed(keys), _.spread(_.filled(cond, _.constantly(true)))));
  }
  function range(start, end) {
    return anno({
      type: 'range',
      start: start,
      end: end
    }, supplied(_.lte, [start, end]));
  }
  var email = anno({
    type: "email"
  }, /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
  var phone = anno({
    type: "phone"
  }, /^(\d{3}-|\(\d{3}\) )\d{3}-\d{4}$/);
  var stateCode = anno({
    type: "state-code"
  }, choice(['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY']));
  var zipCode = anno({
    type: "zip-code"
  }, /^\d{5}(-\d{4})?$/);

  (function () {
    var check = _.constantly(null);
    _.doto(_.Nil, _.implement(ICheckable, {
      check: check
    }));
  })();

  function datatype(Type, pred$$1, type) {
    function check(self, value) {
      return pred$$1(value) ? null : [issue(Type)];
    }

    var explain = _.constantly({
      type: type
    });
    _.doto(Type, _.specify(IExplains, {
      explain: explain
    }), _.specify(ICheckable, {
      check: check
    }));
  }
  datatype(Function, _.isFunction, "function");
  datatype(Number, _.isNumber, "number");
  datatype(Date, _.isDate, "date");
  datatype(String, _.isString, "string");
  datatype(RegExp, _.isRegExp, "regexp");
  datatype(_.Nil, _.isNil, "nil");

  (function () {
    function check(self, value) {
      return self.test(value) ? null : [issue(self)];
    }

    _.doto(RegExp, _.implement(IExplains, {
      explain: _.constantly({
        type: "pattern"
      })
    }), _.implement(ICheckable, {
      check: check
    }));
  })();

  (function () {
    function check(self, value) {
      return issuing(self(value), issue(self));
    }

    _.doto(Function, _.implement(IExplains, {
      explain: _.constantly({
        type: "predicate"
      })
    }), _.implement(ICheckable, {
      check: check
    }));
  })();

  exports.toPred = toPred;
  exports.present = present;
  exports.atLeast = atLeast;
  exports.atMost = atMost;
  exports.exactly = exactly;
  exports.between = between;
  exports.keyed = keyed;
  exports.supplied = supplied;
  exports.range = range;
  exports.email = email;
  exports.phone = phone;
  exports.stateCode = stateCode;
  exports.zipCode = zipCode;
  exports.datatype = datatype;
  exports.And = And;
  exports.and = and;
  exports.Annotation = Annotation;
  exports.anno = anno;
  exports.Bounds = Bounds;
  exports.bounds = bounds;
  exports.Cardinality = Cardinality;
  exports.card = card;
  exports.opt = opt;
  exports.req = req;
  exports.unlimited = unlimited;
  exports.Catches = Catches;
  exports.catches = catches;
  exports.Characters = Characters;
  exports.chars = chars;
  exports.Choice = Choice;
  exports.choice = choice;
  exports.CollOf = CollOf;
  exports.collOf = collOf;
  exports.Isa = Isa;
  exports.isa = isa;
  exports.Issue = Issue;
  exports.issue = issue;
  exports.issues = issues;
  exports.issuing = issuing;
  exports.Map = Map$1;
  exports.map = map;
  exports.Optional = Optional;
  exports.optional = optional;
  exports.Or = Or;
  exports.or = or;
  exports.Predicate = Predicate;
  exports.pred = pred;
  exports.Required = Required;
  exports.required = required;
  exports.Scoped = Scoped;
  exports.scoped = scoped;
  exports.When = When;
  exports.when = when;
  exports.ICheckable = ICheckable;
  exports.IConstrainable = IConstrainable;
  exports.IExplains = IExplains;
  exports.IScope = IScope;
  exports.ISelection = ISelection;
  exports.parses = parses;
  exports.check = check$15;
  exports.constraints = constraints;
  exports.constrain = constrain;
  exports.explain = explain$1;
  exports.scope = scope$1;
  exports.at = at$1;
  exports.options = options$2;

  Object.defineProperty(exports, '__esModule', { value: true });

});
