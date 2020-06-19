---
title: On The Necessity of Pipeline Operators
slug: necessity-of-pipeline-operators
author: Mario T. Lanza
published: 2020-06-19
tags: programming, fp, javascript
comments: true
teaser: And build-free workarounds in their absence
summary: Modern features like pipeline operators are indispensable but, because of spotty browser support, apart from build tools, you can't rely on them.  You can, however, fill in the feature gap by baking the right facilities into your toolkit.  In this way you can reap benefits without necessitating builds.
---

FP helps programmers understand and appreciate the beauty of pure functions.  It provides a mental framework<sup>[1](#1)</sup> for how programs can be safely composed and greatly simplified.  It prefers to tease apart monolithic computations into meaningful steps which can be reconstituted.

Here is the [world state](https://docs.racket-lang.org/teachpack/world.html#%28part._.Simulations_of_the_.World%29) for a poker game.

```javascript
const holdem = {
	handsPlayed: 0,
	table: [{
		name: "Fred",
		hole: [],
		bet: 0,
		reserve: 1000
	},{
		name: "Barney",
		hole: [],
		bet: 0,
		reserve: 1000		
	},{
		name: "Wilma",
		hole: [],
		bet: 0,
		reserve: 1000  
	},{
		name: "Betty",
		hole: [],
		bet: 0,
		reserve: 1000	  
	}],
	dealer: "Fred",
	board: {up: [], down: []},
	deck: [{suit: "H", rank: "Ace"}, {suit: "H", rank: "King"}, ...]
}
```
It has a known structure which is advanced by a `startGame` computation.  

```javascript
let state = startGame(holdem);
```
For the sake of readability, transparency, and composability, let's deconstruct it.

```javascript
let state = flop(deal(anteBlinds(shuffle(holdem), 5), 2));
```
That's a step in the right direction; however, nesting functions degrades readability.  Your eyes have to bounce around to understand which args<sup>[2](#2)</sup> go with which functions. 

It's a shame programs ever had to be written this way.  It's not unreasonable to use nesting that is shallow, but it doesn't take much depth before readability begins to suffer. 

The Unix shell and functional languages restored reading to a smooth stream by utilizing pipes.

```javascript
let state = holdem |> shuffle |> anteBlinds(?, 5) |> deal(?, 2) |> flop;
```
Ah. It flows again!  And the args are kept in close proximity to their functions.  No wonder most languages have adopted the [pipeline operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Pipeline_operator).

JavaScript, however, has lingered behind.  It wants it desperately, but the proposal has stalled.  You can get it with [Babel](https://babeljs.io/), but I ordinarily like to avoid builds<sup>[3](#3)</sup>—and so I code scripts to the lowest common denominator modern browsers afford.

I think of programs as data flowing through pipes.  I build from simple parts, bottom up, until a program culminates. Pipelines are my bread and butter.  This makes the pipeline operator indispensable.  

In its absence I proxied what I considered JavaScript's missing features into [my toolkit](https://github.com/mlanza/atomic).  

`Just` takes a subject and sends it through a series of transformations.  The following achieves the same result as earlier.  
```javascript
let state = _.just(holdem, 
	shuffle, 
	_.partial(anteBlinds, _, 5), 
	_.partial(deal, _, 2), 
	flop);
```
[`Partial`](https://underscorejs.org/#partial), here, accepts placeholders, but it increases the signal-to-noise ratio.  I use a higher-order function, called `partly`, to bake placeholder support into the stand-in functions it returns.  With this, the code becomes:
```javascript
let state = _.just(holdem, shuffle, anteBlinds(_, 5), deal(_, 2), flop);
```
The unfortunate trade off is the use of stand-ins adds a smidge of overhead to function calls although, in practice, it's held up fine in production.

In addition to `just` I have `maybe` which, as you might suppose, short-circuits whenever it encounters `null`<sup>[4](#4)</sup>.  

I abandoned [`curry`](https://ramdajs.com/docs/#curry) in favor of the autopartial technique I described.  Coming from the Clojure school of though I write variadic functions with which, [as you may know](https://stackoverflow.com/questions/31373507/rich-hickeys-reason-for-not-auto-currying-clojure-functions), `curry` is incompatible.  

With autopartial you choose which arity to call by slotting in the appropriate number of placeholders.  Imagine an overloaded `fullname` function.  At arity two it accepts first and last name.  At arity 3, first, middle and last.

```javascript
const doe = fullname(_, "Doe"); // deliberate use of 2 arity
const janedoe = doe("Jane"); // complete
// vs.
const doe = fullname(_, _, "Doe"); // deliberate use of 3 arity
const janedoe = doe("Jane", "H."); // complete
const hdoe = doe(_, "H."); // deplay completion
const johndoe = hdoe("John"); // complete
```
I also built facilities for function overloading and [protocols](https://clojure.org/reference/protocols).  I've been using them in production for years.  They've provided a reasonable compromise for getting readability and better facilities without a build step, however...  

I *eagerly* await the pipeline operator's adoption<sup>[5](#5)</sup> into modern browsers.  Once in place, I'll gladly uproot these hacks.  Fortunately, because my stand-ins maintains parity with the [pipeline operator proposal](https://github.com/tc39/proposal-pipeline-operator) and its [little brother](https://github.com/tc39/proposal-partial-application), that retrofit should be straightforward.

<ol class="footnotes">
<a name='1'><li>I've found Clojure's principles work equally well in JavaScript.</li></a>
<a name='2'><li>But for illustrative purposes, these could've all been unary functions.</li></a>
<a name='3'><li>Builds have benefits but add complexity.  I use them on core libraries, but not site/page customizations.</li></a>
<a name='4'><li>It treats `null` and `undefined` as a singlular concept, what Clojure terms `nil`.</li></a>
<a name='5'><li>I covet protocols more than any other native JavaScript feature.</li></a>
</ol>