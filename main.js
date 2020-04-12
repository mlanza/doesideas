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

function gist(hash){
  var id = (hash || "").substring(1);
  var converter = new showdown.Converter();
  var article = document.createElement("article");
  id && fetch("https://api.github.com/gists/" + id).then(function(resp) {
    return resp.json();
  }).then(function(data){
    return converter.makeHtml(data.files["training-manuals.md"].content);
  }).then(function(html){
    article.innerHTML = html;
  });
  return article;
}

select(document.body.querySelectorAll("blockquote"));
document.body.appendChild(gist(window.location.hash));

    //"https://api.github.com/users/mlanza/repos"
