import Card from "./Card";
export default class Deck {
  deck = [];
  constructor() {
    this.createDeck();
  }
  createDeck() {
    let deckIdx = 0;
    for (let suitIdx = 0; suitIdx < 4; suitIdx++) {
      for (let nameIdx = 0; nameIdx < 13; nameIdx++) {
        this.deck[deckIdx++] = new Card(nameIdx, suitIdx);
      }
    }
  }
  get() {
    return this.deck;
  }
}
