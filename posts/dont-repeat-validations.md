Any programmer worth his salt hates repeating code.  That's why we find situations that force us to repeat ourselves grating.  [Today, Web Development Sucks](http://harry.me/2011/01/27/today-web-development-sucks/) begrudges the pains of having to repeat validations both the client and the server.

Sadly, this is not a web issue but a software issue.  For several years now I've been developing a client/server WinForms application that deals with the same greivous pain.  See, all programmers that care about a good user experience will also care about performance.  And so to reduce roundtrips, we repeat some logic on the client.

If we unreservedly trusted the client, couldn't we simply shift our back end validations to the front end?  I don't think so.  The back end must assume that anything the client sends is untrustworthy and that doesn't necessarily mean maliciously so.  It's a matter of maintaining data integrity and the best place to do that is as close to the database as we can get--in fact, [right at the database](http://97things.oreilly.com/wiki/index.php/Database_as_a_Fortress).  The database is, after all, the last line of defense.

Where does this leave us?  We enforce rules on the server.  But since we care about user experience, that leaves us where, again?  It leaves avoiding server roundtrips wherever possible.

I've [pondered this](http://stackoverflow.com/questions/2556070/how-do-you-keep-your-business-rules-dry) repeatedly as project after project we've dealt with at least duplicating some validations.  Recently, I've been working on a [personal project](https://github.com/mlanza/thingy).  Same issue.  I thought I might try again to address it.  This lead me to one good solution: *metarules*.

1. Represent your validations (rules) using metadata.
2. Write server- and client-side interpreters that enforce them.

In this way, the repetitious bit is in writing the interpreters.

Take the following model:

    class Person < ActiveRecord::Base
      validates_presence_of :first_name
    end

We code our validations right on the model.  But what if we didn't?  What if the validation was stored as metadata in the database?  Let's forget for the moment that databases already support this by allowing us to mark fields not nullable.  What we want is a more universal approach.  What if we persisted our validations as metadata?  The server and the client having access to the same data could then interpret and enforce those metarules.

    {
      "attribute_rules": [{
        "type": "person",
        "attribute": "first_name",
        "rule": "required"
      }]
    }

What we've done is traded hardcoded logic for interpretive data.  We enforce our rules on both the client and the server in a DRY manner.  This allows the client to avoid roundtrips to the server.  It allows the server to spit out bad data if the rules are circumvented on the client.  Now to universally effect validations we're left to maintain our metadata and our interpreters.

Any sort of rule can be universally enforced so long as we provide:

1. Rules represented as data
2. Interpreters that understand and enforce them

A deeper look reveals that duplicate validations are often the result of clients and servers being heterogenous.  The web server, for example, runs Ruby and the browser runs JavaScript.  Even if we used Node in order run JavaScript homongeneously on both ends, we may have some duplication if the environments vary in other ways.  For example, the server deserializes update requests into models and the models themselves are validated.  The client would also have to maintain the same models in order to run the same validations.  Reusing the validations would not be possible if the client maintained data directly in form fields with no model backing.  Another validation mechanism would be required.

The metarules idea is something I developed before I discovered the idea of client/server homogony that Node offers.  While it provides a viable option (one that I've actually used), I would chose it only when homongony was not an option.