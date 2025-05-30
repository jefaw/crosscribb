"use client";

import { useState } from "react";
import Game from "./ui/Game";
import Menu from "./ui/Menu";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerNames, setPlayerNames] = useState({ player1Name: "", player2Name: "" });

  const handleStartGame = (names) => {
    setPlayerNames(names);
    setGameStarted(true);
  };

  return (
    <div>
      
      {!gameStarted ? (
        <Menu onStartGame={handleStartGame} />
      ) : (
        <Game 
          player1Name={playerNames.player1Name} 
          player2Name={playerNames.player2Name}
          onGameOver={() => setGameStarted(false)}
        />
      )}
    </div>
  );
}
