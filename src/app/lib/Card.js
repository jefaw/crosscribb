const CARD_NAME = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
const SUITS = ["spades", "clubs", "hearts", "diamonds"];

export default class Card {
  constructor(nameIdx, suitIdx, id) {
    this.nameIdx = nameIdx;
    this.name = CARD_NAME[nameIdx];
    this.suit = SUITS[suitIdx];
    this.frontImgSrc = `cards/fronts/${this.suit}_${this.name}.svg`;
    this.backImgSrc = `cards/backs/red2.svg`;
    this.id = id;
  }
}
