define('main', ['atomic/core', 'atomic/repos', 'atomic/dom'], function(_, r, dom){

  var blog = _.once(function(){
    return gfile("3d3ddbf786b2edd486ace27dcac29365");
  });

  var gists = _.just(
    r.request(r.url("https://api.github.com/gists/{id}")),
    r.raise,
    r.json);

  function markdown(text){
    return require(['showdown'], function(showdown){
      var converter = new showdown.Converter();
      return converter.makeHtml(text);
    });
  }

  var mimeTypes = {
    "application/json": JSON.parse,
    "text/markdown": markdown
  }

  function content(meta){
    var f = mimeTypes[meta.type];
    return f(meta.content);
  }

  function gist(id){
    return _.query(gists, {id: id});
  }

  function gfiles(id){
    return _.fmap(gist(id), _.get(_, "files"));
  }

  function gfile1(id){
    return _.fmap(gfiles(id), function(files){
      var key = _.first(_.keys(files));
      return files[key];
    }, content);
  }

  function gfile2(id, file){
    return _.fmap(gfiles(id), _.get(_, file), content);
  }

  var gfile = _.overload(null, gfile1, gfile2);

  function randomize(mn, mx) {
    var min = Math.ceil(mn),
        max = Math.floor(mx);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomly(xs){
    var idx = randomize(0, xs.length - 1);
    return xs[idx];
  }

  var quotes = _.once(function(){
    return _.fork(_.fmap(blog(), _.get(_, "quotes"), expand), function(){
      return [{
        "said": "To me, ideas are worth nothing unless executed. They are just a multiplier. Execution is worth millions.",
        "who": "Steve Jobs"
      }];
    }, _.identity);
  });

  function quote(){
    return _.fmap(quotes(), randomly);
  }

  function posts(){
    return _.fmap(blog(),
      _.get(_, "posts"),
      _.map(_.update(_, "published", _.date), _),
      _.filter(_.pipe(_.get(_, "published"), _.lte(_, _.date())), _),
      _.sort(_.asc(_.get(_, "published")), _));
  }

  function expand(text){
    return _.startsWith(text, "@gist:") ? gfile(_.replace(text, "@gist:", "")) : text;
  }

  _.maybe(dom.sel1("#quote"), function(el){
    _.fmap(quote(), function(quote){
      var cite = document.createElement("cite");
      el.innerHTML = "“" + quote.said.replace(/\n/g, "<br>") + "”";
      cite.innerText = quote.who;
      el.appendChild(cite);
    });
  });

  window.location.hash && gist(window.location.hash.substring(1)).then(function(data){
    var key = Object.keys(data.files)[0],
        content = data.files[key].content,
        converter = new showdown.Converter();
    document.getElementById("post").innerHTML = converter.makeHtml(content);
  });

  return {
    blog: blog,
    gists: gists,
    gist: gist,
    gfiles: gfiles,
    gfile: gfile,
    quotes: quotes,
    quote: quote,
    posts: posts
  }
});