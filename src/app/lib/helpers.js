import Card from "./Card";

function newBoard() {
  let board = [];
  for (let r = 0; r < 5; r++) {
    let row = [];
    for (let c = 0; c < 5; c++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
}

//Fishman-yeetes shuffle deck alg
function shuffleDeck(originalArray) {
  const newArray = [...originalArray]; // Create a copy to avoid modifying the original array

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

function newDeck() {
  let deck = [];
  let deckIdx = 0;
  let cardId = 0;
  for (let suitIdx = 0; suitIdx < 4; suitIdx++) {
    for (let nameIdx = 0; nameIdx < 13; nameIdx++) {
      deck[deckIdx++] = new Card(nameIdx, suitIdx, cardId);
      cardId++;
    }
  }
  return shuffleDeck(deck);
}

export { newBoard, newDeck };
