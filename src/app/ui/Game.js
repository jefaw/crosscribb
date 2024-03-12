"use client";

import Board from "./Board";
import Player from "./Player";
import useCribbs from "../hooks/useCribbs";
import RoundScore from "./RoundScore";

export default function Game() {
  const { board, turn, hand1, hand2, selectedCard, roundScoreVisible, playCard, nextRound, scoresArray } = useCribbs();

  return (
    /*
    Game Layout: 
      Player 1
      Board
      Player 2
     */
    <>
      <div className="flex flex-col xl:flex-row relative">
        <div className="w-100 xl:w-1/4">
          <Player name="BenDaBeast" num={1} hand={hand1} turn={turn} />
        </div>
        <div className="w-100 xl:w-1/2">
          <Board board={board} selectedCard={selectedCard} playCard={playCard} />
        </div>
        <div className="w-100 xl:w-1/4">
          <Player name="Jeffaw" num={2} hand={hand2} turn={turn} />
        </div>
        {roundScoreVisible && <RoundScore nextRound={nextRound} scoresArray={scoresArray} />}
      </div>
    </>
  );
}
