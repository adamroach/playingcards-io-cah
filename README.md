# playingcards-io-cah
Script to build a playingcards.io board for Cards Against Humanity and similar games

# Introduction
I'll flesh this out more as time allows.

The [PlayingCards.io](https://playingcards.io/) website
provides a fairly fully-featured card-playing tabletop simulator. In addition to having a
large number of pre-defined games, it also allows users to create their own "rooms" with
custom layouts and behaviors.

[Cards Against Humanity](https://www.cardsagainsthumanity.com/) is a popular fill-in-the-blank
party game produced by a group of folks who tend to do good things with the money they
make off their game. In addition to the decks you can buy from them, they've also made
a free version of their game available under the Creative Commons
"[Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)"
license. Without offering up legal advice, my understanding is that
this basically means that folks can use and remix the contents of that free version, so
long as you're not making any money in doing so, and as long as you credit Cards Against Humanity
as the original authors of the material.

I have purchased nearly every deck that Cards Against Humanity has released; but over the long stretch
of COVID lockdown, that did me no good: I had no way to use my cards when I couldn't be in the
same room with groups of people. So, of course, the reasonable thing to do is to create
a Cards Against Humanity table for PlayingCards.io. Which is exactly what I did.

This project currently contains a primitive script that simply reads in a JSON-formatted
list of prompt and response cards, and generates a file that can be imported into
PlayingCards.io and played with up to 8 people over the network. Adding other decks
is a relatively straightforward exercise, but it's entirely on you to make sure you're
not trampling on someone else's copyright in doing so.

And really, if you like the game, you should probably consider heading over to
[the Cards Against Humanity store](https://www.cardsagainsthumanity.com/shop/all) and
grabbing a copy. My goal in making this available isn't to replace buying a copy; it's
to let you play with your friends even when *waves at whole world in 2022* all this is
going on.

# Creating and Importing a Room
For whatever reason, node 8.10.0 is what was installed when I wrote this, and so that's what I ended
up using. It probably works under other versions also, but I know that 8.10.0 works fine.

Assuming you have node installed, you simply do `npm install` and then `./build-room.js`. This will create
a file called `cah-room.pcio`

Then you're going to want to head on over to [PlayingCards.io](https://playingcards.io/) and create
an account (or log into your existing account). Click on "Go to account", and then find the "Import"
button (as I'm writing this, it's in the upper-right corner of the UI, and looks like a sheet of paper
with an arrow pointing into it, but it's changed in the past and may again in the future). Select the
`cah-room.pcio` file that was created in the previous step, and you're off the the races. Copy the room
link from your browser URL, and pass it along to your friends.

# Gameplay
I'm not going to go over the rules here; you can find them [in the free downloadable version
on the Cards Against Humanity site](https://cdn.sanity.io/files/vc07edlh/production/e4d4abffb217a7e6bf0dddc29709895fc24e4984.pdf). Mechanically, PlayingCards.io is a very simple table-top simulator that lets you drag cards around,
flip them over, put them in stacks, and hold them in "your hand" (the tray at the bottom of the screen).
This means that anyone can mess with anything and create unmitigated havoc. You can even rename other
players and change what their pointer icon is. Honestly, that level of chaos is part of its charm. The
game engine also allows for some limited automation. Currently, the generated room has two buttons
for automation:

* "Reset Game" will shuffle both decks of cards, deal 10 cards to each player's hand, and put the
  topmost prompt card face-down on the "prompt" pile.
* "End Turn" will move any cards in the "Responses" piles into the "Discard" pile, fill each
  player's hand back up to 10 cards, and move the "active" player one seat to the right.

You and your friends can use this however you want, but the general intention of the board layout is
that, when the person whose turn it is  -- the judge -- is ready, they click on the card on the "Prompt"
pile to flip it over, and read it aloud. Each person then selects a random "responses" column to put
their answer into, largely through chaos and negotiation. If the prompt requires two (or more) cards, they
should be played in the same "responses" column, in the order you want them to be read (i.e.,
first one on top, second one on bottom). Once everyone has played, the judge clicks on each response card
to reveal and judge them. The winning player counts that point by dragging the "prompt" card into their own
"Points" pile.

# Copyrights and Trademarks
The only thing I've written here is the JavaScript. It's licensed under the MIT License, which
is fairly permissive.

The contents of [the included JSON file](decks/free/CAH_PrintPlay_US-2.3.json) are derived from material
owned by Cards Against Humanity LLC, which is available via a Creative Commons Attribution-NonCommercial-ShareAlike
4.0 International Public License, as detailed on [their website](https://www.cardsagainsthumanity.com/).
This JSON file is covered by that same license. The important part of that is: you can't use it
to make money in any way.


The terms "Cards Against Humanity" and "PlayingCards.io" are trademarks of Cards Against Humanity LLC
and PlayingCards.io LLC, respectively.
