(function(){

  function loaded(){
    var hs = document.querySelectorAll("article h2");
    for(var h of hs){
      var p = document.createElement("p");
      h.parentNode.insertBefore(p , h);
      p.appendChild(h);
    }
  }

  window.onready = loaded;

})()