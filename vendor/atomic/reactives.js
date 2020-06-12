define(['exports', 'atomic/core', 'atomic/transients', 'symbol', 'atomic/transducers'], function (exports, _, mut, _Symbol, t) { 'use strict';

  _Symbol = _Symbol && _Symbol.hasOwnProperty('default') ? _Symbol['default'] : _Symbol;

  var IDispatch = _.protocol({
    dispatch: null
  });

  var dispatch = IDispatch.dispatch;

  function on2(self, f) {
    on3(self, _.identity, f);
  }

  function on3(self, pred, f) {
    if (pred(self)) {
      f(self);
    }
  }

  var on = _.overload(null, null, on2, on3);
  var IEvented = _.protocol({
    on: on,
    off: null,
    trigger: null
  });

  var on$1 = IEvented.on;
  var off = IEvented.off;
  var trigger = IEvented.trigger;

  function one3(self, key, callback) {
    function cb(e) {
      off(self, key, ctx.cb);
      callback.call(this, e);
    }

    var ctx = {
      cb: cb
    };
    return on$1(self, key, cb);
  }

  function one4(self, key, selector, callback) {
    function cb(e) {
      off(self, key, ctx.cb);
      callback.call(this, e);
    }

    var ctx = {
      cb: cb
    };
    return on$1(self, key, selector, cb);
  }

  var one = _.overload(null, null, null, one3, one4);

  var IEventProvider = _.protocol({
    raise: null,
    release: null
  });

  var raise = IEventProvider.raise;
  var release = IEventProvider.release;

  var IMiddleware = _.protocol({
    handle: null
  });

  function handle2(self, message) {
    return IMiddleware.handle(self, message, _.noop);
  }

  var handle = _.overload(null, null, handle2, IMiddleware.handle);

  var IPublish = _.protocol({
    pub: null
  });

  var pub = IPublish.pub;

  function deref(self) {
    return _.IDeref.deref(self.source);
  }

  function Readonly(source) {
    this.source = source;
  }
  function readonly(source) {
    var obj = new Readonly(source);

    if (_.satisfies(_.IDeref, source)) {
      _.specify(_.IDeref, {
        deref: deref
      }, obj);
    }

    return obj;
  }

  var ISubscribe = _.protocol({
    sub: null,
    unsub: null,
    subscribed: null
  });

  function into2(sink, source) {
    return into3(sink, _.identity, source);
  }

  function into3(sink, xf, source) {
    return into4(readonly, sink, xf, source);
  }

  function into4(decorate, sink, xf, source) {
    var observer = _.partial(xf(pub), sink);
    ISubscribe.sub(source, observer);

    function dispose(_$$1) {
      ISubscribe.unsub(source, observer);
    }

    return _.doto(decorate(sink), _.specify(_.IDisposable, {
      dispose: dispose
    }));
  }

  function sub3(source, xf, sink) {
    return into4(_.identity, sink, xf, source);
  }

  var into = _.overload(null, null, into2, into3, into4);
  var sub = _.overload(null, null, ISubscribe.sub, sub3);
  var unsub = _.overload(null, null, ISubscribe.unsub);
  var subscribed = ISubscribe.subscribed;

  var ITimeTraveler = _.protocol({
    undo: null,
    redo: null,
    flush: null,
    undoable: null,
    redoable: null
  });

  var undo = ITimeTraveler.undo;
  var undoable = ITimeTraveler.undoable;
  var redo = ITimeTraveler.redo;
  var redoable = ITimeTraveler.redoable;
  var flush = ITimeTraveler.flush;

  function Broadcast(observers) {
    this.observers = observers;
  }
  function broadcast(observers) {
    return new Broadcast(observers || []);
  }

  function Cell(state, observer, validate) {
    this.state = state;
    this.observer = observer;
    this.validate = validate;
  }

  function cell0() {
    return cell1(null);
  }

  function cell1(init) {
    return cell2(init, broadcast());
  }

  function cell2(init, observer) {
    return cell3(init, observer, null);
  }

  function cell3(init, observer, validate) {
    return new Cell(init, observer, validate);
  }

  var cell = _.overload(cell0, cell1, cell2, cell3);

  function deref$1(self) {
    return self.state;
  }

  function reset(self, value) {
    if (value !== self.state) {
      if (!self.validate || self.validate(value)) {
        self.state = value;
        IPublish.pub(self.observer, value);
      } else {
        throw new Error("Cell update failed - invalid value.");
      }
    }
  }

  function swap(self, f) {
    reset(self, f(self.state));
  }

  function sub$1(self, observer) {
    IPublish.pub(observer, self.state); //to prime subscriber state

    ISubscribe.sub(self.observer, observer);
  }

  function unsub$1(self, observer) {
    ISubscribe.unsub(self.observer, observer);
  }

  function subscribed$1(self) {
    return ISubscribe.subscribed(self.observer);
  }

  function dispose(self) {
    _.satisfies(_.IDisposable, self.observer) && _.IDisposable.dispose(self.observer);
  }

  var behaveAsCell = _.does(_.implement(_.IDisposable, {
    dispose: dispose
  }), _.implement(_.IDeref, {
    deref: deref$1
  }), _.implement(ISubscribe, {
    sub: sub$1,
    unsub: unsub$1,
    subscribed: subscribed$1
  }), _.implement(IPublish, {
    pub: reset
  }), _.implement(_.IReset, {
    reset: reset
  }), _.implement(_.ISwap, {
    swap: swap
  }));

  behaveAsCell(Cell);

  function deref$2(self) {
    if (subscribed(self) === 0) {
      //force refresh of sink state
      sub(self, _.noop);
      unsub(self, _.noop);
    }

    return _.IDeref.deref(self.sink);
  }

  function AudienceDetector(sink, state) {
    this.sink = sink;
    this.state = state;
  }

  function audienceDetector2(sink, detected) {
    var init = subscribed(sink) === 0 ? "idle" : "active";
    var $state = cell(_.fsm(init, {
      idle: {
        activate: "active"
      },
      active: {
        deactivate: "idle"
      }
    }));
    sub($state, _.comp(detected, _.state));
    var result = new AudienceDetector(sink, $state);

    if (_.satisfies(_.IDeref, sink)) {
      _.specify(_.IDeref, {
        deref: deref$2
      }, result);
    }

    return result;
  }

  function audienceDetector3(sink, xf, source) {
    var observer = _.partial(xf(pub), sink);
    return audienceDetector2(sink, function (state) {
      var f = state === "active" ? sub : unsub;
      f(source, observer);
    });
  }

  var audienceDetector = _.overload(null, null, audienceDetector2, audienceDetector3);

  function sub$2(self, observer) {
    if (subscribed$2(self) === 0) {
      _.swap(self.state, function (_arg) {
        return _.transition(_arg, "activate");
      });
    }

    ISubscribe.sub(self.sink, observer);
  }

  function unsub$2(self, observer) {
    ISubscribe.unsub(self.sink, observer);

    if (subscribed$2(self) === 0) {
      _.swap(self.state, function (_arg2) {
        return _.transition(_arg2, "deactivate");
      });
    }
  }

  function subscribed$2(self) {
    return ISubscribe.subscribed(self.sink);
  }

  function dispose$1(self) {
    _.swap(self.state, function (_arg3) {
      return _.transition(_arg3, "deactivate");
    });
  }

  function state(self) {
    return _.IStateMachine.state(IDeref.deref(self.state));
  }

  var behaveAsAudienceDetector = _.does(_.implement(_.IDisposable, {
    dispose: dispose$1
  }), _.implement(_.IStateMachine, {
    state: state
  }), _.implement(ISubscribe, {
    sub: sub$2,
    unsub: unsub$2,
    subscribed: subscribed$2
  }));

  behaveAsAudienceDetector(AudienceDetector);

  function Bus(state, handler) {
    this.state = state;
    this.handler = handler;
  }
  function bus(state, handler) {
    return new Bus(state, handler);
  }

  function dispatch$1(self, command) {
    IMiddleware.handle(self.handler, command);
  }

  function dispose$2(self) {
    satisfies(_.IDisposable, self.state) && _.IDisposable.dispose(self.state);
    satisfies(_.IDisposable, self.handler) && _.IDisposable.dispose(self.handler);
  }

  var forward = _.forwardTo("state");
  var sub$3 = forward(ISubscribe.sub);
  var unsub$3 = forward(ISubscribe.unsub);
  var subscribed$3 = forward(ISubscribe.subscribed);
  var deref$3 = forward(_.IDeref.deref);
  var reset$1 = forward(_.IReset.reset);
  var swap$1 = forward(_.ISwap.swap);
  var behaveAsBus = _.does(_.implement(_.IDeref, {
    deref: deref$3
  }), _.implement(_.IReset, {
    reset: reset$1
  }), _.implement(_.ISwap, {
    swap: swap$1
  }), _.implement(ISubscribe, {
    sub: sub$3,
    unsub: unsub$3,
    subscribed: subscribed$3
  }), _.implement(IDispatch, {
    dispatch: dispatch$1
  }), _.implement(_.IDisposable, {
    dispose: dispose$2
  }));

  behaveAsBus(Bus);

  function sub$4(self, observer) {
    self.observers.push(observer);
  }

  function unsub$4(self, observer) {
    var pos = self.observers.indexOf(observer);
    pos === -1 || self.observers.splice(pos, 1);
  }

  function subscribed$4(self) {
    return self.observers.length;
  }

  function pub$1(self, message) {
    _.each(function (_arg) {
      return IPublish.pub(_arg, message);
    }, self.observers);
  }

  var behaveAsBroadcast = _.does(_.implement(ISubscribe, {
    sub: sub$4,
    unsub: unsub$4,
    subscribed: subscribed$4
  }), _.implement(IPublish, {
    pub: pub$1
  }));

  behaveAsBroadcast(Broadcast);

  function Cursor(source, path, callbacks) {
    this.source = source;
    this.path = path;
    this.callbacks = callbacks;
  }
  function cursor(source, path) {
    return new Cursor(source, path, _.weakMap());
  }

  function path(self) {
    return self.path;
  }

  function deref$4(self) {
    return _.getIn(_.deref(self.source), self.path);
  }

  function reset$2(self, value) {
    _.swap(self.source, function (state) {
      return _.assocIn(state, self.path, value);
    });
  }

  function swap$2(self, f) {
    _.swap(self.source, function (state) {
      return _.updateIn(state, self.path, f);
    });
  }

  function sub$5(self, observer) {
    function observe(state) {
      IPublish.pub(observer, _.getIn(state, self.path));
    }

    self.callbacks.set(observer, observe);

    sub(self.source, observe);
  }

  function unsub$5(self, observer) {
    var observe = self.callbacks.get(observer);

    unsub(self.source, observe);

    observe && self.callbacks["delete"](observer);
  }

  function subscribed$5(self) {
    return _.ICounted.count(self.callbacks);
  }

  function dispatch$2(self, command) {
    IDispatch.dispatch(self.source, _.update(command, "path", function (path) {
      return _.apply(_.conj, self.path, path || []);
    }));
  }

  var behaveAsCursor = _.does( //implement(IDisposable, {dispose}), TODO
  _.implement(_.IPath, {
    path: path
  }), _.implement(IDispatch, {
    dispatch: dispatch$2
  }), _.implement(_.IDeref, {
    deref: deref$4
  }), _.implement(ISubscribe, {
    sub: sub$5,
    unsub: unsub$5,
    subscribed: subscribed$5
  }), _.implement(IPublish, {
    pub: reset$2
  }), _.implement(_.IReset, {
    reset: reset$2
  }), _.implement(_.ISwap, {
    swap: swap$2
  }));

  behaveAsCursor(Cursor);

  function Events(queued) {
    this.queued = queued;
  }
  function events() {
    return new Events([]);
  }

  function raise$1(self, event) {
    self.queued.push(event);
  }

  function release$1(self) {
    var released = self.queued;
    self.queued = [];
    return released;
  }

  var behaveAsEvents = _.does(_.implement(IEventProvider, {
    raise: raise$1,
    release: release$1
  }));

  behaveAsEvents(Events);

  function EventDispatcher(events, bus, observer) {
    this.events = events;
    this.bus = bus;
    this.observer = observer;
  }
  function eventDispatcher(events, bus, observer) {
    return new EventDispatcher(events, bus, observer);
  }

  function handle$1(self, command, next) {
    next(command);
    _.each(function (event) {
      handle(self.bus, event);

      pub(self.observer, event);
    }, release(self.events));
  }

  var behaveAsEventDispatcher = _.does(_.implement(IMiddleware, {
    handle: handle$1
  }));

  behaveAsEventDispatcher(EventDispatcher);

  function MessageHandler(handlers, fallback) {
    this.handlers = handlers;
    this.fallback = fallback;
  }
  function messageHandler(handlers, fallback) {
    return new MessageHandler(handlers, fallback);
  }

  function handle$2(self, command, next) {
    var type = _.ILookup.lookup(command, "type");
    var handler = _.ILookup.lookup(self.handlers, type) || self.fallback;
    IMiddleware.handle(handler, command, next);
  }

  var behaveAsMessageHandler = _.does(_.implement(IMiddleware, {
    handle: handle$2
  }));

  behaveAsMessageHandler(MessageHandler);

  function MessageProcessor(action) {
    this.action = action;
  }
  function messageProcessor(action) {
    return new MessageProcessor(action);
  }

  function handle$3(self, message, next) {
    self.action(message);
    next(message);
  }

  var behaveAsMessageProcessor = _.does(_.implement(IMiddleware, {
    handle: handle$3
  }));

  behaveAsMessageProcessor(MessageProcessor);

  function Middleware(handlers) {
    this.handlers = handlers;
  }
  function middleware(handlers) {
    return _.doto(new Middleware(handlers || []), function (_arg) {
      return _.apply(_.conj, _arg, handlers);
    });
  }

  function handles(handle) {
    return _.doto({}, _.specify(IMiddleware, {
      handle: handle
    }));
  }

  function accepts(events$$1, type) {
    var raise = _.partial(IEventProvider.raise, events$$1);
    return handles(function (_$$1, command, next) {
      raise(_.assoc(command, "type", type));
      next(command);
    });
  }

  function raises(events$$1, bus$$1, callback) {
    var raise = _.partial(IEventProvider.raise, events$$1);
    return handles(function (_$$1, command, next) {
      callback(bus$$1, command, next, raise);
    });
  }

  function affects3(bus$$1, f, react) {
    return handles(function (_$$1, event, next) {
      var _ref = event.path;
      var past = _.deref(bus$$1),
          present = event.path ? _.apply(_.updateIn, past, event.path, f, event.args) : _.apply(f, past, event.args),
          scope = event.path ? function (_arg) {
        return _.getIn(_arg, _ref);
      } : _.identity;
      _.reset(bus$$1, present);
      react(bus$$1, event, scope(present), scope(past));
      next(event);
    });
  }

  function affects2(bus$$1, f) {
    return affects3(bus$$1, f, _.noop);
  }

  var affects = _.overload(null, null, affects2, affects3);

  function component2(state, callback) {
    var evts = events(),
        ware = middleware(),
        observer = broadcast();
    return _.doto(bus(state, ware), function ($bus) {
      var maps = callback(_.partial(accepts, evts), _.partial(raises, evts, $bus), _.partial(affects, $bus));
      var commandMap = maps[0],
          eventMap = maps[1];
      mut.conj(ware, messageHandler(commandMap), eventDispatcher(evts, messageHandler(eventMap), observer));
    });
  }

  function component1(state) {
    return component2(state, function () {
      return [{}, {}]; //static components may lack commands that drive state change.
    });
  }

  var component = _.overload(null, component1, component2);

  function conj(self, handler) {
    self.handlers = _.ICollection.conj(self.handlers, handler);
    self.handler = combine(self.handlers);
  }

  function combine(handlers) {
    var f = _.reduce(function (memo, handler) {
      return function (command) {
        return IMiddleware.handle(handler, command, memo);
      };
    }, _.noop, _.reverse(handlers));

    function handle(_$$1, command) {
      return f(command);
    }

    return _.doto({}, _.specify(IMiddleware, {
      handle: handle
    }));
  }

  function handle$4(self, command, next) {
    IMiddleware.handle(self.handler, command, next);
  }

  var behaveAsMiddleware = _.does(_.implement(mut.ITransientCollection, {
    conj: conj
  }), _.implement(IMiddleware, {
    handle: handle$4
  }));

  behaveAsMiddleware(Middleware);

  function sub$6(self, observer) {
    ISubscribe.sub(self.source, observer);
  }

  function unsub$6(self, observer) {
    ISubscribe.unsub(self.source, observer);
  }

  function subscribed$6(self) {
    return ISubscribe.subscribed(self.source);
  }

  var behaveAsReadonly = _.does(_.implement(ISubscribe, {
    sub: sub$6,
    unsub: unsub$6,
    subscribed: subscribed$6
  }));

  behaveAsReadonly(Readonly);

  function Router(fallback, handlers, receives) {
    this.fallback = fallback;
    this.handlers = handlers;
    this.receives = receives;
  }

  function router3(fallback, handlers, receives) {
    return new Router(fallback, handlers, receives);
  }

  function router2(fallback, handlers) {
    return router3(fallback, handlers, _.first);
  }

  function router1(fallback) {
    return router2(fallback, []);
  }

  function router0() {
    return router1(null);
  }

  var router = _.overload(router0, router1, router2, router3);
  Router.from = router;

  function handler3(pred, callback, how) {
    return handler2(function (_arg) {
      return how(pred, _arg);
    }, function (_arg2) {
      return how(callback, _arg2);
    });
  }

  function handler2(pred, callback) {
    function matches(_$$1, message) {
      return pred(message);
    }

    function dispatch(_$$1, message) {
      return callback(message);
    }

    return _.doto({
      pred: pred,
      callback: callback
    }, _.specify(_.IMatchable, {
      matches: matches
    }), _.specify(IDispatch, {
      dispatch: dispatch
    }));
  }

  var handler = _.overload(null, null, handler2, handler3);

  function on$2(self, pred, callback) {
    conj$1(self, _.handler(pred, callback));
  }

  function dispatch$3(self, message) {
    var receiver = self.receives(matches(self, message));

    if (!receiver) {
      throw new Error("No receiver for message.");
    }

    return IDispatch.dispatch(receiver, message);
  }

  function matches(self, message) {
    var xs = _.filter(function (_arg) {
      return _.IMatchable.matches(_arg, message);
    }, self.handlers);
    return _.ISeqable.seq(xs) ? xs : self.fallback ? [self.fallback] : [];
  }

  function conj$1(self, handler) {
    self.handlers = _.IAppendable.append(self.handlers, handler);
  }

  var behaveAsRouter = _.does(_.implement(IEvented, {
    on: on$2
  }), _.implement(IDispatch, {
    dispatch: dispatch$3
  }), _.implement(_.IMatchable, {
    matches: matches
  }), _.implement(mut.ITransientCollection, {
    conj: conj$1
  }));

  behaveAsRouter(Router);

  function TimeTraveler(pos, max, history, cell) {
    this.pos = pos;
    this.max = max;
    this.history = history;
    this.cell = cell;
  }

  function timeTraveler2(max, cell) {
    return new TimeTraveler(0, max, [_.deref(cell)], cell);
  }

  function timeTraveler1(cell) {
    return timeTraveler2(Infinity, cell);
  }

  var timeTraveler = _.overload(null, timeTraveler1, timeTraveler2);

  function deref$5(self) {
    return _.IDeref.deref(self.cell);
  }

  function reset$3(self, state) {
    var history = self.pos ? self.history.slice(self.pos) : self.history;
    history.unshift(state);

    while (_.ICounted.count(history) > self.max) {
      history.pop();
    }

    self.history = history;
    self.pos = 0;
    _.IReset.reset(self.cell, state);
  }

  function swap$3(self, f) {
    reset$3(self, f(_.IDeref.deref(self.cell)));
  }

  function sub$7(self, observer) {
    ISubscribe.sub(self.cell, observer);
  }

  function unsub$7(self, observer) {
    ISubscribe.unsub(self.cell, observer);
  }

  function subscribed$7(self) {
    return ISubscribe.subscribed(self.cell);
  }

  function undo$1(self) {
    if (undoable$1(self)) {
      self.pos += 1;
      _.IReset.reset(self.cell, self.history[self.pos]);
    }
  }

  function redo$1(self) {
    if (redoable$1(self)) {
      self.pos -= 1;
      _.IReset.reset(self.cell, self.history[self.pos]);
    }
  }

  function flush$1(self) {
    self.history = [self.history[self.pos]];
    self.pos = 0;
  }

  function undoable$1(self) {
    return self.pos < _.ICounted.count(self.history);
  }

  function redoable$1(self) {
    return self.pos > 0;
  }

  var behaveAsTimeTraveler = _.does(_.implement(ITimeTraveler, {
    undo: undo$1,
    redo: redo$1,
    flush: flush$1,
    undoable: undoable$1,
    redoable: redoable$1
  }), _.implement(_.IDeref, {
    deref: deref$5
  }), _.implement(_.IReset, {
    reset: reset$3
  }), _.implement(_.ISwap, {
    swap: swap$3
  }), _.implement(ISubscribe, {
    sub: sub$7,
    unsub: unsub$7,
    subscribed: subscribed$7
  }));

  behaveAsTimeTraveler(TimeTraveler);

  //TODO that promises could potentially return out of order is a problem!
  function then2(f, source) {
    var sink = cell(null);

    function observe(value) {
      _.IFunctor.fmap(_.Promise.resolve(f(value)), _.partial(pub, sink));
    }

    function dispose(self) {
      ISubscribe.unsub(source, observe);
    }

    ISubscribe.sub(source, observe);
    return _.doto(readonly(sink), _.specify(_.IDisposable, {
      dispose: dispose
    }));
  }

  function thenN(f) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    return then2(_.spread(f), latest(sources));
  }

  var then = _.overload(null, null, then2, thenN);

  function signal1(source) {
    return signal2(t.map(_.identity), source);
  }

  function signal2(xf, source) {
    return signal3(xf, null, source);
  }

  function signal3(xf, init, source) {
    return signal4(audienceDetector, xf, init, source);
  }

  function signal4(into$$1, xf, init, source) {
    return into$$1(cell(init), xf, source);
  }

  var signal = _.overload(null, signal1, signal2, signal3, signal4);

  function sink(source) {
    return _.satisfies(_.IDeref, source) ? cell() : broadcast();
  }

  function via2(xf, source) {
    return into(sink(source), xf, source);
  }

  function viaN(xf) {
    for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      sources[_key2 - 1] = arguments[_key2];
    }

    return via2(_.spread(xf), latest(sources));
  }

  var via = _.overload(null, null, via2, viaN);

  function map2(f, source) {
    return via2(_.comp(t.map(f), t.dedupe()), source);
  }

  function mapN(f) {
    for (var _len3 = arguments.length, sources = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      sources[_key3 - 1] = arguments[_key3];
    }

    return map2(_.spread(f), latest(sources));
  }

  var map = _.overload(null, null, map2, mapN);
  function computed(f, source) {
    var sink = cell(f(source));

    function callback() {
      _.IReset.reset(sink, f(source));
    }

    function pub$$1(self, value) {
      IPublish.pub(source, value);
    }

    return _.doto(audienceDetector(sink, function (state) {
      var f = state == "active" ? ISubscribe.sub : ISubscribe.unsub;
      f(source, callback);
    }), _.specify(IPublish, {
      pub: pub$$1
    }));
  }

  function fmap(source, f) {
    return map(f, source);
  }

  _.each(_.implement(_.IFunctor, {
    fmap: fmap
  }), [AudienceDetector, Cell, Broadcast]);
  function mousemove(el) {
    return signal(t.map(function (e) {
      return [e.clientX, e.clientY];
    }), [], event(el, "mouseenter mousemove"));
  }
  function keydown(el) {
    return signal(event(el, "keydown"));
  }
  function keyup(el) {
    return signal(event(el, "keyup"));
  }
  function keypress(el) {
    return signal(event(el, "keypress"));
  }
  function scan(f, init, source) {
    var memo = init;
    return signal(t.map(function (value) {
      memo = f(memo, value);
      return memo;
    }), init, source);
  }
  function pressed(el) {
    return signal(t.dedupe(), [], scan(function (memo, value) {
      if (value.type === "keyup") {
        memo = _.filtera(_.partial(_.notEq, value.key), memo);
      } else if (memo.indexOf(value.key) === -1) {
        memo = _.ICollection.conj(memo, value.key);
      }

      return memo;
    }, [], join(broadcast(), keydown(el), keyup(el))));
  }
  function hashchange(window) {
    return signal(t.map(function () {
      return location.hash;
    }), location.hash, event(window, "hashchange"));
  }

  function fromPromise1(promise) {
    return fromPromise2(promise, null);
  }

  function fromPromise2(promise, init) {
    var sink = cell(init);
    _.IFunctor.fmap(promise, function (_arg) {
      return IPublish.pub(sink, _arg);
    });
    return sink;
  }

  var fromPromise = _.overload(null, fromPromise1, fromPromise2);
  function fromElement(events$$1, f, el) {
    return signal(t.map(function () {
      return f(el);
    }), f(el), event(el, events$$1));
  }
  function focus(el) {
    return join(cell(el === document.activeElement), via(t.map(_.constantly(true)), event(el, "focus")), via(t.map(_.constantly(false)), event(el, "blur")));
  }
  function join(sink) {
    for (var _len4 = arguments.length, sources = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      sources[_key4 - 1] = arguments[_key4];
    }

    var callback = function callback(_arg2) {
      return IPublish.pub(sink, _arg2);
    };

    return audienceDetector(sink, function (state) {
      var f = state === "active" ? ISubscribe.sub : ISubscribe.unsub;
      _.each(function (_arg3) {
        return f(_arg3, callback);
      }, sources);
    });
  }
  var fixed = _.comp(readonly, cell);
  function latest(sources) {
    var sink = cell(_.mapa(_.constantly(null), sources));
    var fs = _.memoize(function (idx) {
      return function (value) {
        _.ISwap.swap(sink, function (_arg4) {
          return _.IAssociative.assoc(_arg4, idx, value);
        });
      };
    }, _.str);
    return audienceDetector(sink, function (state) {
      var f = state === "active" ? ISubscribe.sub : ISubscribe.unsub;
      _.doall(_.mapIndexed(function (idx, source) {
        f(source, fs(idx));
      }, sources));
    });
  }

  function hist2(size, source) {
    var sink = cell([]);
    var history = [];
    ISubscribe.sub(source, function (value) {
      history = _.slice(history);
      history.unshift(value);

      if (history.length > size) {
        history.pop();
      }

      IPublish.pub(sink, history);
    });
    return sink;
  }

  var hist = _.overload(null, _.partial(hist2, 2), hist2);

  function event2(el, key) {
    var sink = broadcast(),
        callback = _.partial(IPublish.pub, sink);
    return audienceDetector(sink, function (status) {
      var f = status === "active" ? on$1 : off;
      f(el, key, callback);
    });
  }

  function event3(el, key, selector) {
    var sink = broadcast(),
        callback = _.partial(IPublish.pub, sink);
    return audienceDetector(sink, function (status) {
      if (status === "active") {
        on$1(el, key, selector, callback);
      } else {
        off(el, key, callback);
      }
    });
  }

  var event = _.overload(null, null, event2, event3);
  function click(el) {
    return event(el, "click");
  } //enforce sequential nature of operations

  function isolate(f) {
    //TODO treat operations as promises
    var queue = [];
    return function () {
      var ready = queue.length === 0;
      queue.push(arguments);

      if (ready) {
        while (queue.length) {
          var args = _.first(queue);

          try {
            f.apply(null, args);
            IEvented.trigger(args[0], "mutate", {
              bubbles: true
            });
          } finally {
            queue.shift();
          }
        }
      }
    };
  }

  function mutate3(self, state, f) {
    ISubscribe.sub(state, _.partial(isolate(f), self));
    return self;
  }

  function mutate2(state, f) {
    return function (_arg5) {
      return mutate3(_arg5, state, f);
    };
  }

  var mutate = _.overload(null, null, mutate2, mutate3);

  (function () {
    function dispatch$$1(self, args) {
      return _.apply(self, args);
    }

    function pub$$1(self, msg) {
      self(msg);
    }

    _.doto(Function, _.implement(IPublish, {
      pub: pub$$1
    }), _.implement(IDispatch, {
      dispatch: dispatch$$1
    }));
  })();

  exports.then2 = then2;
  exports.then = then;
  exports.signal = signal;
  exports.via = via;
  exports.map = map;
  exports.computed = computed;
  exports.mousemove = mousemove;
  exports.keydown = keydown;
  exports.keyup = keyup;
  exports.keypress = keypress;
  exports.scan = scan;
  exports.pressed = pressed;
  exports.hashchange = hashchange;
  exports.fromPromise = fromPromise;
  exports.fromElement = fromElement;
  exports.focus = focus;
  exports.join = join;
  exports.fixed = fixed;
  exports.latest = latest;
  exports.hist = hist;
  exports.event = event;
  exports.click = click;
  exports.mutate = mutate;
  exports.AudienceDetector = AudienceDetector;
  exports.audienceDetector = audienceDetector;
  exports.Bus = Bus;
  exports.bus = bus;
  exports.Broadcast = Broadcast;
  exports.broadcast = broadcast;
  exports.Cell = Cell;
  exports.cell = cell;
  exports.Cursor = Cursor;
  exports.cursor = cursor;
  exports.Events = Events;
  exports.events = events;
  exports.EventDispatcher = EventDispatcher;
  exports.eventDispatcher = eventDispatcher;
  exports.MessageHandler = MessageHandler;
  exports.messageHandler = messageHandler;
  exports.MessageProcessor = MessageProcessor;
  exports.messageProcessor = messageProcessor;
  exports.Middleware = Middleware;
  exports.middleware = middleware;
  exports.handles = handles;
  exports.affects = affects;
  exports.component = component;
  exports.Readonly = Readonly;
  exports.readonly = readonly;
  exports.Router = Router;
  exports.router = router;
  exports.handler = handler;
  exports.TimeTraveler = TimeTraveler;
  exports.timeTraveler = timeTraveler;
  exports.IDispatch = IDispatch;
  exports.IEvented = IEvented;
  exports.IEventProvider = IEventProvider;
  exports.IMiddleware = IMiddleware;
  exports.IPublish = IPublish;
  exports.ISubscribe = ISubscribe;
  exports.ITimeTraveler = ITimeTraveler;
  exports.dispatch = dispatch;
  exports.on = on$1;
  exports.off = off;
  exports.trigger = trigger;
  exports.one = one;
  exports.raise = raise;
  exports.release = release;
  exports.handle = handle;
  exports.pub = pub;
  exports.into = into;
  exports.sub = sub;
  exports.unsub = unsub;
  exports.subscribed = subscribed;
  exports.undo = undo;
  exports.undoable = undoable;
  exports.redo = redo;
  exports.redoable = redoable;
  exports.flush = flush;

  Object.defineProperty(exports, '__esModule', { value: true });

});
