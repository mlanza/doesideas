(function(){

  function randomize(mn, mx) {
    var min = Math.ceil(mn),
        max = Math.floor(mx);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function selectQuote(context){
    var els = context.querySelectorAll("blockquote"),
        sel = els[randomize(1, els.length) - 1];
    els.forEach(function(el){
      el.className = el == sel ? "selected" : "";
    });
  }

  selectQuote(document.body);

})();