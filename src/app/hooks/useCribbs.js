import { newBoard, newDeck } from "../lib/helpers";
import { useEffect, useState } from "react";

export default function useCribbs() {
  const [deck, setDeck] = useState(newDeck());
  const [board, setBoard] = useState(newBoard());
  const [centerCard, setCenterCard] = useState(null);
  const [hand1, setHand1] = useState([]);
  const [hand2, setHand2] = useState([]);

  useEffect(() => {
    console.log("testing");
    console.log("deck = ", deck);
    // center card played
    setCenterCard(deck[0]);
    // set player hands
    setHand1(deck.slice(1, 13));
    setHand2(deck.slice(13, 25));
  }, []);

  function playCard(player, move, card) {
    const [r, c] = move;
    // Remove card from players hand
    if (player === 1) {
      setHand1(hand1.pop());
    } else if (player === 2) {
      setHand2(hand2.pop());
    }
    // Display new card on the board
    setBoard((board) => {
      board[r][c] = card;
      return board;
    });
  }

  return { board, hand1, hand2, centerCard, playCard };
}
