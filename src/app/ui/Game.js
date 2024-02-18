import Board from "./Board";
import Player from "./Player";
import Deck from "../lib/Deck";
// import { useState } from "react";

export default function Game(props) {
  // const turns = [0, 1]
  // const [turn, changeTurn] = useState(0);

  //create a new deck
  const deck = new Deck();
  
  //get hands for 2 players
  const hand1 = deck.getHand();
  const hand2 = deck.getHand();
  //maybe move above stuff to a constructor in case it runs multiple times

  //start game


  return (
    <div>
      <Player name="BenDaBeast" hand={hand1}/>
      <Board />
      <Player name="Jeffaw" hand={hand2} />
    </div>
  );
}
