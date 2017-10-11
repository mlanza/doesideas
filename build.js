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
    debug = require('metalsmith-debug');

metalsmith(__dirname)
  .metadata({
    site: {
      name: 'Does Ideas',
      author: "Mario T. Lanza"
    }
  })
  .source('./src')
  .destination('./public')
	.use(dateFormatter())
  .use(tags({
    handle: 'tags',
    path:'tagged/:tag.html',
    layout:'tagged.html',
    sortBy: 'date',
    reverse: true,
    skipMetadata: false,
    metadataKey: "category",
    slug: {mode: 'rfc3986'}
  }))
  .use(collections({
    articles: {
      pattern: 'articles/**/*.md',
      sortBy: 'date',
      reverse: true
      },
    }))
	.use(markdown({langPrefix: "language-"}))
  .use(wordcount())
  .use(prism({
    lineNumbers: true,
    decode: true,
    preload: ["javascript"]
  }))
	.use(permalinks({
	  relative: false,
		pattern: ':title'
	}))
	.use(layouts({
		engine: 'handlebars',
		directory: './layouts',
		default: 'article.html',
		pattern: ["*/*/*html","*/*html","*html"],
	  partials: {
      header: 'partials/header',
      footer: 'partials/footer'
    }
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
  .use(debug())
  .build(function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Build complete');
    }
  });