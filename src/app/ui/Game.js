"use client";

import Board from "./Board";
import Player from "./Player";
import useCribbs from "../hooks/useCribbs";

export default function Game() {
  const { board, hand1, hand2, centerCard, draggedCard, dragCard, playCard } = useCribbs();

  return (
    /*
    Game Layout: 
      Player 1
      Board
      Player 2
     */
    <div className="flex">
      <div className="flex-1">
        <Player name="BenDaBeast" num={1} hand={hand1} dragCard={dragCard} />
      </div>
      <div className="flex-auto">
        <Board board={board} centerCard={centerCard} draggedCard={draggedCard} playCard={playCard} />
      </div>
      <div className="flex-1">
        <Player name="Jeffaw" num={2} hand={hand2} dragCard={dragCard} />
      </div>
    </div>
  );
}
