var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var handlebars = require('handlebars');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
var dateFormatter = require('metalsmith-date-formatter');
var prism = require('metalsmith-prism');
var wordcount = require('metalsmith-word-count');
var tags = require('metalsmith-tags');

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
    layout:'tags.html',
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
	  verbose: true
	}))
	.use(watch({
	    paths: {
	      "${source}/**/*": true,
	      "layout/**/*": "**/*",
	    }
	  }))
  .build(function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Build complete');
    }
  });