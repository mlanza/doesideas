(function(){

  hljs.tabReplace = '  ';

  //custom builders used for rendering
  var builders = {
    pageIndex: function pageIndex(pages){
      var b = this;
      return b.section({class: 'pages'},
        b.ul(pages, function(idx, entry){
          b.li(b.a({href: '#' + entry.slug}, entry.title))
        })
      ).el()
    },
    postIndex: function postIndex(posts){
      var b = this;
      return _.chain(posts).groupBy(function(entry){
        return entry.year;
      }).map(function(posts, year){
        return {year: year, posts: posts}
      }).sortBy(function(group){
        return -group.year
      }).map(function(group){
        var posts = group.posts, year = group.year;
        return b.section({class: 'posts'}, function(){
          b.b(year);
          b.ul(posts, function(idx, entry){
            b.li(b.a({href: '#' + entry.slug}, entry.title))
          })
        }).el()[0]
      }).value()
    },
    pages: function pages(pages){
      return _.map(pages, this.page, this);
    },
    page: function(entry){
      var b = this;
      return _.tap(b.article({id: entry.slug},
        b.h1(entry.title),
        b.section({class: 'body'})
      ).el()[0], function(page){
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

  /* 
   * BLOG CONTENT TYPES
   */

  var Entry = $.index.Entry;

  function Site(data){
    _.extend(this, data || {})
  }

  Site.prototype = new Entry()

  function Page(data){
    data && (this.slug = data.source.split("/")[1].split(".")[0])
    _.extend(this, data || {})
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
    post: Post
  }

  //typecasts entries
  function typecaster(entry){
    var type = types[entry.type] || Entry
    return new type(entry)
  }

  //locates and displays the select content
  function router(hash, target, index, clustered){
    var title = clustered.site[0].title;
    if (target.length == 0) {
       $('title').html(title)
       return
    }
      
    $('article').css({display: 'none'}) //conceal all entries      
    target.css({display: 'block'})      //reveal selected entry
    var entry = $.data(target[0], 'entry')
    $('title').html(entry.title + ' - ' + title)
    $.data(target[0], 'entry').load(function(){
      $('#' + this.slug).find('section.body').append(this.body).find('pre code').each(function(idx, el) {hljs.highlightBlock(el)})
    })  
  }

  //renders the entire site
  function render(index, clustered, route){

    var site = clustered.site[0]
    var latestPost = clustered.post[0]

    Entry.prototype.remoteContentUrl = site.remoteContentUrl;

    $('title').html(site.title)
    $('body').build(builders, function(b){
      with(b){
        aside({id: 'sidebar'},
          img({id: 'logo', src: 'images/bulb.svg'}),
          h1('Does Ideas'),
          pageIndex(clustered.page),
          postIndex(clustered.post)
        )
        section({id: 'main'},
          section({id: 'pages'}, pages(clustered.page)),
          section({id: 'posts'}, posts(clustered.post))
        )
      }
    })

    $('.commentable').each(function(idx, commentable){
      var slug = $(commentable).attr('id')
      var id   = 'comments-' + idx
      var url  = site.domain +'/#!' + slug
      $('<section>').attr({id: id}).appendTo(commentable);
      gapi.comments.render(id, {
        href: url,
        first_party_property: 'BLOGGER',
        view_type: 'FILTERED_POSTMOD'
      });
    })

    route(latestPost.slug)

  }

  var blog = this.blog = {
    types: types,
    typecaster: typecaster,
    router: router,
    render: render
  }

  $.index(blog)

})(this)