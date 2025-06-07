import { useState, useEffect } from 'react';

export default function Menu({ onStartGame, multiplayerStatus, onStartOnlineGame }) {
  const [currentPage, setCurrentPage] = useState('main'); // main, gameType, playerSetup, onlineOptions, joinGame, waitingRoom
  const [gameType, setGameType] = useState(null); // 'local' or 'online'
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameIdToJoin, setGameIdToJoin] = useState(''); // For joining a specific game

  // Effect to navigate to waiting room if a gameId appears in multiplayerStatus
  useEffect(() => {
    if (multiplayerStatus && multiplayerStatus.gameId && (currentPage === 'onlineOptions' || currentPage === 'joinGame')) {
      setCurrentPage('waitingRoom');
    }
    // If gameId disappears (e.g. player left, error), go back to onlineOptions
    // This needs careful handling to avoid loops if error is persistent
    if (!multiplayerStatus.gameId && currentPage === 'waitingRoom' && !multiplayerStatus.error) {
        // setCurrentPage('onlineOptions'); // Or main, depending on desired flow
    }
  }, [multiplayerStatus, currentPage]);

  const handleGameTypeSelect = (type) => {
    setGameType(type);
    if (type === 'local') {
      setCurrentPage('gameType');
    } else if (type === 'online') {
      setCurrentPage('onlineOptions');
    }
  };

  const handleModeSelect = (mode) => {
    if (mode === '1v1') {
      setCurrentPage('playerSetup');
    }
    // 2v2 will be handled later
  };

  const handleStartGame = () => {
    if (player1Name && player2Name) {
      onStartGame({ player1Name, player2Name, gameType }); // Pass gameType
    }
  };

  const handleCreateOnlineGame = () => {
    onStartGame({ gameType: 'online', action: 'create' });
    // Navigation to waitingRoom will be handled by useEffect
  };

  const handleJoinOnlineGame = () => {
    if (gameIdToJoin) {
      onStartGame({ gameType: 'online', action: 'join', gameId: gameIdToJoin });
      // Navigation to waitingRoom will be handled by useEffect
    }
  };

  const handleActualOnlineGameStart = () => {
    if (onStartOnlineGame) {
      onStartOnlineGame(); // This calls multiplayer.startGame()
    }
  };
  
  const handleLeaveOnlineGame = () => {
    // This needs a way to tell useMultiplayer to disconnect or leave the room
    // For now, we can just go back to the main menu. The disconnect event in useMultiplayer will handle cleanup.
    // A more explicit 'leaveRoom' emission would be better.
    // socketRef.current.emit('leaveGame', gameId); // Example: if socketRef was available
    setCurrentPage('main'); 
    // Reset local states related to online game
    setGameType(null); 
    // onStartGame({ gameType: 'online', action: 'leave' }); // Inform Home to reset multiplayer state if needed
  };

  const renderMainMenu = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Select Game Type</h2>
      <button
        onClick={() => handleGameTypeSelect('local')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        Local Multiplayer
      </button>
      <button
        onClick={() => handleGameTypeSelect('online')}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        Online Multiplayer
      </button>
    </div>
  );

  const renderGameTypeMenu = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Select Game Mode</h2>
      <button
        onClick={() => handleModeSelect('1v1')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        1v1
      </button>
      <button
        onClick={() => handleModeSelect('2v2')}
        className="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-lg text-lg opacity-50 cursor-not-allowed"
        disabled
      >
        2v2 (Coming Soon)
      </button>
      <button
        onClick={() => setCurrentPage('main')}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors duration-200"
      >
        Back
      </button>
    </div>
  );

  const renderPlayerSetup = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Enter Player Names</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm font-bold mb-2" htmlFor="player1">
            Player 1 Name
          </label>
          <input
            type="text"
            id="player1"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Player 1 name"
          />
        </div>
        <div>
          <label className="block text-white text-sm font-bold mb-2" htmlFor="player2">
            Player 2 Name
          </label>
          <input
            type="text"
            id="player2"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Player 2 name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <button
          onClick={handleStartGame}
          disabled={!player1Name || !player2Name}
          className={`w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 ${
            player1Name && player2Name
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-500 text-white opacity-50 cursor-not-allowed'
          }`}
        >
          Start Game
        </button>
        <button
          onClick={() => setCurrentPage('gameType')}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors duration-200"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderOnlineOptions = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Online Multiplayer</h2>
      {multiplayerStatus && multiplayerStatus.error && (
        <p className="text-red-400 bg-red-900 p-2 rounded-md">Error: {multiplayerStatus.error}</p>
      )}
      <button
        onClick={handleCreateOnlineGame}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        Create Game
      </button>
      <button
        onClick={() => setCurrentPage('joinGame')}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        Join Game
      </button>
      <button
        onClick={() => setCurrentPage('main')}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors duration-200"
      >
        Back
      </button>
    </div>
  );

  const renderJoinGameInput = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Join Game</h2>
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="gameId">
          Enter Game ID
        </label>
        <input
          type="text"
          id="gameId"
          value={gameIdToJoin}
          onChange={(e) => setGameIdToJoin(e.target.value.trim().toLowerCase())}
          className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Game ID"
        />
      </div>
      <div className="space-y-2">
        <button
          onClick={handleJoinOnlineGame}
          disabled={!gameIdToJoin}
          className={`w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 ${
            gameIdToJoin
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-500 text-white opacity-50 cursor-not-allowed'
          }`}
        >
          Join
        </button>
        <button
          onClick={() => setCurrentPage('onlineOptions')}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors duration-200"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderWaitingRoom = () => {
    if (!multiplayerStatus || !multiplayerStatus.gameId) {
      // Should not happen if navigation logic is correct, but as a fallback:
      return (
        <div className="space-y-4 text-white">
          <p>Error: No game session active. Returning to options...</p>
          <button
            onClick={() => setCurrentPage('onlineOptions')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors duration-200"
          >
            Back to Online Options
          </button>
        </div>
      );
    }

    const { gameId, players, isHost, canStart, error } = multiplayerStatus;

    return (
      <div className="space-y-4 text-white">
        <h2 className="text-2xl font-bold mb-6">Waiting Room</h2>
        {error && (
          <p className="text-red-400 bg-red-900 p-2 rounded-md">Error: {error}</p>
        )}
        <p>Game ID: <span className="font-bold text-yellow-400">{gameId}</span></p>
        <p>Share this ID with your friend to join!</p>
        <h3 className="text-lg font-semibold mt-4">Players ({players.length}/2):</h3>
        <ul className="list-disc list-inside bg-slate-600 p-3 rounded-md">
          {players.map((playerId, index) => (
            <li key={index}>Player {index + 1} (ID: {playerId.substring(0,5)}...) {playerId === multiplayerStatus.myPlayerId ? ' (You)' : ''}</li>
          ))}
        </ul>
        
        {players.length < 2 && !isHost && (
            <p className="mt-4 text-yellow-300">Waiting for the host to start the game...</p>
        )}
         {players.length < 2 && isHost && (
            <p className="mt-4 text-yellow-300">Waiting for another player to join...</p>
        )}

        {isHost && players.length === 2 && canStart && (
          <button
            onClick={handleActualOnlineGameStart}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg mt-4 transition-colors duration-200"
          >
            Start Game
          </button>
        )}
        {isHost && players.length === 2 && !canStart && (
            <p className="mt-4 text-green-300">Both players are here! Ready to start!</p>
             // Server emits 'readyToStart' which sets canStart in useMultiplayer, then this button appears.
        )}

        <button
          onClick={handleLeaveOnlineGame} // Use a new handler for leaving
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-base mt-6 transition-colors duration-200"
        >
          Leave Game
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text">
          Cross Cribbs
        </h1>
      </div>

      <div className="bg-slate-700 p-8 rounded-lg shadow-xl w-[400px]">
        {currentPage === 'main' && renderMainMenu()}
        {currentPage === 'gameType' && renderGameTypeMenu()}
        {currentPage === 'playerSetup' && renderPlayerSetup()}
        {currentPage === 'onlineOptions' && renderOnlineOptions()}
        {currentPage === 'joinGame' && renderJoinGameInput()}
        {currentPage === 'waitingRoom' && renderWaitingRoom()}
      </div>
    </div>
  );
} 