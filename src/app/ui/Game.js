"use client";

import Board from "./Board";
import Player from "./Player";
import useCribbs from "../hooks/useCribbs";

export default function Game() {
  const { board, hand1, hand2, centerCard, selectedCard, setDraggedCard, playCard } = useCribbs();

  return (
    /*
    Game Layout: 
      Player 1
      Board
      Player 2
     */
    <div className="flex">
      <div className="flex-1">
        <Player name="BenDaBeast" num={1} hand={hand1} setDraggedCard={setDraggedCard} />
      </div>
      <div className="flex-auto">
        <Board board={board} centerCard={centerCard} selectedCard={selectedCard} playCard={playCard} />
      </div>
      <div className="flex-1">
        <Player name="Jeffaw" num={2} hand={hand2} setDraggedCard={setDraggedCard} />
      </div>
    </div>
  );
}
