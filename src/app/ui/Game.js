"use client";

import Board from "./Board";
import Player from "./Player";
import useCribbs from "../hooks/useCribbs";

export default function Game() {
  const { board, turn, hand1, hand2, centerCard, selectedCard, playCard } = useCribbs();

  return (
    /*
    Game Layout: 
      Player 1
      Board
      Player 2
     */
    <div className="flex flex-col xl:flex-row">
      <div className="w-100 xl:w-1/4">
        <Player name="BenDaBeast" num={1} hand={hand1} turn={turn} />
      </div>
      <div className="w-100 xl:w-1/2">
        <Board board={board} centerCard={centerCard} selectedCard={selectedCard} playCard={playCard} />
      </div>
      <div className="w-100 xl:w-1/4">
        <Player name="Jeffaw" num={2} hand={hand2} turn={turn} />
      </div>
    </div>
  );
}
