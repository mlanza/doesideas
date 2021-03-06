I love modular designs and anything that supports them.  There are many reasons why symlinks are one of my favorite features of Unix-based OSes.  This article discusses how they can be used to support modularity.

Rails has been termed: "opinionated software".  As a developer, I generally know why I do things the way I do and have formed my own strong opinions.  I strongly feel that things--including software--should be made as modular as possible.  While modularity encompasses many things, I want to address just one aspect.

A well-designed module is Lego-like.  When I need it, I snap it into place.  When I no longer need it, I snap it out.  Easy peasy.  That's not to say that my module doesn't interact with different areas of my app, just that it's [loosely coupled](http://en.wikipedia.org/wiki/Loose_coupling) and well contained.

Less modular software spreads its tentacles.  It requires me to modified foreign code found elsewhere in my app.  It infects my app's directory tree, seeding bits of itself throughout.  You know what this reminds me of?  What happens when I install, try, and then uninstall software.  It leaves behind cruft because the uninstall program doesn't always reliably reverse the installation.  On Windows this might be an abandoned DLL, an ini file, or orphaned registry settings.  I can't help it: I like trying out software.  However, gradually, as I continue making these sorts of changes to my machine, it becomes more sluggish and works less well.  (For me this is best solved by wiping the slate clean: the ol' format and reinstall.)

Who can be blamed?  The programmers who wrote the installation software?  I cite the practice of creating something that has to be "wired up" in order to work.  In an ideal world extending anything should be as easy as extending my iPod with earbuds.  They just click in to a well-defined interface.  There is no _need_ to reverse-engineer an installation process.  You just remove it.  Done.

I think experienced designers generally strive for this.  It's not easy.  Sometimes the pre-existing designs with which our extensions interact are such that we _have_ to wire things up--the overall architecture necessitates it.  Think Rails migrations.  This can't always be avoided.  I'm just saying: in as much as possible, move toward plug-n-play designs.

I've found one such opportunity in my use of [Radiant CMS](http://radiantcms.org/).  Radiant was designed with modularity in mind.  Radiant extensions (I believe Rails engines is a similar idea) are dropped in to the <kbd>vendor</kbd> directory of your app.  In as much as the developer wants, the internal file structure of an extension mirrors the file structure of the app that contains it.  Through the clever use of the <kbd>$LOAD&#95;PATH</kbd> the internal files appear as if they are actually part of the app itself.  This makes extending Radiant a very pleasant experience.  My one gripe with this is the need to run an <kbd>update</kbd> rake task which copies the files from the extension's internal <kbd>public</kbd> folder to the app's <kbd>public</kbd> folder.  This is a bad practice.  Some extensions I'll eventually want to remove.  And often there _is_ no "uninstall" task.

Ideally--down migrations aside--removing an unwanted extension should be as easy as:

    git rm vendor\extensions\unwanted-extension

It should leave behind no residual .js, .css, and .png files.  Sure, I can manually pull these weeds, but the point is: I shouldn't have to.  This is where symlinks provide a nice solution.

By symlinking an extension's assets to its corresponding location in the site's public folder, our module's wiring is soft, not hard.  When I'm done with an extension, I delete it.  Left behind are broken symlinks that can be easily spotted and removed.  (A simple script makes this an afterthought.)  The broken symlink carries with it a reference to the file it once linked.  This information is useful forensic evidence.  Thank you, Symlink.

As an added bonus, when you're working on a symlinked extension in your text editor all of the files you'd care to modify (including the public assets) are contained in the extension itself.  You don't have to drill down <kbd>public</kbd> to find the asset you're after.  Everything related to <kbd>extension-x</kbd> is in the <kbd>vendor/extension-x</kbd> directory right where you're working and right where it belongs.  Frankly, I find symlinked assets such a convenience that I'm surprised its not a more common practice--even a "best practice".  _I'm guessing that Windows lack of symlink support inhibits this from becoming an accepted standard._

If you're not using symlinks this way, I recommend you dip your toe in the water.  I've written [Symplify](https://github.com/mlanza/symplify): a rake file that provides a few symlink tasks.  It will easily symlink your extension's assets to your public folder.  Likewise, it will remove your broken symlinks once you've removed an extension.  You'll be left cruft-free every time.  Enjoy.

**Added on 2011-05-22:**

I was just listening to [DHH's 2011 RailsConf keynote](http://www.youtube.com/watch?v=cGdCI2HhfAU) and learned about the Rails 3.1 asset pipeline.  This offers another good solution to modularizing assets.  I'll try it soon.

