import { newBoard, newDeck, tallyScores } from "../lib/helpers";
import { useEffect, useRef, useState } from "react";

export default function useCribbs(numPlayers = 2) {
  const [deck, setDeck] = useState(null);
  const [board, setBoard] = useState(newBoard());
  const [hand1, setHand1] = useState([]);
  const [hand2, setHand2] = useState([]);
  const [turn, setTurn] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [roundScoreVisible, setRoundScoreVisible] = useState(false);
  const [numSpotsLeft, setNumSpotsLeft] = useState(24);
  const [scoresArray, setScoresArray] = useState([]);

  // load deck
  useEffect(() => {
    setDeck(newDeck());
  }, []);

  // set center card and players hands once deck loaded
  useEffect(() => {
    if (deck == null) return; // wait until deck has loaded
    console.log("deck = ", deck);
    // set center card
    setBoard((board) => {
      board[2][2] = deck[0];
      return board;
    });
    // set player hands
    setHand1(deck.slice(1, 13));
    setHand2(deck.slice(13, 25));
    // set initial selected card
    setSelectedCard(hand1[hand1.length - 1]);
  }, [deck]);

  // set selected card based on turn
  useEffect(() => {
    let hand;
    if (turn === 1) hand = hand1;
    else if (turn === 2) hand = hand2;
    const card = hand.length > 0 ? hand[hand.length - 1] : null;
    console.log("selectedCard = ", card);
    setSelectedCard(card);
  }, [hand1, hand2, turn]);

  function selectCard(player, card) {
    console.log("player = " + player + " card = ", card);
    if (player !== turn) return;
    setSelectedCard(card);
  }

  function playCard(pos) {
    console.log("sel card = ", selectedCard);
    if (!selectedCard) return;
    const [r, c] = pos;
    // Remove card from players hand
    if (turn === 1) {
      setHand1(hand1.slice(0, -1));
      setSelectedCard(null);
    } else if (turn === 2) {
      setHand2(hand2.slice(0, -1));
      setSelectedCard(null);
    }
    // Display new card on the board
    console.log("board " + r + " " + c + " = ", selectedCard);
    setBoard((board) => {
      board[r][c] = selectedCard;
      return board;
    });
    setNumSpotsLeft((numSpotsLeft) => {
      if (numSpotsLeft <= 1) {
        roundOver();
      }
      return setNumSpotsLeft(numSpotsLeft - 1);
    });
    setTurn((turn) => (++turn > numPlayers ? 1 : turn));
  }

  function roundOver() {
    setRoundScoreVisible(true);
    //[rowTotals, colTotals]
    setScoresArray(tallyScores(board));
  }

  function nextRound() {
    setBoard(newBoard());
    setRoundScoreVisible(false);
    setNumSpotsLeft(24);
    setDeck(newDeck());
  }

  return { board, turn, hand1, hand2, selectedCard, selectCard, roundScoreVisible, playCard, nextRound, scoresArray };
}
