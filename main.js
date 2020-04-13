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

function gist(id){
  return fetch("https://api.github.com/gists/" + id).then(function(resp) {
    return resp.json();
  });
}

function quotes(){
  return gist("2d5f242de059c365f23dc6f786ef5788").then(function(data){
    var key = Object.keys(data.files)[0],
        quotes = JSON.parse(data.files[key].content);
    return quotes;
  }, function(){
    return [{
      "said": "To me, ideas are worth nothing unless executed. They are just a multiplier. Execution is worth millions.",
      "who": "Steve Jobs"
    }];
  });
}

select(document.body.querySelectorAll("blockquote"));
quotes().then(function(quotes){
  var idx = randomize(0, quotes.length - 1),
      quote = quotes[idx],
      bq = document.getElementById("quote"),
      cite = document.createElement("cite");
  bq.innerHTML = "“" + quote.said.replace(/\n/g, "<br>") + "”";
  cite.innerText = quote.who;
  bq.appendChild(cite);
});

window.location.hash && gist(window.location.hash.substring(1)).then(function(data){
  var key = Object.keys(data.files)[0],
      content = data.files[key].content,
      converter = new showdown.Converter();
  document.getElementById("post").innerHTML = converter.makeHtml(content);
});