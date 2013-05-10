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
          fail(function(){ //fallback to local parsing
            parseMarkdown(markdown).
              done(dfd.resolve).
              fail(dfd.reject)
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
      url: Entry.prototype.remoteContentUrl + "/" + slug, //TODO fix
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

  function Entry(data){
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
              dfd.resolve(entry, true)
            }).fail(dfd.reject)
          }).fail(dfd.reject);
        } else {
          dfd.resolve(entry, false);
        }
      },10)
    }).done(loaded).promise()
  }
  Entry.prototype.published = function(){
    return true;
  }

  Entry.prototype.remoteContentUrl = '';
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

  function typecaster(entry){
    var type = $.index.types[entry.type] || Entry;
    return new type(entry)
  }

  function route(defaultHash){
    $(window).hashchange()
    if (location.hash.length < 2) location.hash = defaultHash
  }

  $.index = function index(options){
    options = _.defaults(options || {}, {filename: 'index.json', typecaster: typecaster, render: function(){}})
    return $.Deferred(function(dfd){
      setTimeout(function(){
        $(document).ready(function() {
          $.getJSON(options.filename).done(function(index){
            var 
              typed   = _.chain(index).map(options.typecaster).filter(function(entry){
                return entry.published()
              }).sortBy(function(entry){
                return entry.sortKey
              }).value(),
              info = { 
                grouped: _.groupBy(typed, function(entry){
                  return entry.type
                }),
                tags: _.chain(typed).map(function(entry){
                  return entry.tags || [];
                }).flatten().countBy(function(tag){
                  return tag;
                }).pairs().sortBy(function(kvp){
                  return kvp[0]
                }).sortBy(function(kvp){
                  return -kvp[1]
                }).map(function(kvp){
                  return {tag: kvp[0], count: kvp[1]}
                }).value()
              }

            options.router && $(window).hashchange(function(){
              var hash = location.hash;
              var target = $(hash);              
              options.router(hash, target, typed, info)
            })
            dfd.resolve(typed, info, route)
          }).fail(dfd.reject);
        })
      }, 10)
    }).promise().done(options.render)
  }

  $.index.types = {}
  $.index.Entry = Entry;

})(this);