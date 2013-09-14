(function(){

  //
  // renders the site
  //

  function render(index, route){
    var about = _.detect(index, function(asset){
      return asset instanceof Page && asset.title === "About"
    });
    index.splice(index.indexOf(about) + 1, 0, new Page({slug: 'articles', title: 'Articles', source: function(){
      return this.postIndex(posts)[0]
    }}));

    var info = {
      grouped: _.groupBy(index, function(entry){
        return entry.type
      }),
      tags: _.chain(index).map(function(entry){
        return entry.tags || []
      }).flatten().countBy(function(tag){
        return tag
      }).pairs().sortBy(function(kvp){
        return kvp[0]
      }).sortBy(function(kvp){
        return -kvp[1]
      }).map(function(kvp){
        return {tag: kvp[0], count: kvp[1]}
      }).value()
    }

    var site  = info.grouped.site[0],
        pages = info.grouped.page,
        posts = info.grouped.post, latest= posts[0],
        tags  = info.tags

    hljs.tabReplace = '  ' // use 2 space tabs in code samples

    Entry.prototype.remoteContentUrl = site.remoteContentUrl;

    $('title').html(site.title)
    $('body').build(helpers, function(b){
      b.aside({id: 'sidebar'},
        b.a({href:'/'}, b.img({id: 'logo', src: 'images/bulb.svg', alt: 'light bulb logo'})),
        b.h1('Does Ideas'),
        b.pageIndex(pages),
        b.tagCloud(tags)
      )
      b.section({id: 'main'},
        b.section({id: 'pages'}, b.pages(pages)),
        b.section({id: 'posts'}, b.posts(posts))
      ),
      b.a({href: '#articles'}, b.img({src: 'images/toc.svg', id: 'toc-icon', class: 'nav', title: 'list of articles'})),
      b.a({href: ''}, b.img({src: 'images/left-arrow.svg', id: 'later-icon', class: 'nav', title: 'later article'})),
      b.a({href: ''}, b.img({src: 'images/right-arrow.svg', id: 'earlier-icon', class: 'nav', title: 'earlier article'}))
    })

    $('.nav').click(function(){
      $('html, body').animate({ scrollTop: 0 }, 500);
    })

    route(latest.slug)

  }

  function entryIndex(type){
    return function buildIndex(entries){
      var b = this;
      return b.section({class: type},
        b.ul(entries, function(idx, entry){
          b.li((entry.tags ? {'data-tags': entry.tags.join(' ')} : {}), b.a({href: '#' + entry.slug}, entry.title))
        })
      ).el()
    }
  }

  //rendering helpers
  var helpers = {
    pageIndex: entryIndex('pages'),
    postIndex: entryIndex('posts'),
    tagCloud: function tagCloud(tags){
      var b = this;
      return b.ul({id: 'tag-cloud'}, tags, function(idx, tagInfo){
        b.li({'data-count': tagInfo.count}, b.a(tagInfo.tag)).click(function(event){
          event.preventDefault();
          $(this).toggleClass('selected');
          var selected = [];
          $('#tag-cloud li.selected a').each(function(){
            selected.push($(this).text())
          })
          $('[data-tags]').css({opacity: selected.length == 0 ? '1' : '.25'})
          var selector = _.map(selected, function(tag){
            return "[data-tags~='" + tag + "']"
          }).join(', ')
          $(selector).css({opacity: '1'});
        })
      }).el()[0]
    },
    pages: function pages(pages){
      return _.map(pages, this.page, this);
    },
    page: function(entry){
      var b = this, body = _.isFunction(entry.source) ? entry.source : null;
      var article = b.article({id: entry.slug},
        b.h1(entry.title),
        b.section({class: 'body'}, body)
      ).el()[0];
      return _.tap(article, function(page){
        $.data(page, 'entry', entry)
      })
    },
    posts: function posts(posts){
      return _.map(posts, this.post, this)
    },
    post: function post(entry){
      var b = this;
      return _.tap(b.article({id: entry.slug, class: 'commentable'},
        b.span({class: 'date'}, entry.date),
        entry.tags,
        function(idx, tag){
          b.span({class: 'tag'}, tag);
        },
        b.h1(entry.title),
        function(x){
          if (entry.subtitle){
            b.p({class: 'subtitle'}, entry.subtitle)
          }
        },
        b.section({class: 'body'})
      ).el()[0], function(post){
        $.data(post, 'entry', entry)
      })
    }

  }


  //
  // content types
  //

  var Entry = $.index.Entry, Redirect = $.index.Redirect;

  function Site(data){
    _.extend(this, data || {})
  }

  Site.prototype = new Entry()

  function Page(data){
    data && _.isString(data.source) && (this.slug = data.source.split("/")[1].split(".")[0])
    _.extend(this, data || {})
    this.type || (this.type = 'page');
  }

  Page.prototype = new Entry()

  function Post(data){
    _.extend(this, data || {})
    this.publishedAt = new Date(data.date)
    this.sortKey = -this.publishedAt.valueOf()
    this.slug = data.source.split("/")[1].split(".")[0]
    this.year = this.publishedAt.getFullYear()
  }
  Post.prototype = new Page();
  Post.prototype.published = function(){
    return new Date() >= this.publishedAt
  }

  var types = {
    site: Site,
    page: Page,
    post: Post,
    redirect: Redirect
  }

  //typecasts entries
  function typecaster(entry){
    var type = types[entry.type] || Entry
    return new type(entry)
  }



  //
  // router is called when the hash changes
  //

  function router(hash, target, index){
    var site = _.detect(index, function(item){
      return item instanceof Site;
    });
    var posts = _.select(index, function(item){
      return item instanceof Post;
    }).reverse();
    var title = site.title;
    if (target.length == 0) {
       $('title').html(title)
       return
    }

    var entry = $.data(target[0], 'entry');
    var viewingArticles = entry.slug === 'articles';
    var pos = posts.indexOf(entry); if (pos === -1) pos = -2;
    var laterSlug   = (posts[pos - 1] || {}).slug;
    var earlierSlug = (posts[pos + 1] || {}).slug;
    var laterIcon   = $('#later-icon').parent(); laterSlug ? laterIcon.attr({href: '#' + laterSlug}).css({opacity: '1'}) : laterIcon.removeAttr('href').css({opacity: '.5'});
    var ealierIcon  = $('#earlier-icon').parent(); earlierSlug ? ealierIcon.attr({href: '#' + earlierSlug}).css({opacity: '1'}) : ealierIcon.removeAttr('href').css({opacity: '.5'});
    var tocIcon     = $('#toc-icon').parent(); viewingArticles ? tocIcon.removeAttr('href').css({opacity: '.5'}) : tocIcon.attr({href: '#articles'}).css({opacity: '1'});
    var tagCloud    = $('#tag-cloud').css({opacity: viewingArticles ? '1' : '.5'});

    //locates and displays the select content
    $.when($('article').fadeOut()).then(function(){
      $('title').html(entry.title + ' - ' + title)
    }).then($.data(target[0], 'entry').load(function(entry, first){
      if (!first) return;
      $('#' + this.slug).find('section.body').append(this.body).find('pre code').each(function(idx, el) {hljs.highlightBlock(el)})
    })).then(function(){
      target.fadeIn()
    })
  }


  //
  // generate the site!
  //

  $.index({
    typecaster: typecaster,
    router: router,
    render: render
  })

})(this)