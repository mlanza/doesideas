(function(){

  // 
  // renders the site
  //

  function render(index, info, route){

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
        b.h2('Entries'),
        b.postIndex(posts),
        b.tagCloud(tags)
      )
      b.section({id: 'main'},
        b.section({id: 'pages'}, b.pages(pages)),
        b.section({id: 'posts'}, b.posts(posts))
      )
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


  // 
  // content types
  //

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



  // 
  // router is called when the hash changes
  //

  function router(hash, target, index, info){
    var title = info.grouped.site[0].title;
    if (target.length == 0) {
       $('title').html(title)
       return
    }

    var entry = $.data(target[0], 'entry')
    
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