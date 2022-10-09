#!/usr/bin/env node

const fs = require("fs");
const JSZip = require("jszip");
const {v4: uuid} = require('uuid');

const cards = [];

cards.push(...JSON.parse(fs.readFileSync('decks/free/CAH_PrintPlay_US-2.3.json')));

// Configuration
const cardWidth = 103;
const cardHeight = 160;
const pileWidth = cardWidth + 12;
const pileHeight = cardHeight + 12;
const dealCards = 10;
const tableWidth = 1600;
const tableHeight = 1000;
const seatCount = 8;
const colors = ['orange','red','blue','green','yellow','teal','red','orange'];
const backText = "Cards Against Humanity";

const seatY = 760;

const pileY = 20;
const promptX = tableWidth - pileWidth - 10;
const responseX = promptX - pileWidth - 10;
const discardX = responseX - pileWidth - 10;

const playY = seatY - pileHeight * 3;
const playX = tableWidth / 2 - (pileWidth + 10) * seatCount / 2;

// Working variables
let z = 1;
const widgets = [];


///////////////////////////////////////////////////////////////////////////
// Decks

const backTemplate = {
  "includeBorder": "heavy",
  "includeRadius": true,
  "objects": [
    {
      "type": "image",
      "x": 0,
      "y": 0,
      "w": cardWidth,
      "h": cardHeight,
      "valueType": "static",
      "value": "",
      "color": "rgb(0,0,0)"
    },
    {
      "type": "text",
      "x": 10,
      "y": 10,
      "w": cardWidth - 20,
      "fontSize": "20",
      "valueType": "static",
      "value": backText,
      "textAlign": "left",
      "textFont": null,
      "color": "rgb(255,255,255)"
    }
  ]
};

const faceTemplate = {
  "includeBorder": "heavy",
  "includeRadius": true,
  "objects": [
    {
      "type": "image",
      "x": 0,
      "y": 0,
      "w": cardWidth,
      "h": cardHeight,
      "valueType": "static",
      "value": "",
      "color": "rgb(0,0,0)"
    },
    {
      "type": "text",
      "x": 4,
      "y": 4,
      "w": cardWidth - 8,
      "fontSize": "16",
      "valueType": "dynamic",
      "value": "text",
      "textAlign": "left",
      "textFont": null,
      "color": "rgb(255,255,255)"
    },
    {
      "type": "text",
      "x": 4,
      "y": 4,
      "w": cardWidth - 8,
      "fontSize": "12",
      "valueType": "dynamic",
      "value": "smallText",
      "textAlign": "left",
      "textFont": null,
      "color": "rgb(255,255,255)"
    },
    {
      "type": "text",
      "x": 4,
      "y": cardHeight - 20,
      "w": cardWidth - 8,
      "fontSize": "10",
      "valueType": "dynamic",
      "value": "special",
      "textAlign": "left",
      "textFont": null,
      "color": "rgb(255,255,255)"
    },
  ]
};

const blackDeck = {
  type: "cardDeck",
  id: uuid(),
  parent: null,
  x: promptX,
  y: pileY,
  z: z++,
  cardOverlapH: 0.75 * cardWidth,
  cardOverlapV: 0,
  autoShuffle: true,
  showUnflipped: true,
  confirmRecall: true,
  draggingType: null,
  dragging: null,
  enlarge: true,
  backTemplate: JSON.parse(JSON.stringify(backTemplate)),
  faceTemplate: JSON.parse(JSON.stringify(faceTemplate)),
  cardTypes: {},
};

// Adjust template colors
backTemplate.objects[0].color = "rgb(255,255,255)";
backTemplate.objects[1].color = "rgb(0,0,0)";
faceTemplate.objects[0].color = "rgb(255,255,255)";
faceTemplate.objects[1].color = "rgb(0,0,0)";
faceTemplate.objects[2].color = "rgb(0,0,0)";
faceTemplate.objects[3].color = "rgb(0,0,0)";

const whiteDeck = {
  type: "cardDeck",
  id: uuid(),
  parent: null,
  x: responseX,
  y: pileY,
  z: z++,
  cardOverlapH: 0,
  cardOverlapV: 0,
  autoShuffle: true,
  showUnflipped: true,
  confirmRecall: true,
  draggingType: null,
  dragging: null,
  enlarge: true,
  backTemplate,
  faceTemplate,
  cardTypes: {},
};

// Add card types to respective decks, checking for dupes
let seen = new Set();
cards.forEach(card => {
  if (!seen.has(card.text)) {
    seen.add(card.text);
    let deck = (card.kind == "Prompt") ? blackDeck : whiteDeck;
    let field = (card.text.length < 95) ? "text" : "smallText";
    let id = "type-" + uuid();
    deck.cardTypes[id] = {};
    deck.cardTypes[id][field] = card.text;
    if (card.special) {
      deck.cardTypes[id].special = card.special;
    }
  }
});

widgets.push(blackDeck);
widgets.push(whiteDeck);

///////////////////////////////////////////////////////////////////////////
// Piles

const promptPile = {
  type: "cardPile",
  id: uuid(),
  x: promptX,
  y: pileY,
  z: z++,
  width: pileWidth,
  height: pileHeight,
  allowedDecks: [ blackDeck.id ],
  label: "Prompt Deck",
  hideStackTab: false,
  hasShuffleButton: true,
  draggingType: null,
  dragging: null,
}
blackDeck.parent = promptPile.id;
widgets.push(promptPile);

const responsePile = {
  type: "cardPile",
  id: uuid(),
  x: responseX,
  y: pileY,
  z: z++,
  width: pileWidth,
  height: pileHeight,
  allowedDecks: [ whiteDeck.id ],
  label: "Response Deck",
  hideStackTab: false,
  hasShuffleButton: true,
  draggingType: null,
  dragging: null,
}
whiteDeck.parent = responsePile.id;
widgets.push(responsePile);

const discardPile = {
  type: "cardPile",
  id: uuid(),
  x: discardX,
  y: pileY,
  z: z++,
  width: pileWidth,
  height: pileHeight,
  allowedDecks: [ whiteDeck.id ],
  label: "Discard",
  hideStackTab: false,
  hasShuffleButton: false,
  draggingType: null,
  dragging: null,
}
widgets.push(discardPile);

const currentPromptPile = {
  type: "cardPile",
  id: uuid(),
  x: playX,
  y: playY,
  z: z++,
  width: pileWidth,
  height: pileHeight,
  allowedDecks: [ blackDeck.id ],
  label: "Prompt",
  hideStackTab: false,
  hasShuffleButton: false,
  draggingType: null,
  dragging: null,
}
widgets.push(currentPromptPile);

const playPile = [];
for (let i = 0; i < seatCount - 1; i++) {
  playPile.push({
    type: "cardPile",
    id: uuid(),
    x: playX + (i + 1) * (pileWidth + 10),
    y: playY,
    z: z++,
    allowedDecks: [ whiteDeck.id ],
    label: "Responses",
    height: pileHeight * 2,
    width: pileWidth,
    layoutType: "grid",
    draggingType: null,
    dragging: null,
  });
}
widgets.push(...playPile);

///////////////////////////////////////////////////////////////////////////
// Player's Hand
const handWidth = pileWidth * (dealCards + 1);
const handHeight = pileHeight;
widgets.push(
 {
    "id": "hand",
    "type": "hand",
    "x": (tableWidth - handWidth) / 2,
    "y": tableHeight - handHeight,
    "z": z++,
    "dragging": null,
    "draggingType": null,
    "allowedDecks": [ whiteDeck.id ],
    "width": handWidth,
    "spreadMulti": "single"
  },
);


///////////////////////////////////////////////////////////////////////////
// Seats & Points
const seatWidth = 180;
const seats = [];
for (let i = 0; i < seatCount; i++) {
  let x = (i + 0.5) * (tableWidth / seatCount) - seatWidth/2;
  seats.push(
    { id: uuid(),
      type: 'seat',
      x: x,
      y: seatY,
      z: z++,
      seatIndex: i,
      seatedUser: null,
      seatInitials: null,
      seatLabel: null,
      seatColor: colors[i],
      dragging: null,
      draggingType: null,
    }
  );
}
widgets.push(...seats);

for (let i = 0; i < seatCount; i++) {
  let x = (i + 0.5) * (tableWidth / seatCount) - pileWidth/2;
  widgets.push({
    id: uuid(),
    type: "cardPile",
    x,
    y: seatY - pileHeight - 10,
    z: z++,
    r: 90,
    allowedDecks: [ blackDeck.id ],
    dragging: null,
    draggingType: null,
    label: "Points",
    linkedSeat: seats[i].id,
  });
}

///////////////////////////////////////////////////////////////////////////
// Place Automation Widgets

widgets.push({
  "type": "automationButton",
  "label": "Reset Game",
  "id": uuid(),
  "x": 10,
  "y": 10,
  "z": z++,
  "dragging": null,
  "draggingType": null,
  "clickRoutine": {
    "steps": [
      {
        "id": uuid(),
        "func": "RECALL_CARDS",
        "args": {
          "includeHands": {
            "type": "literal",
            "value": "hands"
          },
          "decks": {
            "type": "literal",
            "value": [
              blackDeck.id,
              whiteDeck.id,
            ]
          },
          "includeHolders": {
            "type": "literal",
            "value": "holders"
          }
        },
        "title": "Put Cards Back in Decks"
      },
      {
        "id": uuid(),
        "func": "SHUFFLE_CARDS",
        "args": {
          "holders": {
            "type": "literal",
            "value": [
              promptPile.id,
              responsePile.id,
            ]
          }
        },
        "title": "Shuffle Decks"
      },
      {
        "func": "MOVE_CARDS_BETWEEN_HOLDERS",
        "args": {
          "from": {
            "type": "literal",
            "value": [ responsePile.id ]
          },
          "to": {
            "type": "literal",
            "value": seats.map(seat => seat.id),
          },
          "quantity": {
            "type": "literal",
            "value": 10
          },
          "fillAdd": {
            "type": "literal",
            "value": "fill"
          },
          "moveFlip": {
            "type": "literal",
            "value": "faceUp"
          },
          "changeRotation": {
            "type": "literal",
            "value": "auto"
          }
        },
        "title": "Deal Cards"
      },
      {
        "id": uuid(),
        "func": "MOVE_CARDS_BETWEEN_HOLDERS",
        "args": {
          "from": {
            "type": "literal",
            "value": [ promptPile.id ],
          },
          "to": {
            "type": "literal",
            "value": [ currentPromptPile.id ],
          },
          "moveFlip": {
            "type": "literal",
            "value": "faceDown"
          }
        },
        "title": "Pick Prompt Card"
      }
    ],
    "popupMessage": "Reset Game. Are you sure?"
  },
});

widgets.push({
  "type": "turnButton",
  "id": uuid(),
  "x": 100,
  "y": 10,
  "z": z++,
  "turnCCW": false,
  "playersCanReverse": false,
  "currentTurn": null,
  "dragging": null,
  "draggingType": null,

  "clickRoutine": {
    "steps": [
      {
        "id": uuid(),
        "func": "MOVE_CARDS_BETWEEN_HOLDERS",
        "args": {
          "from": {
            "type": "literal",
            "value": [ promptPile.id ],
          },
          "to": {
            "type": "literal",
            "value": [ currentPromptPile.id ],
          },
          "moveFlip": {
            "type": "literal",
            "value": "faceDown"
          }
        }
      },
      {
        "id": uuid(),
        "func": "MOVE_CARDS_BETWEEN_HOLDERS",
        "args": {
          "from": {
            "type": "literal",
            "value": playPile.map(pile => pile.id),
          },
          "to": {
            "type": "literal",
            "value": [ discardPile.id ],
          },
          "quantity": {
            "type": "literal",
            "value": 100,
          },
          "moveMethod": {
            "type": "literal",
            "value": "all"
          },
          "moveFlip": {
            "type": "literal",
            "value": "faceUp"
          }
        }
      },
      {
        "id": uuid(),
        "func": "MOVE_CARDS_BETWEEN_HOLDERS",
        "args": {
          "from": {
            "type": "literal",
            "value": [ responsePile.id ],
          },
          "to": {
            "type": "literal",
            "value": seats.map(seat => seat.id),
          },
          "quantity": {
            "type": "literal",
            "value": 10
          },
          "fillAdd": {
            "type": "literal",
            "value": "fill"
          },
          "moveFlip": {
            "type": "literal",
            "value": "faceUp"
          }
        }
      }
    ]
  },

});

///////////////////////////////////////////////////////////////////////////
// Create Cards -- TODO: make sure we don't exceed 1200 widgets
createCards(blackDeck);
createCards(whiteDeck);

function createCards(deck) {
  Object.keys(deck.cardTypes).forEach(cardType => {
    widgets.push({
      id: uuid(),
      type: "card",
      cardType,
      deck: deck.id,
      parent: deck.parent,
      x: deck.x,
      y: deck.y,
      z: z++,
      faceup: false,
      owner: null,
      layoutStackParent: null,
      dragingType: null,
      dragging: null,
    });
  });
}

///////////////////////////////////////////////////////////////////////////
// Output
console.log("Writing", widgets.length, "widgets");
(async function() {
  const zip = new JSZip();
  zip.file("widgets.json", JSON.stringify(widgets));
  const content = await zip.generateAsync({
    type:"nodebuffer",
    compression:"DEFLATE",
    compressionOptions: {
      level: 9
    }
  });
  fs.writeFileSync('cah-room.pcio', content);
})();
