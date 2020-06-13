var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    layouts = require('metalsmith-layouts'),
    handlebars = require('handlebars'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    dateFormatter = require('metalsmith-date-formatter'),
    prism = require('metalsmith-prism'),
    wordcount = require('metalsmith-word-count'),
    tags = require('metalsmith-tags'),
    linkcheck = require('metalsmith-linkcheck'),
    debug = require('metalsmith-debug'),
    disqus = require('metalsmith-disqus');

Prism.languages.clojure = {
  'comment': /;+[^\r\n]*(\r?\n|$)/g,
  'string': /(")(\\?.)*?\1/g,
  'operator ': /(::|[:|'])\b[a-zA-Z][a-zA-Z0-9*+!-_?]*\b/g, //used for symbols and keywords
  'keyword': {
      pattern: /([^\w+*'?-])(def|if|do|let|quote|var|fn|loop|recur|throw|try|monitor-enter|\.|new|set!|def\-|defn|defn\-|defmacro|defmulti|defmethod|defstruct|defonce|declare|definline|definterface|defprotocol|defrecord|deftype|defproject|ns|\*|\+|\-|\->|\/|<|<=|=|==|>|>=|\.\.|accessor|agent|agent-errors|aget|alength|all-ns|alter|and|append-child|apply|array-map|aset|aset-boolean|aset-byte|aset-char|aset-double|aset-float|aset-int|aset-long|aset-short|assert|assoc|await|await-for|bean|binding|bit-and|bit-not|bit-or|bit-shift-left|bit-shift-right|bit-xor|boolean|branch\?|butlast|byte|cast|char|children|class|clear-agent-errors|comment|commute|comp|comparator|complement|concat|conj|cons|constantly|cond|if-not|construct-proxy|contains\?|count|create-ns|create-struct|cycle|dec|deref|difference|disj|dissoc|distinct|doall|doc|dorun|doseq|dosync|dotimes|doto|double|down|drop|drop-while|edit|end\?|ensure|eval|every\?|false\?|ffirst|file-seq|filter|find|find-doc|find-ns|find-var|first|float|flush|for|fnseq|frest|gensym|get-proxy-class|get|hash-map|hash-set|identical\?|identity|if-let|import|in-ns|inc|index|insert-child|insert-left|insert-right|inspect-table|inspect-tree|instance\?|int|interleave|intersection|into|into-array|iterate|join|key|keys|keyword|keyword\?|last|lazy-cat|lazy-cons|left|lefts|line-seq|list\*|list|load|load-file|locking|long|loop|macroexpand|macroexpand-1|make-array|make-node|map|map-invert|map\?|mapcat|max|max-key|memfn|merge|merge-with|meta|min|min-key|name|namespace|neg\?|new|newline|next|nil\?|node|not|not-any\?|not-every\?|not=|ns-imports|ns-interns|ns-map|ns-name|ns-publics|ns-refers|ns-resolve|ns-unmap|nth|nthrest|or|parse|partial|path|peek|pop|pos\?|pr|pr-str|print|print-str|println|println-str|prn|prn-str|project|proxy|proxy-mappings|quot|rand|rand-int|range|re-find|re-groups|re-matcher|re-matches|re-pattern|re-seq|read|read-line|reduce|ref|ref-set|refer|rem|remove|remove-method|remove-ns|rename|rename-keys|repeat|replace|replicate|resolve|rest|resultset-seq|reverse|rfirst|right|rights|root|rrest|rseq|second|select|select-keys|send|send-off|seq|seq-zip|seq\?|set|short|slurp|some|sort|sort-by|sorted-map|sorted-map-by|sorted-set|special-symbol\?|split-at|split-with|str|string\?|struct|struct-map|subs|subvec|symbol|symbol\?|sync|take|take-nth|take-while|test|time|to-array|to-array-2d|tree-seq|true\?|union|up|update-proxy|val|vals|var-get|var-set|var\?|vector|vector-zip|vector\?|when|when-first|when-let|when-not|with-local-vars|with-meta|with-open|with-out-str|xml-seq|xml-zip|zero\?|zipmap|zipper)(?=[^\w+*'?-])/g,
      lookbehind: true
  },
  'boolean': /\b(true|false)\b/g,
  'number': /\b-?(0x)?\d*\.?\d+\b/g,
  'punctuation': /[{}\[\](),]/g
};

metalsmith(__dirname)
  .metadata({
    site: {
      name: 'Does Ideas',
      author: "Mario T. Lanza"
    }
  })
  .source('./src')
  .destination('./public')
	.use(dateFormatter({
    dates: [{
      key: 'published',
      format: 'YYYY-MM-DD'
    }]
}))
  .use(tags({
    handle: 'tags',
    path: 'tagged/:tag.html',
    layout: 'tagged.html',
    sortBy: 'published',
    reverse: true,
    skipMetadata: false,
    metadataKey: "tags",
    slug: {mode: 'rfc3986'}
  }))
  .use(collections({
    articles: {
      pattern: 'articles/**/*.md',
      sortBy: 'published',
      reverse: true
    }
  }))
	.use(markdown({
    langPrefix: "language-",
    smartypants: true,
    gfm: true
  }))
  .use(wordcount())
  .use(prism({
    lineNumbers: true,
    decode: true,
    preload: ["javascript"]
  }))
	.use(permalinks({
	  relative: false,
		pattern: ':title',
    linksets: [{
      match: { collection: 'articles' },
      pattern: 'articles/:slug'
    }]
	}))
	.use(layouts({
		engine: 'handlebars',
		directory: './layouts',
		default: 'article.html',
		pattern: ["*/*/*html","*/*html","*html"],
	  partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      article: 'partials/article'
    }
	}))
  .use(disqus({
    siteurl: 'doesideas.com',
    shortname: 'doesideas'
  }))
	.use(serve({
	  port: 8080,
	  verbose: false
	}))
	.use(watch({
	  paths: {
      "${source}/**/*": true,
      "layouts/**/*": "**/*",
    }
	}))
  .use(linkcheck())
  .use(debug())
  .build(function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Build complete');
    }
  });