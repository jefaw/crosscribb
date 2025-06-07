import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001'; // Make sure this matches your server

export default function useMultiplayer() {
  const socketRef = useRef(null);
  const [playerId, setPlayerId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [canStart, setCanStart] = useState(false); // For host to know when 2 players are in
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState(null); // For errors like room full, game not found
  const [lastAction, setLastAction] = useState(null); // To receive actions from the other player

  // Effect for socket connection and event listeners (runs once on mount)
  useEffect(() => {
    socketRef.current = io(SERVER_URL);
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log('Connected to socket server with id:', socket.id);
    };

    const handleGameCreated = ({ gameId: newGameId, playerId: newPlayerId }) => {
      console.log('Game created by server:', newGameId, 'My player ID from server:', newPlayerId);
      setGameId(newGameId);
      setPlayerId(newPlayerId);
      setPlayers([newPlayerId]);
      setIsHost(true); // This will trigger the isHost-dependent useEffect
      setError(null);
    };

    const handlePlayerJoined = ({ gameId: joinedGameId, players: updatedPlayers, newPlayerId }) => {
      console.log('Player joined game:', joinedGameId, 'Players:', updatedPlayers, 'New Player ID (if me):', newPlayerId);
      setPlayers(updatedPlayers);
      if (newPlayerId && socketRef.current && newPlayerId === socketRef.current.id) {
        console.log('This client is the new player who joined. Setting playerId:', newPlayerId);
        setPlayerId(newPlayerId);
      }
      setError(null);
    };

    const handleReadyToStart = ({ gameId: readyGameId }) => {
      console.log('Game ready to start:', readyGameId);
      // Logic for canStart will be in the isHost-dependent effect or directly set if appropriate
      // For now, if host receives this, they can start. The host check is better in the component triggering startGame.
      // setIsHost is already true if this client created the game.
      // If using this event to enable button for host, check isHost state before setCanStart(true)
      // Here, we can just update `canStart` if this client is indeed the host.
      // This requires access to `isHost` state, which is fine within this hook.
      // Re-checking: `isHost` is set by `handleGameCreated`. So, if this event comes, `isHost` is already set.
      // The `Menu.js` component will use `multiplayerStatus.isHost` and `multiplayerStatus.canStart`
      // So, `useMultiplayer` needs to set `canStart` correctly.
      // The original logic was: if (isHost) { setCanStart(true); } -> This will be handled by a separate effect reacting to isHost or direct set
      // The server sends 'readyToStart' TO THE HOST. So if this client receives it, it must be the host.
      setCanStart(true);
    };

    const handleGameStarted = ({ gameId: startedGameId, startingPlayer }) => {
      console.log('Game started by host:', startedGameId, 'Starting player:', startingPlayer);
      setGameStarted(true);
      setCanStart(false);
      setError(null);
    };

    const handleActionRelayed = ({ action, payload, sender }) => {
      console.log('Action relayed from server:', action, payload, 'from sender:', sender);
      // Check against current playerId state directly
      if (sender !== playerId) {
        setLastAction({ action, payload, sender });
      }
    };

    const handlePlayerLeft = ({ gameId: affectedGameId, remainingPlayers }) => {
      console.log('Player left game:', affectedGameId, 'Remaining:', remainingPlayers);
      setPlayers(remainingPlayers);
      setGameStarted(false);
      setCanStart(false);
      if (remainingPlayers.length < 2 && isHost && playerId === remainingPlayers[0]) {
        // If I am the host and the only one left, I am no longer waiting for someone to start
        setCanStart(false);
      }
      if (remainingPlayers.length === 0) {
        setGameId(null); // Game room is empty, clear gameId
        setIsHost(false);
      }
    };

    const handleRoomFull = ({ gameId: fullGameId }) => {
      console.error('Error: Room is full for game:', fullGameId);
      setError(`Room for game ${fullGameId} is full.`);
    };

    const handleGameNotFound = ({ gameId: notFoundGameId }) => {
      console.error('Error: Game not found:', notFoundGameId);
      setError(`Game ${notFoundGameId} not found.`);
    };

    const handleStartGameFailed = ({ gameId: failedGameId, message }) => {
      console.error('Error: Start game failed for game:', failedGameId, message);
      setError(message || `Failed to start game ${failedGameId}.`);
    };

    const handleDisconnect = () => {
      console.log('Disconnected from socket server');
      setGameId(null);
      setPlayerId(null);
      setPlayers([]);
      setIsHost(false);
      setCanStart(false);
      setGameStarted(false);
      // setError('Disconnected from server. Please refresh or try again.'); // Optional: inform user
    };

    socket.on('connect', handleConnect);
    socket.on('gameCreated', handleGameCreated);
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('readyToStart', handleReadyToStart);
    socket.on('gameStarted', handleGameStarted);
    socket.on('actionRelayed', handleActionRelayed);
    socket.on('playerLeft', handlePlayerLeft);
    socket.on('roomFull', handleRoomFull);
    socket.on('gameNotFound', handleGameNotFound);
    socket.on('startGameFailed', handleStartGameFailed);
    socket.on('disconnect', handleDisconnect);

    return () => {
      console.log('Disconnecting socket and cleaning up listeners...');
      socket.off('connect', handleConnect);
      socket.off('gameCreated', handleGameCreated);
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('readyToStart', handleReadyToStart);
      socket.off('gameStarted', handleGameStarted);
      socket.off('actionRelayed', handleActionRelayed);
      socket.off('playerLeft', handlePlayerLeft);
      socket.off('roomFull', handleRoomFull);
      socket.off('gameNotFound', handleGameNotFound);
      socket.off('startGameFailed', handleStartGameFailed);
      socket.off('disconnect', handleDisconnect);
      socket.disconnect();
      // Reset all states on unmount to ensure clean state if component remounts
      handleDisconnect(); // Call this to ensure all states are reset
    };
  }, []); // Empty dependency array: runs ONCE on mount, cleans up on UNMOUNT

  // Add a log to see what playerId is being returned by the hook
  console.log("useMultiplayer hook: Returning playerId:", playerId, "gameId:", gameId, "gameStarted:", gameStarted);

  // Example of an effect that depends on isHost, if needed for host-specific client logic
  useEffect(() => {
    if (isHost) {
      console.log('useMultiplayer: This client is now flagged as HOST.');
      // If 'readyToStart' was received by server *before* this client knew it was host,
      // this logic might be too late. The `setCanStart(true)` in `handleReadyToStart` is more direct.
    } else {
      // If isHost becomes false (e.g. after disconnect or leaving game)
      setCanStart(false); // A non-host cannot start a game
    }
  }, [isHost]);

  const createGame = () => {
    if (socketRef.current) {
      console.log('Emitting createGame');
      socketRef.current.emit('createGame');
    }
  };

  const joinGame = (idToJoin) => {
    if (socketRef.current && idToJoin) {
      console.log('Emitting joinGame for gameId:', idToJoin);
      socketRef.current.emit('joinGame', idToJoin);
    }
  };

  const startGame = () => {
    // Check isHost state here directly, as well as canStart
    if (socketRef.current && gameId && isHost && canStart) {
      console.log('Emitting startGame for gameId:', gameId);
      socketRef.current.emit('startGame', gameId);
    } else {
      console.warn('startGame called but conditions not met:', { gameId, isHost, canStart });
    }
  };

  const sendGameAction = (action, payload) => {
    if (socketRef.current && gameId) {
      console.log('Emitting gameAction:', action, 'payload:', payload, 'for gameId:', gameId);
      socketRef.current.emit('gameAction', { gameId, action, payload });
    }
  };

  return {
    playerId,
    gameId,
    players,
    isHost,
    canStart,
    gameStarted,
    error,
    lastAction,
    createGame,
    joinGame,
    startGame,
    sendGameAction,
    clearError: () => setError(null),
  };
} 