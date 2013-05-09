(function(){

  function parseGFM(markdown){
    return $.Deferred(function(dfd) {
      setTimeout(function(){
        $.ajax({
          type: "POST",
          url: 'https://api.github.com/markdown/raw',
          data: markdown,
          headers: {'Content-Type': 'text/plain'},
          dataType: 'text'
        }).
          done(dfd.resolve).
          always(logAjaxAttempt).
          fail(logAjaxIssue).
          fail(function(){
            dfd.resolve(marked.parse(markdown)) //use local parsing if remote fails
          })
      },10)
    }).promise();   
  }

  function parseMarkdown(markdown){
    return $.Deferred(function(dfd) {
      setTimeout(function(){
        dfd.resolve(marked.parse(markdown))
      },10)
    }).promise();   
  }

  function loadRemoteContent(slug){
    return $.ajax({
      url: Entry.remoteContentUrl + "/" + slug,
      dataType: "text",
      headers: {Accept: 'application/vnd.github.3.raw'}
    })
  }

  function loadLocalContent(slug){
    return $.ajax({
      url: slug,
      dataType: "text"
    })
  }  

  this.Entry = function Entry(data){
    _.extend(this, data || {})
  }
  Entry.prototype.load = function(loaded){
    var entry = this; loaded || (loaded = function(){});
    loaded = _.bind(loaded, this)
    return $.Deferred(function(dfd){
      setTimeout(function(){
        if (!entry.body){
          entry.loader(entry.source).done(function(body){
            entry.parser(body).done(function(html){
              entry.body = html
              dfd.resolve(entry)
            }).fail(dfd.reject)
          }).fail(dfd.reject);
        }
      },10)
    }).done(loaded).promise()
  }

  Entry.remoteContentUrl = '';
  Entry.prototype.parser = parseMarkdown;
  Entry.prototype.parsers = {
    parseGFM: parseGFM,
    parseMarkdown: parseMarkdown
  }

  Entry.prototype.loader = loadLocalContent;
  Entry.prototype.loaders = {
    loadLocalContent: loadLocalContent,
    loadRemoteContent: loadRemoteContent
  }

  function Page(data){
    data && (this.slug = data.source.split("/")[1].split(".")[0])
    _.extend(this, data || {})
  }

  Page.prototype = new Entry()

  function Post(data){
    _.extend(this, data || {})
    this.publishedAt = new Date(data.date);
    this.slug = data.source.split("/")[1].split(".")[0];
    this.year = this.publishedAt.getFullYear()
  }
  Post.prototype = new Page();

  var types = this.types = {
    pages: Page,
    posts: Post
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

  function expand(index){
    _.each(types, function(cons, key){
      index[key] = _.map(index[key], function(data){
        return new cons(data)
      }) 
    })
    return index;
  }

  $.index = function Index(filename){
    return $.Deferred(function(dfd){
      setTimeout(function(){
        $(document).ready(function() {
          $.getJSON(filename).done(function(index){
            dfd.resolve(expand(index))
          }).fail(dfd.reject);
        })
      }, 10)
    }).promise()
  }

})(this);