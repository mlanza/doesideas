define(['exports', 'atomic/core', 'fetch', 'promise'], function (exports, _, fetch, Promise$1) { 'use strict';

  fetch = fetch && fetch.hasOwnProperty('default') ? fetch['default'] : fetch;
  var Promise$1__default = 'default' in Promise$1 ? Promise$1['default'] : Promise$1;

  function Request(url, options, config, interceptors, handlers) {
    this.url = url;
    this.options = options;
    this.config = config;
    this.interceptors = interceptors;
    this.handlers = handlers;
  }
  function request(url, config) {
    return new Request(url, {}, config || {}, [filling], []);
  }

  var filling = function filling(_arg) {
    return _.fmap(_arg, function (self) {
      return _.fill(self, self.config);
    });
  };

  var IAddress = _.protocol({
    addr: _.identity
  });

  var IIntercept = _.protocol({
    intercept: null
  });

  var IOptions = _.protocol({
    options: null
  });

  var IParams = _.protocol({
    params: null
  });

  function demand(self, keys) {
    return IIntercept.intercept(self, function (req) {
      var params = _.remove(function (_arg) {
        return _.contains(req, _arg);
      }, keys);

      if (_.seq(params)) {
        throw new TypeError("Missing required params — " + _.join(", ", _.map(function (_arg2) {
          return _.str("`", _arg2, "`");
        }, params)) + ".");
      }

      return req;
    });
  }

  function query(self, plan) {
    var _ref3, _ref4, _self;

    var keys = _.filter(function (_arg) {
      return _.startsWith(_arg, "$");
    }, _.keys(plan));

    var _ref = _.apply(_.dissoc, plan, keys);

    var _ref2 = _.selectKeys(plan, keys);

    return _ref3 = (_ref4 = (_self = self, function (_arg2) {
      return _.merge(_arg2, _ref);
    }(_self)), function (_arg3) {
      return IParams.params(_arg3, _ref2);
    }(_ref4)), _.fromTask(_ref3);
  }

  function fill(self, params) {
    var _ref5, _self2;

    return _ref5 = (_self2 = self, function (_arg4) {
      return _.edit(_arg4, "url", function (_arg5) {
        return _.fill(_arg5, params);
      });
    }(_self2)), function (_arg6) {
      return _.edit(_arg6, "options", function (_arg7) {
        return _.fill(_arg7, params);
      });
    }(_ref5);
  }

  function clone(self) {
    return new self.constructor(self.url, self.options, self.config, self.interceptors, self.handlers);
  }

  function addr(self) {
    return _.fill(_.str(self.url), self.config);
  }

  function assoc(self, key, value) {
    return _.edit(self, "config", function (_arg8) {
      return _.IAssociative.assoc(_arg8, key, value);
    });
  }

  function contains(self, key) {
    return _.IAssociative.contains(self.config, key);
  }

  function keys$1(self) {
    return _.IMap.keys(self.config);
  }

  function lookup(self, key) {
    return _.ILookup.lookup(self.config, key);
  }

  function params(self, params) {
    return _.edit(self, "url", function (_arg9) {
      return IParams.params(_arg9, params);
    });
  }

  function options(self, options) {
    return _.edit(self, "options", _.isFunction(options) ? options : function (_arg10) {
      return _.absorb(_arg10, options);
    });
  }

  function intercept(self, interceptor) {
    return prepend(self, function (_arg11) {
      return _.fmap(_arg11, interceptor);
    });
  }

  function fmap(self, handler) {
    return append(self, function (_arg12) {
      return _.fmap(_arg12, handler);
    });
  }

  function prepend(self, xf) {
    return _.edit(self, "interceptors", function (_arg13) {
      return _.prepend(_arg13, xf);
    });
  }

  function append(self, xf) {
    return _.edit(self, "handlers", function (_arg14) {
      return _.append(_arg14, xf);
    });
  }

  function fork(self, reject, resolve) {
    var _ref6, _ref7, _self3;

    return _ref6 = (_ref7 = (_self3 = self, Promise$1__default.resolve(_self3)), _.apply(_.pipe, self.interceptors)(_ref7)), function (_arg15) {
      return _.fmap(_arg15, function (self) {
        var _ref8, _fetch;

        return _ref8 = (_fetch = fetch(self.url, self.options), _.apply(_.pipe, self.handlers)(_fetch)), function (_arg16) {
          return _.fork(_arg16, reject, resolve);
        }(_ref8);
      });
    }(_ref6);
  }

  var behaveAsRequest = _.does(_.implement(_.ITemplate, {
    fill: fill
  }), _.implement(_.ICloneable, {
    clone: clone
  }), _.implement(_.ICoerceable, {
    toPromise: _.fromTask
  }), _.implement(_.IAppendable, {
    append: append
  }), _.implement(_.IPrependable, {
    prepend: prepend
  }), _.implement(_.IForkable, {
    fork: fork
  }), _.implement(_.IQueryable, {
    query: query
  }), _.implement(_.IAssociative, {
    assoc: assoc,
    contains: contains
  }), _.implement(_.ILookup, {
    lookup: lookup
  }), _.implement(_.IMap, {
    keys: keys$1
  }), _.implement(IAddress, {
    addr: addr
  }), _.implement(IOptions, {
    options: options
  }), _.implement(IParams, {
    params: params
  }), _.implement(IIntercept, {
    intercept: intercept
  }), _.implement(_.IFunctor, {
    fmap: fmap
  }));

  behaveAsRequest(Request);

  function Routed(requests) {
    this.requests = requests;
  }
  var routed = _.constructs(Routed);

  function xform(xf) {
    return function (self) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return _.edit(self, "requests", function (_arg2) {
        return _.mapa(function (_arg) {
          return _.apply(xf, _arg, args);
        }, _arg2);
      });
    };
  }

  function clone$1(self) {
    return new self.constructor(self.requests);
  }

  function filled(self) {
    return _.maybe(self, IAddress.addr, function (_arg3) {
      return _.test(/\{[^{}]+\}/, _arg3);
    }, _.not);
  }

  function fork$1(self, reject, resolve) {
    return _.IForkable.fork(_.detect(filled, self.requests), reject, resolve);
  }

  function addr$1(self) {
    return IAddress.addr(_.detect(filled, self.requests));
  }

  function first(self) {
    return _.first(self.requests);
  }

  function rest(self) {
    return _.rest(self.requests);
  }

  var behaveAsRouted = _.does(_.implement(_.ICloneable, {
    clone: clone$1
  }), _.implement(_.ICoerceable, {
    toPromise: _.fromTask
  }), _.implement(_.IForkable, {
    fork: fork$1
  }), _.implement(_.IQueryable, {
    query: query
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(IAddress, {
    addr: addr$1
  }), _.implement(_.ITemplate, {
    fill: xform(_.ITemplate.fill)
  }), _.implement(_.ICollection, {
    conj: xform(_.ICollection.conj)
  }), _.implement(IIntercept, {
    intercept: xform(IIntercept.intercept)
  }), _.implement(_.IFunctor, {
    fmap: xform(_.IFunctor.fmap)
  }), _.implement(_.IAssociative, {
    assoc: xform(_.IAssociative.assoc)
  }), _.implement(_.IMap, {
    dissoc: xform(_.IMap.dissoc)
  }), _.implement(IParams, {
    params: xform(IParams.params)
  }), _.implement(IOptions, {
    options: xform(IOptions.options)
  }));

  behaveAsRouted(Routed);

  function URL(url, xfq) {
    this.url = url;
    this.xfq = xfq;
  }

  URL.prototype.toString = function () {
    return this.url;
  };

  function url1(url) {
    return url2(url, _.identity);
  }

  var url2 = _.constructs(URL);
  var url = _.overload(null, url1, url2);

  function params$1(self, obj) {
    var _ref, _self$url, _ref2, _ref3, _ref4, _self$url2;

    var f = _.isFunction(obj) ? obj : function (_arg) {
      return _.merge(_arg, obj);
    };
    return new self.constructor(_.str((_ref = (_self$url = self.url, function (_arg2) {
      return _.split(_arg2, "?");
    }(_self$url)), _.first(_ref)), (_ref2 = (_ref3 = (_ref4 = (_self$url2 = self.url, _.fromQueryString(_self$url2)), f(_ref4)), self.xfq(_ref3)), _.toQueryString(_ref2))), self.xfq);
  }

  function fill$1(self, params) {
    return _.ITemplate.fill(_.str(self), params);
  }

  var behaveAsURL = _.does(_.implement(IParams, {
    params: params$1
  }), _.implement(_.ITemplate, {
    fill: fill$1
  }));

  behaveAsURL(URL);

  var addr$2 = IAddress.addr;

  var intercept$1 = IIntercept.intercept;

  var options$1 = IOptions.options;
  function json(req) {
    var _ref, _req;

    return _ref = (_req = req, function (_arg) {
      return IOptions.options(_arg, {
        credentials: "same-origin",
        headers: {
          "Accept": "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose"
        }
      });
    }(_req)), function (_arg2) {
      return _.fmap(_arg2, function (resp) {
        return resp.json();
      });
    }(_ref);
  }
  function method(req, method) {
    return IOptions.options(req, {
      method: method
    });
  }

  var params$2 = IParams.params;

  function text(req) {
    return _.fmap(req, function (resp) {
      return resp.text();
    });
  }
  function xml(req) {
    var parser = new DOMParser();
    return _.fmap(text(req), function (text) {
      return parser.parseFromString(text, "text/xml");
    });
  }
  function raise(req) {
    return _.fmap(req, function (resp) {
      return new Promise$1__default(function (resolve, reject) {
        return resp.ok ? resolve(resp) : reject(resp);
      });
    });
  }
  function suppress(req, f) {
    return _.fmap(req, function (resp) {
      return new Promise$1__default(function (resolve, reject) {
        return resp.ok ? resolve(resp) : resolve(f(resp));
      });
    });
  }

  function params$3(self, obj) {
    var _ref, _self, _ref2, _ref3, _self2;

    var f = _.isFunction(obj) ? obj : function (_arg) {
      return _.merge(_arg, obj);
    };
    return _.str((_ref = (_self = self, function (_arg2) {
      return _.split(_arg2, "?");
    }(_self)), _.first(_ref)), (_ref2 = (_ref3 = (_self2 = self, _.fromQueryString(_self2)), f(_ref3)), _.toQueryString(_ref2)));
  }

  _.implement(IParams, {
    params: params$3
  }, String);

  exports.text = text;
  exports.xml = xml;
  exports.raise = raise;
  exports.suppress = suppress;
  exports.Request = Request;
  exports.request = request;
  exports.demand = demand;
  exports.Routed = Routed;
  exports.routed = routed;
  exports.URL = URL;
  exports.url = url;
  exports.IAddress = IAddress;
  exports.IIntercept = IIntercept;
  exports.IOptions = IOptions;
  exports.IParams = IParams;
  exports.addr = addr$2;
  exports.intercept = intercept$1;
  exports.options = options$1;
  exports.json = json;
  exports.method = method;
  exports.params = params$2;

  Object.defineProperty(exports, '__esModule', { value: true });

});
