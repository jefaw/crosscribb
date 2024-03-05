import { newBoard, newDeck } from "../lib/helpers";
import { useEffect, useState } from "react";

export default function useCribbs(numPlayers = 2) {
  const [deck, setDeck] = useState(newDeck());
  const [board, setBoard] = useState(newBoard());
  const [centerCard, setCenterCard] = useState(null);
  const [hand1, setHand1] = useState([]);
  const [hand2, setHand2] = useState([]);
  const [turn, setTurn] = useState(1);
  const [draggedCard, setDraggedCard] = useState(null);

  useEffect(() => {
    console.log("deck = ", deck);
    // center card played
    setCenterCard(deck[0]);
    // set player hands
    setHand1(deck.slice(1, 13));
    setHand2(deck.slice(13, 25));
  }, []);

  function dragCard(player, card) {
    console.log("player = " + player + " card = ", card);
    if (player !== turn) return;
    setDraggedCard(card);
  }

  function playCard(card, pos) {
    if (!draggedCard) return;
    const [r, c] = pos;
    // Remove card from players hand
    if (turn === 1) {
      setHand1(hand1.slice(0, -1));
      setDraggedCard(null);
    } else if (turn === 2) {
      setHand2(hand2.slice(0, -1));
      setDraggedCard(null);
    }
    // Display new card on the board
    setBoard((board) => {
      board[r][c] = card;
      return board;
    });
    setTurn((turn) => (++turn > numPlayers ? 1 : turn));
  }

  return { board, hand1, hand2, centerCard, draggedCard, dragCard, playCard };
}
