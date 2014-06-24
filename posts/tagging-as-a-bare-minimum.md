Modern sites and apps offer simple -- and sometimes insufficient -- strategies for tracking and managing user information.  In Chrome I can track bookmarks.  On [Amazon](amazon.com) I can track wishlist items.  On [github](github.com) I can star repos.  On [boardgamegeek](boardgamegeek.com) I can track what board games I own, what ones I want, and other minutia.

The trouble is some of these "insufficient" strategies don't accommodate how users actually track and use information.  Take github.  At the barest level it allows users to star repos.  Now that'd be fine if users only actually had one reason for starring a repo, but that's not true in my case.  I star repos for several possible reasons and a star fails to qualify that.  While offering stars is better than offering nothing, I'll make a case for another organizational strategy that is easy to implement, infinitely flexible, friendly and familiar.  I see no reason why if users are permitted to track information (star repos), they shouldn't be provided with the bare minimum level of functionality we find in tagging.  To understand why tagging is such a good strategy, we should examine how other strategies fall short.

Let's start with bookmarks.  I have hundreds of them.  As with starring repos, I have various reasons for adding bookmarks:

1) I want to read it later.
2) The information might be useful for a future project.
3) The site regularly publishes interesting content.
4) I like aspects of the site design and want to file it away for future inspiration.

These use cases have existing apps built around them. [Pocket](getpocket.com) tracks items for later reading. [Feedly](feedly.com) keeps up with fresh content.  [Pinterest](pinterest.com) tracks favorite whatevers.  I don't, but if I wanted, I could use these apps.  I'm the chef rather who prefers a well-used knife to a slew of kitchen tools.  Yeah, my knife lacks sophistication, but I'm adept with it and it gets the job done.  I'm a minimalist.  The point is idosyncracies cause people to do things differently.

Now an app that supports tagging will accommodate just about any use case.  Just by using a few tags -- `readlater`, `periodical`, and `nice-design` -- I can offload a bevy tools for a solitary, but exceptionally useful, knife.  From my perspective, one something is better than  three separate somethings.  (Simple correlates to the frequency with which we say "no" to something or someone.)  Unfortunately, Chrome missed the boat on tags.  While there are tagging plugins, they feel tacked on, certainly not integrated.

Instead Chrome offers folders.  Reichenstein notes that [folder organizations](http://ia.net/blog/mountain-lions-new-file-system/) oft become overly complex.  I agree.  After numerous attempts on my harddrive I've realized any folder hierarchy I establish today won't suit me in a couple years.  

While hierarchies suit machines (i.e. software running on the file system), they're less well suited to human beings.  Can't we provide one strategy for machines and another for people?  I don't want to have remember whether it's `photos/2013` or `2013/photos`.  And that's just 2 levels deep.  Add another 2 levels and we're talking real problems.  Remember, great design is about freeing people to focus on their work, not mechanisms. A person shouldn't have to give thought to file system hierarchies in order to save or access personal data.  In fact, a user shouldn't be thinking in terms of file paths at all.  

Think about it.  When you create a file, why should you have to bother to specify a destination folder?  (Ever been annoyed by having to navigate folders via a save file dialog?)  You should simply name the file and it should be saved to a user repository provided on behalf of the operating system.  In fact, all user data should exist here.  Files are not saved to some destination (at least not from the user's perspective).  Instead, files are saved with and accessed by tags.  This bypasses folder navigation altogether.  Applying tags is easier than navigating ever was.

While such a repo might rely on the file system it should abstract the implementation details in the same way that git repos do.  Backing up my files might then involve zipping `mlanza\.repo` and uploading it to the cloud.  Because my repo is an abstraction the OS could allow me to export all files tagged `music` (mp3s, oggs, etc.) to a zip file or import from such a file.  The zip file could even maintain the repo abstraction, allowing me to search it with tags.  

The OS could reveal the repo as a directory abstraction that supports reads and writes:

    ls mlanza/.repo/?tags=music+(maxwell|sade)
    ls mlanza/.repo/tags #lists all tags as subfolders
    mv pour-sugar.ogg mlanza/.repo/?tags=def-leppard+hysteria+hit

When it comes to creating and locating files tags are more than sufficient.  Let me return to the topic.  The case being made is tagging offers a better strategy for organizing user data than hierachies do.  Tagging separates the tasks of creating content from organizing it.  What I mean is when you save a file it goes directly to the repository, untagged if no tags are provided.  The task of applying tags (organizing content) can be dealt with later if things becomes unmanageable.  Furthermore, tagging bypasses the nonsense of having to drill down to absolute locations that are both arbitrary and subject to change.

  And if we're going to add one nice feature on top of tagging it should be inferred tags.  Such tags are not actually applied to the files but are automatically inferred based on metadata.  That is, all files created in the past month might have the tag `recent`, and all image files (pngs, gifs, jpegs, etc.) might have the tag `image`.  These metatags would be user defined based on rules.


  No matter what hierarchyThere are pros and cons to both and no matter which I chose I'm making a tradeoff.  I'm definitively deciding how I have to think about locating content.  And no matter what approach I choose today, I'll probably discover new use cases.  We're all growing and changing all the time and I don't want to have to periodically reorganize folders.  The real culprit here is drill-down finding.  I just don't think its a useful paradigm for human beings.  Tagging bypasses this nonsense.

I want to find a particular photo of my daughter Ava, one that I recollect was taken sometime this year.  What I should be able to do is open a repository that has a search field, a list of tags, and a search results pane.  As I enter tags the tag list should winnows out tags that don't somehow intersect and the results pane should begin revealing results.  I can enter `ava`, `photo` and `2013` without bothering with which one is the top-level folder.  Tags render the starting point irrelevant and that's what makes them so darn good.  There's never cause to reorganize files and folders.  For all intents and purposes a tag repository is structureless.

Let's looks closer at Chrome.  


Now generally browsers like Chrome allow users to organize information inside folders.

, all of these reasons get lumped up into a single category: "bookmarked".  That means any time



I would venture to say that if a user is permitted to track any sort of information,