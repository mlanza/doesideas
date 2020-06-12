requirejs.config({
  baseUrl: ".",
  waitSeconds: 0,
  paths: {
    "immutable": "vendor/immutable",
    "showdown": "vendor/showdown"
  },
  shim: {
    'vendor/collections-es6': {
      deps: ["symbol"]
    },
    'showdown': {
      exports: 'showdown'
    },
    'immutable': {
      exports: "Immutable",
    }
  }
});
define('promise', window.Promise ? [] : ["vendor/es6-promise"], function(Promise){
  window.Promise || (window.Promise = Promise);
  return window.Promise;
});
define('fetch', window.fetch ? [] : ["promise", "vendor/fetch"], function(){
  return window.fetch;
});
define('symbol', window.Symbol ? [] : ["vendor/symbol-es6"], function(){
  return window.Symbol;
});
define('map', window.Map ? [] : ['vendor/collections-es6'], function(){
  return window.Map;
});
define('set', window.Set ? [] : ['vendor/collections-es6'], function(){
  return window.Set;
});
define('weak-map', window.WeakMap ? [] : ['vendor/collections-es6'], function(){
  return window.WeakMap;
});
define('weak-set', window.WeakSet ? [] : ['vendor/collections-es6'], function(){
  return window.WeakSet;
});
define('atomic/core', ["vendor/atomic/core"], function(core){
  return Object.assign(core.placeholder, core.impart(core, core.partly));
});
define('atomic/dom', ["vendor/atomic/core", "vendor/atomic/dom"], function(core, dom){
  return Object.assign(dom, core.impart(dom, core.partly));
});
define('atomic/reactives', ["vendor/atomic/core", "vendor/atomic/reactives"], function(core, reactives){
  return core.impart(reactives, core.partly);
});
define('atomic/repos', ["vendor/atomic/core", "vendor/atomic/repos"], function(core, repos){
  return core.impart(repos, core.partly);
});
define('atomic/transducers', ["vendor/atomic/core", "vendor/atomic/transducers"], function(core, transducers){
  return core.impart(transducers, core.partly);
});
define('atomic/transients', ["vendor/atomic/core", "vendor/atomic/transients"], function(core, transients){
  return core.impart(transients, core.partly);
});
define('atomic/validates', ["vendor/atomic/core", "vendor/atomic/validates"], function(core, validates){
  return core.impart(validates, core.partly);
});
define('atomic/immutables', ["vendor/atomic/core", "vendor/atomic/immutables"], function(core, immutables){
  return core.impart(immutables, core.partly);
});
define('atomic', ['atomic/core', 'atomic/dom', 'atomic/immutables', 'atomic/reactives', 'atomic/transducers', 'atomic/transients', 'atomic/repos', 'atomic/validates'], function(core, dom, immutables, reactives, transducers, transients, repos, validates){
  return Object.assign({}, core, { //for in-browser testing, not for production use.
    core: core,
    dom: dom,
    immutables: immutables,
    reactives: reactives,
    transducers: transducers,
    transients: transients,
    validates: validates,
    repos: repos
  });
});
define('cmd', [], function(){
  var standard = {
    '_': 'atomic/core',
    '$': 'atomic/reactives',
    't': 'atomic/transducers',
    'dom': 'atomic/dom',
    'imm': 'atomic/immutables',
    'transients': 'atomic/transients',
    'vd': 'atomic/validates',
    'repos': 'atomic/repos'
  };

  return function cmd(imports){ //like requesting cmd.exe in Windows, for use in the browser REPL.
    var loaded = {}, what = Object.assign({}, standard, imports);

    function load(key, named){
      require([named], function(proposed){
        if (window[key] !== proposed) {
          loaded[key] = window[key] = proposed;
        }
      });
    }

    for(var key in what){
      load(key, what[key]);
    }

    console.log("Commands requested.");
    return loaded;
  }

});
require(['cmd'], function(cmd){
  window.cmd = cmd;
});
require(['main']);