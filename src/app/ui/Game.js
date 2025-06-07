"use client";

import { useEffect, useCallback, useState } from "react";
import Board from "./Board";
import Player from "./Player";
import useCribbs from "../hooks/useCribbs";
import RoundScore from "./RoundScore";
import GameOver from "./GameOver";
import TurnIndicator from "./TurnIndicator";
import RoundHistory from "./RoundHistory";

export default function Game({ 
  player1Name, 
  player2Name, 
  onGameOver, 
  isOnlineGame,
  sendGameAction,
  lastAction,
  currentPlayerId,
  isHost
}) {
  const [initialStateSent, setInitialStateSent] = useState(false);

  const {
    board, 
    turn, 
    hand1, 
    hand2, 
    selectedCard, 
    selectCard,
    roundScores, 
    totalScores,
    gameOver,
    winner,
    resetGame,
    roundHistory,
    currentRound,
    roundScoreVisible,
    applyRemoteAction,
    getInitialOnlineGameState,
    attemptPlayCard,
    nextRound,
    isOnline: cribbsIsOnline,
    myPlayerNumber,
    isInitialDeckReadyForHost
  } = useCribbs(isOnlineGame, currentPlayerId, isHost);

  useEffect(() => {
    if (isOnlineGame && isHost && cribbsIsOnline && isInitialDeckReadyForHost && currentRound === 1 && !initialStateSent) {
      console.log("Game.js: Host detected, initial deck ready, NOT YET SENT, attempting to get and send initial game state.");
      const initialAction = getInitialOnlineGameState();
      if (initialAction && sendGameAction) {
        console.log("Game.js: Sending initialGameState action:", initialAction);
        sendGameAction(initialAction.action, initialAction.payload);
        if (applyRemoteAction) {
          applyRemoteAction(initialAction.action, initialAction.payload, currentPlayerId);
        }
        setInitialStateSent(true);
      } else {
        console.warn("Game.js: Host - Could not get initial game state or sendGameAction is not available.");
      }
    }
  }, [isOnlineGame, isHost, cribbsIsOnline, getInitialOnlineGameState, sendGameAction, applyRemoteAction, currentPlayerId, currentRound, isInitialDeckReadyForHost, initialStateSent]);

  useEffect(() => {
    console.log("CLIENT Game.js: lastAction useEffect triggered. lastAction:", lastAction, "currentPlayerId:", currentPlayerId, "isOnlineGame:", isOnlineGame, "applyRemoteAction available:", !!applyRemoteAction);
    
    if (lastAction) {
      console.log(`CLIENT Game.js: Details for this run - isOnlineGame: ${isOnlineGame}, lastAction exists: ${!!lastAction}, currentPlayerId exists: ${!!currentPlayerId}, sender: ${lastAction.sender}, currentPlayerId: ${currentPlayerId}, action is from other player: ${lastAction.sender !== currentPlayerId}, applyRemoteAction function exists: ${!!applyRemoteAction}`);
      console.log("CLIENT Game.js: lastAction.sender:", lastAction.sender, "!== currentPlayerId:", currentPlayerId, "evaluates to:", lastAction.sender !== currentPlayerId);
    } else {
      console.log("CLIENT Game.js: lastAction is null or undefined in this run.");
    }

    if (!isOnlineGame) console.log("CLIENT Game.js: Condition check - FAILED: !isOnlineGame");
    if (!lastAction) console.log("CLIENT Game.js: Condition check - FAILED: !lastAction");
    if (!currentPlayerId) console.log("CLIENT Game.js: Condition check - FAILED: !currentPlayerId (client's own ID not set yet)");
    if (lastAction && lastAction.sender === currentPlayerId) console.log("CLIENT Game.js: Condition check - FAILED: lastAction.sender === currentPlayerId (action is from self)");
    if (!applyRemoteAction) console.log("CLIENT Game.js: Condition check - FAILED: !applyRemoteAction (function missing)");

    if (isOnlineGame && lastAction && currentPlayerId && lastAction.sender !== currentPlayerId && applyRemoteAction) {
      console.log('CLIENT Game.js: Conditions MET. Processing action. MyPlayerId:', currentPlayerId, 'Action:', lastAction);
      applyRemoteAction(lastAction.action, lastAction.payload, lastAction.sender);
    } else {
      if(lastAction) { // Only log this if lastAction itself isn't the reason for failure
        console.log("CLIENT Game.js: Conditions NOT MET for processing lastAction. Action will be skipped for this run.");
      }
    }
  }, [isOnlineGame, lastAction, applyRemoteAction, currentPlayerId]);

  const handlePlayCardAttempt = (positionFromBoard) => {
    if (gameOver || roundScoreVisible) return;
    
    console.log("Game.js: handlePlayCardAttempt called. Position from board:", positionFromBoard, "Current CRIBBS selectedCard:", selectedCard);

    if (!selectedCard) {
      console.log("Game.js: No card selected in useCribbs state to play.");
      return;
    }

    const actionToSend = attemptPlayCard(selectedCard, positionFromBoard);
    if (isOnlineGame && actionToSend && sendGameAction) {
      console.log('Game.js: Sending playCard action:', actionToSend);
      sendGameAction(actionToSend.action, actionToSend.payload);
    } else if (!isOnlineGame && actionToSend === null) {
      console.log('Game.js: Local card play processed by useCribbs.');
    } else if (isOnlineGame && !actionToSend){
      console.log("Game.js: Online playCard attempt was invalid or not player's turn (no action returned).");
    }
  };

  const handleNextRound = () => {
    if (gameOver) return;
    const actionData = nextRound();
    if (isOnlineGame && actionData && sendGameAction) {
      console.log("Game.js: Host is starting next round. Sending action:", actionData);
      sendGameAction(actionData.action, actionData.payload);
      if(applyRemoteAction) {
        applyRemoteAction(actionData.action, actionData.payload, currentPlayerId);
      }
    } else if (isOnlineGame && !actionData && !isHost) {
      console.log("Game.js: Non-host clicked next round - waiting for host.");
    } else if (!isOnlineGame && actionData === null){
      console.log("Game.js: Local game next round processed by useCribbs.");
    }
  };

  const handleResetGame = () => {
    if (isOnlineGame) {
      console.log("Game.js: Online game - Back to menu will trigger disconnect & cleanup.");
    }
    resetGame();
    onGameOver();
  };

  const handleSelectCard = (card, playerNumber) => {
    if (isOnlineGame) {
      if (myPlayerNumber === playerNumber && myPlayerNumber === turn) {
        selectCard(card, playerNumber);
      } else {
        console.log(`Game.js: Online - Cannot select card. MyP#: ${myPlayerNumber}, Card's P#: ${playerNumber}, Turn: ${turn}`);
      }
    } else {
      selectCard(card, playerNumber);
    }
  };

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
          <div className="flex justify-start mb-4 pt-2">
            {!gameOver && (
              <button
                onClick={handleResetGame}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition-colors duration-200"
              >
                Back to Menu
              </button>
            )}
          </div>
          <Player 
            name={player1Name} 
            num={1} 
            hand={hand1} 
            turn={turn} 
            onSelectCard={(card) => handleSelectCard(card, 1)} 
            isMyTurn={isOnlineGame ? myPlayerNumber === 1 && turn === 1 : turn === 1}
            isSelected={(card) => selectedCard && selectedCard.suit === card.suit && selectedCard.rank === card.rank}
          />
        </div>
        <div className="w-100 xl:w-1/2">
          <Board board={board} selectedCard={selectedCard} playCard={handlePlayCardAttempt} />
        </div>
        <div className="w-100 xl:w-1/4">
          <Player 
            name={player2Name} 
            num={2} 
            hand={hand2} 
            turn={turn} 
            onSelectCard={(card) => handleSelectCard(card, 2)} 
            isMyTurn={isOnlineGame ? myPlayerNumber === 2 && turn === 2 : turn === 2}
            isSelected={(card) => selectedCard && selectedCard.suit === card.suit && selectedCard.rank === card.rank}
          />
        </div>
        {roundScoreVisible && !gameOver && (
          <RoundScore nextRound={handleNextRound} roundScores={roundScores} totalScores={totalScores} />
        )}
        {gameOver && (
          <GameOver 
            winner={winner} 
            totalScores={totalScores} 
            resetGame={handleResetGame} 
            roundHistory={roundHistory}
            onBackToMenu={handleResetGame}
          />
        )}
        {!gameOver && (
          <TurnIndicator 
            turn={turn} 
            player1Name={player1Name} 
            player2Name={player2Name} 
            myPlayerNumber={isOnlineGame ? myPlayerNumber : null}
          />
        )}
        <RoundHistory roundHistory={roundHistory} />
      </div>
    </>
  );
}
