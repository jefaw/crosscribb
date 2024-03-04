"use client";

import Board from "./Board";
import Player from "./Player";
import useCribbs from "../hooks/useCribbs";
import { useEffect } from "react";

export default function Game(props) {
  const { board, hand1, hand2, centerCard, playCard } = useCribbs();
  console.log("board = ", board);

  useEffect(() => {
    console.log("game");
  }, []);

  return (
    /*
    Game Layout: 
      Player 1
      Board
      Player 2
     */
    <div className="flex">
      <div className="flex-1">
        <Player name="BenDaBeast" hand={hand1} />
      </div>
      <div className="flex-auto">
        <Board board={board} centerCard={centerCard} />
      </div>
      <div className="flex-1">
        <Player name="Jeffaw" hand={hand2} />
      </div>
    </div>
  );
}
