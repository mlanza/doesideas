(function(){

  function param(nm) {
    var name = nm.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]'),
        results = (new RegExp('[\\?&]' + name + '=([^&#]*)')).exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function randomize(mn, mx) {
    var min = Math.ceil(mn),
        max = Math.floor(mx);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function select(els){
    var sel = els[param('idx') || randomize(0, els.length - 1)];
    els.forEach(function(el){
      el.className = el == sel ? "selected" : "";
    });
  }

  select(document.body.querySelectorAll("blockquote"));

})();