/*
- State management for:
  - deck: The shuffled deck of cards
  - board: 5x5 grid of card placements
  - hand1/hand2: Players' cards
  - turn: Current player's turn
  - selectedCard: Currently selected card
  - scores: Both round and total scores
*/

import { newBoard, newDeck, tallyScores } from "../lib/helpers";
import { useEffect, useRef, useState, useCallback } from "react";

export default function useCribbs(initialIsOnline = false, initialPlayerId = null, initialIsHost = false) {
  // Core game state
  const [deck, setDeck] = useState(null);
  const [board, setBoard] = useState(newBoard());
  const [hand1, setHand1] = useState([]);
  const [hand2, setHand2] = useState([]);
  const [turn, setTurn] = useState(1); // Player 1 or 2
  const [selectedCard, setSelectedCard] = useState(null);
  const [numSpotsLeft, setNumSpotsLeft] = useState(24);
  const [roundScores, setRoundScores] = useState([]);
  const [totalScores, setTotalScores] = useState([0, 0]);
  const [roundOver, setRoundOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null); // 'Row' or 'Column' or 'Player 1' / 'Player 2'
  const [roundHistory, setRoundHistory] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundScoreVisible, setRoundScoreVisible] = useState(false);

  // Online play specific state
  const [isOnline, setIsOnline] = useState(initialIsOnline);
  const [onlinePlayerId, setOnlinePlayerId] = useState(initialPlayerId); // Socket ID of this client
  const [isHostClient, setIsHostClient] = useState(initialIsHost); // Is this client the host of the online game?
  const [myPlayerNumber, setMyPlayerNumber] = useState(null); // Is this client P1 or P2 in the online game context?
  const [isInitialDeckReadyForHost, setIsInitialDeckReadyForHost] = useState(false); // New state

  // Effect to automatically set up online mode based on initial props
  useEffect(() => {
    if (initialIsOnline) {
      setIsOnline(true);
      setOnlinePlayerId(initialPlayerId);
      setIsHostClient(initialIsHost);
      setMyPlayerNumber(initialIsHost ? 1 : 2);
      console.log(`useCribbs: Online mode auto-activated via initial props. PlayerID: ${initialPlayerId}, IsHost: ${initialIsHost}, MyPlayerNumber: ${initialIsHost ? 1 : 2}`);
      
      resetGameInternal(true); // This will set deck to null and isInitialDeckReadyForHost to false

      if (initialIsHost) {
        console.log("useCribbs: Auto-activate - I am the HOST, setting a new deck now.");
        setDeck(newDeck()); 
        setIsInitialDeckReadyForHost(true); // Set new state true AFTER deck is set
      }
    } else {
      // If initialIsOnline becomes false, reset relevant online states or ensure local setup
      setIsOnline(false);
      setOnlinePlayerId(null);
      setIsHostClient(false);
      setMyPlayerNumber(null);
      setIsInitialDeckReadyForHost(false);
      // Consider if resetGameInternal(false) is needed here for a clean switch to local
    }
  }, [initialIsOnline, initialPlayerId, initialIsHost]);

  const setOnlinePlay = useCallback((playerId, isHost) => {
    setIsOnline(true);
    setOnlinePlayerId(playerId);
    setIsHostClient(isHost);
    setMyPlayerNumber(isHost ? 1 : 2);
    console.log(`useCribbs: Online mode SET. PlayerID: ${playerId}, IsHost: ${isHost}, MyPlayerNumber: ${isHost ? 1 : 2}`);
    
    resetGameInternal(true); // This will set deck to null and isInitialDeckReadyForHost to false

    if (isHost) {
      console.log("useCribbs: setOnlinePlay - I am the HOST, setting a new deck now.");
      setDeck(newDeck()); 
      setIsInitialDeckReadyForHost(true); // Set new state true AFTER deck is set
    }
  }, []); // Removed resetGameInternal from deps as it's called internally

  const resetGameInternal = (isOnlineReset = false) => {
    setBoard(newBoard());
    setHand1([]);
    setHand2([]);
    setTurn(1);
    setSelectedCard(null);
    setNumSpotsLeft(24);
    setRoundScores([]);
    setTotalScores([0, 0]);
    setRoundOver(false);
    setGameOver(false);
    setWinner(null);
    setRoundHistory([]);
    setCurrentRound(1);
    setRoundScoreVisible(false);
    // Always set deck to null during a reset, setOnlinePlay will provide a new one for host if needed
    setDeck(null); 
    setIsInitialDeckReadyForHost(false); // Reset this state too
    console.log("useCribbs: resetGameInternal called. Deck set to null.");
  };
  
  // Public reset function for Game.js to call
  const resetGame = () => {
    if (isOnline) {
        // In online mode, reset might be complex (e.g. inform server, or just reset local view pending new game)
        // For now, a local reset. Game.js handles going back to menu which triggers disconnect.
        console.log("useCribbs: Online game reset called - local state reset.");
        resetGameInternal(true); 
    } else {
        resetGameInternal(false);
    }
  };

  // Initial deck loading for local games or for host to prepare initial deal
  useEffect(() => {
    // This effect is now simplified: only for non-online games, 
    // or if somehow an online game is non-host and has no deck (less likely with new flow)
    if (!isOnline && !deck) {
      console.log("useCribbs: Setting new deck (Local Game Initial)");
      setDeck(newDeck());
    }
    // For online host, deck is set directly in setOnlinePlay.
  }, [isOnline, deck]); // Simplified dependencies

  // Deal initial cards (local games) or prepare initial state (online host)
  useEffect(() => {
    if (!deck) return;

    if (!isOnline && deck.length > 0) { // LOCAL GAME INITIAL DEAL
      console.log("useCribbs: Local game - dealing initial cards.");
      const newCenterCard = deck[0];
      const newHand1 = deck.slice(1, 13);
      const newHand2 = deck.slice(13, 25);

      setBoard(prevBoard => {
        const updatedBoard = prevBoard.map(row => [...row]);
        updatedBoard[2][2] = newCenterCard;
        return updatedBoard;
      });
      setHand1(newHand1);
      setHand2(newHand2);
      setSelectedCard(newHand1.length > 0 ? newHand1[newHand1.length - 1] : null);
      setTurn(1); // Player 1 starts
      setNumSpotsLeft(24);
    }
    // Online host: The Game.js component will watch for deck and if host, trigger sendGameAction with 'initialGameState'
    // So, no direct state setting here for online host related to hands/board.
  }, [deck, isOnline]);

  useEffect(() => {
    console.log("useCribbs: hand1 state updated. New hand1:", hand1);
  }, [hand1]);

  useEffect(() => {
    console.log("useCribbs: hand2 state updated. New hand2:", hand2);
  }, [hand2]);

  const _executePlayCardInternal = (cardToPlay, r, c, playerMakingMove) => {
    console.log(`useCribbs: _executePlayCardInternal: P${playerMakingMove} (arg) plays ${cardToPlay?.suit}${cardToPlay?.name} at [${r},${c}].`);
    console.log("useCribbs: _executePlayCardInternal - Card object to be placed on board (cardToPlay):", JSON.stringify(cardToPlay));
    
    setBoard((prevBoard) => {
      const newBoardState = prevBoard.map(row => [...row]);
      newBoardState[r][c] = cardToPlay;
      console.log("useCribbs: _executePlayCardInternal - New board state being set:", JSON.stringify(newBoardState)); // Log new board state
      return newBoardState;
    });

    if (playerMakingMove === 1) {
      setHand1((prevHand) => prevHand.filter(card => !(card.id === cardToPlay.id)));
    } else {
      setHand2((prevHand) => prevHand.filter(card => !(card.id === cardToPlay.id)));
    }

    const newNumSpotsLeft = numSpotsLeft - 1;
    setNumSpotsLeft(newNumSpotsLeft);

    if (newNumSpotsLeft <= 0) {
      setRoundOver(true);
    } else {
      const newTurn = playerMakingMove === 1 ? 2 : 1;
      console.log(`useCribbs: _executePlayCardInternal - Player ${playerMakingMove} made move. Setting turn to: ${newTurn}`); // Log turn change
      setTurn(newTurn); // Switch turn
    }
    setSelectedCard(null); // Clear selection after play
  };

  // Called by Game.js when it wants to make a local move, or to prepare an online move
  const attemptPlayCard = (card, position) => {
    if (gameOver || roundOver) return null;

    if (!card) {
      console.warn("useCribbs: attemptPlayCard - FAILED because 'card' (selectedCard) is null/undefined.");
      return null;
    }
    console.log("useCribbs: attemptPlayCard - Full 'card' (selectedCard) object:", JSON.stringify(card));

    if (!isOnline) { // LOCAL PLAY
        if (!card || (turn === 1 && !hand1.includes(card)) || (turn === 2 && !hand2.includes(card))) {
            console.warn("useCribbs: Local play - Invalid card or not player's card.");
            return null;
        }
        if (board[position[0]][position[1]] !== null) {
             console.warn("useCribbs: Local play - Board position occupied.");
            return null; // Position already taken
        }
        _executePlayCardInternal(card, position[0], position[1], turn);
        return null; // For local, action is immediate.
    } else { // ONLINE PLAY - Prepare action to be sent by Game.js
        console.log(`useCribbs: attemptPlayCard ONLINE - Current MyP#: ${myPlayerNumber}, Current Turn: ${turn}`); // Log for turn check
        if (myPlayerNumber !== turn) { // Check turn separately now
            console.warn(`useCribbs: Online play - Not your turn (MyP: ${myPlayerNumber}, CurrentT: ${turn}). Attempt blocked.`);
            return null;
        }
        // Further validation for online (e.g., is it player's card)
        const currentHand = myPlayerNumber === 1 ? hand1 : hand2;
        console.log("useCribbs: attemptPlayCard - Checking hand. Selected Card ID:", card?.id, "Full selectedCard object for ID check:", JSON.stringify(card), "Current Hand IDs:", currentHand.map(c => c.id));
        if (!currentHand.find(c => c.id === card.id)) {
             console.warn("useCribbs: Online play - Card not in hand (checked by ID).");
            return null;
        }
         if (board[position[0]][position[1]] !== null) {
             console.warn("useCribbs: Online play - Board position occupied.");
            return null; // Position already taken
        }
        
        // Return action data for Game.js to send via sendGameAction
        console.log(`useCribbs: Online play - Preparing 'playCard' action: P${myPlayerNumber} plays ${card.suit}${card.name} at [${position[0]},${position[1]}]`);
        return { action: 'playCard', payload: { card, position, playerNumMakingMove: myPlayerNumber } };
    }
  };


  const applyRemoteAction = (actionType, payload, senderId) => {
    if (!isOnline) {
      console.warn("useCribbs: applyRemoteAction called in non-online mode. Ignoring.");
      return;
    }
    console.log("useCribbs: Applying remote action:", actionType, "Payload:", payload, "Sender:", senderId);

    switch (actionType) {
      case 'initialGameState':
        setBoard(payload.board);
        let newHand1, newHand2;
        console.log("CLIENT useCribbs: initialGameState - Current myPlayerNumber BEFORE update:", myPlayerNumber, "isHostClient:", isHostClient); // Log client player number
        if (myPlayerNumber === 1) {
          newHand1 = payload.hand1;
          setHand1(newHand1); 
        } else {
          newHand1 = []; // Non-P1 doesn't set P1 hand locally from this payload
        }
        
        if (myPlayerNumber === 2) {
          newHand2 = payload.hand2;
          setHand2(newHand2);
        } else {
          newHand2 = []; // Non-P2 doesn't set P2 hand locally
        }
        // Log what was actually set to the state for this client
        console.log(`useCribbs: applyRemoteAction initialGameState - For MyPlayerNumber ${myPlayerNumber}:`, 
                    { board: payload.board, myActualHand: myPlayerNumber === 1 ? newHand1 : newHand2, turn: payload.startingTurn || 1});
        console.log("CLIENT useCribbs: initialGameState - My actual hand (based on myPlayerNumber):", myPlayerNumber === 1 ? newHand1 : newHand2);

        setTurn(payload.startingTurn || 1);
        setSelectedCard(null); 
        setNumSpotsLeft(payload.numSpotsLeft || 24); // Ensure this is synced
        setDeck(payload.deck); // Full deck if needed for validation, or just cut card
        setCurrentRound(1);
        setRoundOver(false);
        setGameOver(false);
        setRoundScoreVisible(false);
        console.log("useCribbs: Applied 'initialGameState'. My hand:", myPlayerNumber === 1 ? hand1 : hand2);
        break;

      case 'playCard':
        // Payload: { card, position, playerNumMakingMove }
        const { card: remoteCard, position: remotePosition, playerNumMakingMove: remotePlayerNum } = payload;
        console.log("CLIENT useCribbs: applyRemoteAction for 'playCard' - Current myPlayerNumber:", myPlayerNumber); // Log client player number
        console.log("CLIENT useCribbs: applyRemoteAction for 'playCard': Received raw payload card:", JSON.stringify(payload.card), "Position:", remotePosition, "PlayerWhoMoved:", remotePlayerNum);
        console.log("CLIENT useCribbs: applyRemoteAction for 'playCard': Destructured remoteCard object:", JSON.stringify(remoteCard));
        if (remotePlayerNum === myPlayerNumber) {
          console.log("CLIENT useCribbs: Received 'playCard' for my own move. State should already reflect this if optimistically updated, or will be confirmed now.");
        }
        _executePlayCardInternal(remoteCard, remotePosition[0], remotePosition[1], remotePlayerNum);
        break;
      
      case 'nextRoundReady': // Sent by host, received by joiner
        // Payload: { nextDeck, nextBoardCenterCard, nextHand1, nextHand2 } // Host prepares this
        console.log("useCribbs: Received 'nextRoundReady'. Updating state for new round.");
        setDeck(payload.nextDeck); // Full new deck
        setBoard(prevBoard => { // Only update center card
            const updatedBoard = newBoard(); // Start with a fresh board
            updatedBoard[2][2] = payload.nextBoardCenterCard;
            return updatedBoard;
        });
        if (myPlayerNumber === 1) setHand1(payload.nextHand1);
        else setHand2(payload.nextHand2);
        
        setRoundScoreVisible(false);
        setNumSpotsLeft(24);
        setRoundOver(false);
        setTurn(1); // Player 1 (Host) typically starts new round, or server can specify
        setCurrentRound(prev => prev + 1);
        setSelectedCard(myPlayerNumber === 1 ? payload.nextHand1[payload.nextHand1.length-1] : payload.nextHand2[payload.nextHand2.length-1]);
        break;

      default:
        console.warn("useCribbs: Unknown remote action type:", actionType);
    }
  };

  // Select card: local only, or for current player in online game if it's their turn
  const selectCard = (card, player) => {
    if (isOnline) {
      if (myPlayerNumber !== player || myPlayerNumber !== turn) {
        console.log(`useCribbs: Online - selectCard blocked. MyP#: ${myPlayerNumber}, Card's P#: ${player}, CurrentTurn: ${turn}`);
        return;
      }
    } else { // Local game
      if (player !== turn) return;
    }
    setSelectedCard(card);
    console.log("useCribbs: selectCard - selectedCard SET TO:", card);
  };

  // useEffect for round over logic (common for local and online as board is source of truth)
  useEffect(() => {
    if (!roundOver) return;

    console.log("useCribbs: Round is over. Calculating scores.");
    setRoundScoreVisible(true);
    const newRoundScores = tallyScores(board);
    setRoundScores(newRoundScores);

    const [rowRoundScore, columnRoundScore] = newRoundScores;
    const rowPoints = rowRoundScore.total();
    const columnPoints = columnRoundScore.total();
    const pointDiff = Math.abs(rowPoints - columnPoints);
    const roundActualWinner = rowPoints >= columnPoints ? "Row" : "Column"; // Determines who gets points

    setRoundHistory(prev => [...prev, {
      round: currentRound,
      rowScore: rowPoints,
      columnScore: columnPoints,
      pointDiff,
      winner: roundActualWinner
    }]);

    setTotalScores(prevTotalScores => {
      const updatedTotalScores = [...prevTotalScores];
      if (rowPoints >= columnPoints) { // Player 1 (Row player)
        updatedTotalScores[0] += pointDiff;
      } else { // Player 2 (Column player)
        updatedTotalScores[1] += pointDiff;
      }

      if (updatedTotalScores[0] >= 31) {
        setGameOver(true);
        setWinner(isOnline ? (myPlayerNumber === 1 ? 'You' : 'Opponent') : 'Player 1 (Rows)');
      } else if (updatedTotalScores[1] >= 31) {
        setGameOver(true);
        setWinner(isOnline ? (myPlayerNumber === 2 ? 'You' : 'Opponent') : 'Player 2 (Columns)');
      }
      return updatedTotalScores;
    });

  }, [roundOver, board, currentRound, isOnline, myPlayerNumber]);

  // nextRound: For local games, or for Host to initiate in online games
  const nextRound = () => {
    if (gameOver) return null;

    if (!isOnline) { // LOCAL GAME: Reset and deal
      console.log("useCribbs: Local game - advancing to next round.");
      resetGameInternal(false); // This will call setDeck(newDeck()) which triggers deal
      setCurrentRound(prev => prev + 1); // setCurrentRound was missing in local nextRound before
      return null;
    } else { // ONLINE GAME: Only Host should prepare and send 'nextRoundReady' action data
      if (isHostClient) {
        console.log("useCribbs: Online Host - preparing 'nextRoundReady' action data.");
        const newGeneratedDeck = newDeck();
        const nextBoardCenterCard = newGeneratedDeck[0];
        const nextHand1 = newGeneratedDeck.slice(1, 13);
        const nextHand2 = newGeneratedDeck.slice(13, 25);
        
        // Return action data for Game.js to send
        return { 
            action: 'nextRoundReady', 
            payload: { 
                nextDeck: newGeneratedDeck, 
                nextBoardCenterCard, 
                nextHand1, 
                nextHand2 
            } 
        };
      } else {
        // Non-host client waits for 'nextRoundReady' from server
        console.log("useCribbs: Online Non-Host - waiting for host to start next round.");
        return null;
      }
    }
  };
  
  // Getter for Game.js to prepare initial game state if it's the host
  const getInitialOnlineGameState = () => {
    console.log("useCribbs: getInitialOnlineGameState CALLED. Conditions:", {isOnline, isHostClient, isInitialDeckReadyForHost, deckExists: !!deck, deckLength: deck ? deck.length : 0});
    if (isOnline && isHostClient && isInitialDeckReadyForHost && deck && deck.length > 0) {
      const initialBoard = newBoard();
      initialBoard[2][2] = deck[0]; // Center card
      const initialHand1 = deck.slice(1, 13); // Host is P1
      const initialHand2 = deck.slice(13, 25); // For P2
      
      return {
        action: 'initialGameState',
        payload: {
          board: initialBoard,
          hand1: initialHand1, // Host's actual hand
          hand2: initialHand2, // Opponent's hand (server will filter for P2)
          startingTurn: 1, // Host (P1) starts
          numSpotsLeft: 24,
          deck: deck // Send the whole deck, or just necessary parts
        }
      };
    }
    return null;
  };


  // Update selected card based on whose turn it is and their hand (mostly for local)
  useEffect(() => {
    if (isOnline) {
        // Online: card selection is more explicit via selectCard, and depends on player's actual hand
        // Potentially auto-select if it's my turn and I have cards.
        if (myPlayerNumber === turn) {
            const currentHand = myPlayerNumber === 1 ? hand1 : hand2;
            if (currentHand.length > 0 && !selectedCard) { // Auto-select if nothing is selected
                 setSelectedCard(currentHand[currentHand.length - 1]); // Or first card?
            }
        } else {
            setSelectedCard(null); // Not my turn, no selection
        }
    } else { // Local game: original logic
      let handToUse;
      if (turn === 1) handToUse = hand1;
      else if (turn === 2) handToUse = hand2;
      else handToUse = [];
      
      if (handToUse.length > 0) {
        // If current selectedCard is not in the current player's hand, update it
        if (!selectedCard || !handToUse.find(c => c.id === selectedCard.id)) {
            setSelectedCard(handToUse[handToUse.length - 1]);
        }
      } else {
        setSelectedCard(null);
      }
    }
  }, [turn, hand1, hand2, isOnline, myPlayerNumber, selectedCard]);


  return {
    board,
    turn,
    hand1,
    hand2,
    selectedCard,
    selectCard, // For player to manually select card
    attemptPlayCard, // New: for Game.js to call to try to play a card
    nextRound,
    roundScores,
    totalScores,
    gameOver,
    winner,
    resetGame,
    roundHistory,
    currentRound,
    roundScoreVisible,
    
    // Online specific exports
    setOnlinePlay, // For Game.js to set mode and player details
    applyRemoteAction, // For Game.js to apply actions from server
    getInitialOnlineGameState, // For Host in Game.js to get initial state to send

    // For UI display or logic in Game.js
    isOnline,
    myPlayerNumber,
    isInitialDeckReadyForHost // Export new state
  };
}
