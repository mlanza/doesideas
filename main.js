define('main', ['atomic/core', 'atomic/repos', 'atomic/dom', 'atomic/reactives', 'atomic/transducers'], function(_, r, dom, $, t){

  var li = dom.tag('li'),
      h1 = dom.tag('h1'),
      h2 = dom.tag('h2'),
      img = dom.tag('img'),
      a = dom.tag('a'),
      div = dom.tag('div'),
      tr = dom.tag('tr'),
      td = dom.tag('td'),
      tbody = dom.tag('tbody');

  var gists = _.just(
    r.request(r.url("https://api.github.com/gists/{id}")),
    r.raise,
    r.json);

  var qs = _.fromQueryString(location.href),
      asof = _.maybe(qs, _.get(_, "asof"), _.blot, _.date) || _.date();

  function markdown(text){
    return new Promise(function(resolve, reject){
      require(['showdown'], function(showdown){
        var converter = new showdown.Converter();
        resolve(converter.makeHtml(text));
      }, reject);
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

  function sess(f){
    return ("sessionStorage" in window) ? function(key){
      var found = sessionStorage.getItem(key);
      if (found) {
        return Promise.resolve(JSON.parse(found));
      } else {
        return _.fmap(f.apply(null, arguments), function(found){
          sessionStorage.setItem(key, JSON.stringify(found));
          return found;
        });
      }
    } : f;
  }

  var gist = sess(function(id){
    return _.query(gists, {id: id});
  });

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

  var expands = {
    "@gist:": gfile
  }

  var at2 = _.memoize(function($subject, path){
    var expansive = _.reFind(/(@(.*):)(.*)/, _);
    return $.map(_.pipe(_.getIn(_, path), function(text){
      if (_.isString(text)) {
        var match = expansive(text),
            what  = _.nth(match, 1),
            key   = _.nth(match, 3),
            find  = _.get(expands, what);
        if (find) {
          _.fmap(find(key), function(content){
            _.swap($subject, _.assocIn(_, path, content));
          });
          return null;
        }
      }
      return text;
    }), $subject);
  }, function($subject, path){
    return _.join("|", path);
  });

  function at3($subject, path, callback){
    $.sub(at2($subject, path), t.filter(_.identity), callback);
  }

  var at = _.overload(null, null, at2, at3);

  var dated = _.fmt(
    _.pipe(_.month, _.inc, _.zeros(_, 0)), "/",
    _.pipe(_.day, _.zeros(_, 0)), "/",
    _.year);

  var $hash = $.hashchange(window),
      $blog = $.fromPromise(
        _.fmap(
          gfile("3d3ddbf786b2edd486ace27dcac29365"),
          _.update(_, "posts", _.pipe(
            _.map(_.update(_, "published", _.date), _),
            _.filtera(_.pipe(_.get(_, "published"), _.lte(_, asof)), _),
            _.sort(_.desc(_.get(_, "published")), _)))),
        {}),
      $posts = $.map(_.pipe(_.get(_, "posts"), _.reduce(function(memo, post){
        return _.assoc(memo, post.slug, post);
      }, {}, _)), $blog);

  _.each(function(el){
    at($blog, ["site", "title"], dom.text(el, _));
  }, dom.sel("title,#sitename"))

  _.each(function(el){
    at($blog, ["whereabouts"], function(whereabouts){
      _.apply(dom.append, el, _.map(function(data){
        return li(a({href: data.href, title: data.title}, img({src: data.src})));
      }, whereabouts));
    });
  }, dom.sel("#whereabouts"));

  _.each(function(el){
    at($blog, ["quotes"], _.pipe(randomly, function(quote){
      var cite = document.createElement("cite");
      el.innerHTML = "“" + quote.said.replace(/\n/g, "<br>") + "”";
      cite.innerText = quote.who;
      el.appendChild(cite);
    }));
  }, dom.sel("#quote"));

  _.each(function(el){
    at($blog, ["posts"], function(posts){
      dom.empty(el);
      _.apply(dom.append, el, _.map(function(post){
        return tr(td({'class': 'title'}, a({href: "#post/" + post.slug}, h2(post.title)), div(post.excerpt)), td({'class': 'pub'}, dated(post.published)));
      }, posts));
    });
  }, dom.sel("#posts"));

  function pos(pred, xs){
    var idx = 0;
    while (idx < xs.length && !pred(xs[idx])){
      idx++;
    }
    return idx < xs.length ? idx : null;
  }

  var fwd = dom.sel1("#fwd"),
      bwd = dom.sel1("#bwd");

  $.sub($hash, t.map(_.identity), function(hash){
    dom.empty(dom.sel1("#post"));
    _.each(dom.hide, [fwd, bwd]);
  });

  $.sub($hash, _.comp(t.filter(_.startsWith(_, "#post/")), t.map(_.pipe(_.split(_, "/"), _.last))), function(slug){
    at($blog, ["posts"], function(posts){
      var idx = pos(function(post){
        return post.slug === slug;
      }, posts);

      var prev = _.maybe(posts, _.nth(_, idx - 1), _.get(_, "slug"), _.str("#post/", _)),
          next = _.maybe(posts, _.nth(_, idx + 1), _.get(_, "slug"), _.str("#post/", _));

      dom.toggle(bwd, prev);
      dom.toggle(fwd, next);
      dom.attr(bwd, "href", prev);
      dom.attr(fwd, "href", next);

      at($blog, ["posts", idx, "body"], function(){
        _.just($posts, _.deref, _.get(_, slug), function(post){
          _.doto(dom.sel1("#post"),
            dom.html(_, post.body),
            dom.prepend(_, h1(post.title)));
        });
        window.scrollTo(0,0);
      });
    });
  });

  $.sub($blog, _.see("blog"));

  return {
    $blog: $blog,
    at: at,
    gists: gists,
    gist: gist,
    gfiles: gfiles,
    gfile: gfile
  }
});