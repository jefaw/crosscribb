"use client";

import { useState, useEffect } from "react";
import Game from "./ui/Game";
import Menu from "./ui/Menu";
import useMultiplayer from "./hooks/useMultiplayer";

export default function Home() {
  const [localGameSettings, setLocalGameSettings] = useState(null);
  const [showMenu, setShowMenu] = useState(true);

  const multiplayer = useMultiplayer();

  const handleStartGame = (settings) => {
    if (settings.gameType === 'online') {
      if (settings.action === 'create') {
        multiplayer.createGame();
      } else if (settings.action === 'join' && settings.gameId) {
        multiplayer.joinGame(settings.gameId);
      }
    } else {
      setLocalGameSettings({ player1Name: settings.player1Name, player2Name: settings.player2Name });
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (multiplayer.gameStarted) {
      setShowMenu(false);
    } else {
      if (!multiplayer.gameId && !localGameSettings) {
        setShowMenu(true);
      }
    }
  }, [multiplayer.gameStarted, multiplayer.gameId, localGameSettings]);
  
  useEffect(() => {
    if (multiplayer.error) {
      alert(`Multiplayer Error: ${multiplayer.error}`);
      multiplayer.clearError();
      setShowMenu(true);
      setLocalGameSettings(null);
    }
  }, [multiplayer.error, multiplayer]);

  const handleGameOver = () => {
    setShowMenu(true);
    setLocalGameSettings(null);
    if (multiplayer.gameId) {
    }
  };

  let player1Name = localGameSettings?.player1Name;
  let player2Name = localGameSettings?.player2Name;

  if (multiplayer.gameStarted && multiplayer.players.length > 0) {
    const myPlayerInfo = multiplayer.players.find(p => p === multiplayer.playerId);
    const otherPlayerInfo = multiplayer.players.find(p => p !== multiplayer.playerId);

    if (multiplayer.isHost) {
        player1Name = myPlayerInfo ? `Player ${multiplayer.playerId.substring(0,3)} (You)` : 'Player 1';
        player2Name = otherPlayerInfo ? `Player ${otherPlayerInfo.substring(0,3)}` : 'Player 2';
    } else {
        player1Name = otherPlayerInfo ? `Player ${otherPlayerInfo.substring(0,3)}` : 'Player 1';
        player2Name = myPlayerInfo ? `Player ${multiplayer.playerId.substring(0,3)} (You)` : 'Player 2';
    }
  }

  const shouldRenderGame = !showMenu && 
                           (localGameSettings || 
                            (multiplayer.gameStarted && multiplayer.playerId));

  console.log(
    'page.js: Rendering check. showMenu:', showMenu, 
    'localGameSettings:', !!localGameSettings, 
    'multiplayer.gameStarted:', multiplayer.gameStarted, 
    'multiplayer.playerId:', multiplayer.playerId,
    'SHOULD RENDER GAME:', shouldRenderGame,
    'multiplayer.lastAction:', multiplayer.lastAction
  );

  return (
    <div>
      {shouldRenderGame ? (
        <Game 
          player1Name={player1Name} 
          player2Name={player2Name}
          onGameOver={handleGameOver}
          isOnlineGame={multiplayer.gameStarted}
          sendGameAction={multiplayer.sendGameAction}
          lastAction={multiplayer.lastAction}
          currentPlayerId={multiplayer.playerId}
          isHost={multiplayer.isHost}
        />
      ) : (
        <Menu 
          onStartGame={handleStartGame} 
          multiplayerStatus={{
            gameId: multiplayer.gameId,
            players: multiplayer.players,
            isHost: multiplayer.isHost,
            canStart: multiplayer.canStart,
            error: multiplayer.error
          }}
          onStartOnlineGame={multiplayer.startGame}
        />
      )}
      {multiplayer.gameId && (
        <div className="fixed bottom-0 left-0 bg-gray-800 text-white p-2 text-xs">
          Debug: GameID: {multiplayer.gameId}, PlayerID: {multiplayer.playerId}, Players: {multiplayer.players.join(', ')}, IsHost: {multiplayer.isHost.toString()}, CanStart: {multiplayer.canStart.toString()}, GameStarted: {multiplayer.gameStarted.toString()}
        </div>
      )}
    </div>
  );
}
