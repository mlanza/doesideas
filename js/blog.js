(function(){

  //custom builders used for rendering
  var builders = {
    pageIndex: function(pages){
      var b = this;
      return b.section({class: 'pages'},
        b.ul(pages, function(idx, entry){
          b.li(b.a({href: '#' + entry.slug}, entry.title))
        })
      ).el()
    },
    postIndex: function(posts){
      var b = this;
      return _.chain(posts).groupBy(function(entry){
        return entry.year;
      }).map(function(entries, year){
        return {year: year, entries: entries}
      }).sortBy(function(group){
        return -group.year
      }).map(function(group){
        var entries = group.entries, year = group.year;
        return b.section({class: 'posts'}, function(){
          b.b(year);
          b.ul(entries, function(idx, entry){
            b.li(b.a({href: '#' + entry.slug}, entry.title))
          })
        }).el()[0]
      }).value()
    },
    pages: function(pages){
      var b = this;
      return _.chain(pages).map(function(entry){
        var page = b.article({id: entry.slug},
          b.h1(entry.title),
          b.section({class: 'body'})
        ).el()[0];
        $.data(page, 'entry', entry)
        return page;
      }).value();
    },
    posts: function(posts){
      var b = this;
      return _.map(posts, function(entry){
        var post = b.article({id: entry.slug}, 
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
          b.section({class: 'body'}),
          b.section({class: 'comments'})
        ).el()[0];
        $.data(post, 'entry', entry)
        return post;
      })      
    }
  }

  function disqus(entry){
    window.disqus_shortname = 'doesideas'
    window.disqus_identifer = entry.slug
    window.disqus_url = "http://doesideas.com/#" + entry.slug

    if (window.DISQUS) {
      DISQUS.reset({
        reload: true,
        config: function () {  
          this.page.slug = window.disqus_identifer
          this.page.developer = 1
          this.page.title = entry.title
          this.page.language = "en"    
          this.page.identifier = window.disqus_identifer
          this.page.url = window.disqus_url
        }
      })
    } 
  }

  /* 
   * BLOG CONTENT TYPES
   */

  var Entry = $.index.Entry;

  Entry.prototype.remoteContentUrl = "https://api.github.com/repos/mlanza/doesideas/contents";

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
          section({id: 'posts'}, posts(clustered.post)),
          section({id: 'comments'}, div({id: 'disqus_thread'}))
        )
      }
    })

    route(latestPost.slug)

  }

  var blog = {
    types: types,
    typecaster: typecaster,
    router: router,
    render: render
  }

  $.index.blog = blog

})(this)