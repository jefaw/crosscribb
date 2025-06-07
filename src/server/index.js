const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity during development
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

let gameRooms = {}; // Stores game room states

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('createGame', () => {
    const gameId = Math.random().toString(36).substr(2, 5); // Generate a random game ID
    gameRooms[gameId] = {
      players: [socket.id],
      host: socket.id,
      // We can add game state here later
    };
    socket.join(gameId);
    socket.emit('gameCreated', { gameId, playerId: socket.id });
    console.log('Game created:', gameId, 'by host:', socket.id);
  });

  socket.on('joinGame', (gameId) => {
    if (gameRooms[gameId] && gameRooms[gameId].players.length < 2) {
      gameRooms[gameId].players.push(socket.id);
      socket.join(gameId);
      io.to(gameId).emit('playerJoined', { 
        gameId, 
        players: gameRooms[gameId].players, 
        newPlayerId: socket.id // Send the ID of the player who just joined
      });
      console.log('Player', socket.id, 'joined game:', gameId);
      // Notify host if two players are now in the room
      if (gameRooms[gameId].players.length === 2) {
        io.to(gameRooms[gameId].host).emit('readyToStart', { gameId });
         console.log('Game', gameId, 'is ready to start');
      }
    } else if (gameRooms[gameId] && gameRooms[gameId].players.length >= 2) {
      socket.emit('roomFull', { gameId });
      console.log('Attempt to join full game:', gameId, 'by player:', socket.id);
    }
    else {
      socket.emit('gameNotFound', { gameId });
      console.log('Attempt to join non-existent game:', gameId, 'by player:', socket.id);
    }
  });

  socket.on('startGame', (gameId) => {
    if (gameRooms[gameId] && gameRooms[gameId].host === socket.id && gameRooms[gameId].players.length === 2) {
      // Inform clients game has started. Host client will then send initial game state.
      io.to(gameId).emit('gameStarted', { 
        gameId, 
        startingPlayer: gameRooms[gameId].players[0], // Player ID of P1 (host)
        players: gameRooms[gameId].players // Send array of player IDs [host, joiner]
      });
      console.log('Game started event emitted for:', gameId, 'Players:', gameRooms[gameId].players);
    } else {
      // Handle error: not host, not enough players, or game not found
      socket.emit('startGameFailed', {gameId, message: 'Cannot start game.'});
      console.log('Start game failed for game:', gameId, 'by player:', socket.id);
    }
  });

  // Relay game actions
  socket.on('gameAction', (data) => {
    const { gameId, action, payload } = data;
    if (gameRooms[gameId]) {
      let playerNumMakingMove = -1;
      const playerIndex = gameRooms[gameId].players.indexOf(socket.id);
      if (playerIndex !== -1) {
        playerNumMakingMove = playerIndex + 1;
      }

      console.log(`Server: Received gameAction '${action}' from P${playerNumMakingMove} (${socket.id}) for game ${gameId}`);

      if (action === 'initialGameState' || action === 'nextRoundReady') {
        // These actions are sent by the host (P1) and should be relayed to the other player (P2)
        if (socket.id === gameRooms[gameId].host) {
          socket.to(gameId).emit('actionRelayed', { action, payload, sender: socket.id });
          console.log(`Server: Relayed '${action}' to other player in game ${gameId}`);
        } else {
          console.warn(`Server: Received '${action}' from non-host. Ignoring.`);
        }
      } else if (action === 'playCard') {
        const payloadToRelay = { ...payload, playerNumMakingMove };
        socket.to(gameId).emit('actionRelayed', { action, payload: payloadToRelay, sender: socket.id });
        console.log(`Server: Relayed 'playCard' to other player in game ${gameId} with P# ${playerNumMakingMove}`);
      } else {
        // Generic relay for other actions if needed in future
        socket.to(gameId).emit('actionRelayed', { action, payload, sender: socket.id });
        console.log(`Server: Relayed generic action '${action}' to other player in game ${gameId}`);
      }
    }
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Handle player disconnects from game rooms
    for (const gameId in gameRooms) {
      const room = gameRooms[gameId];
      const playerIndex = room.players.indexOf(socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        console.log('Player', socket.id, 'removed from game:', gameId);
        if (room.players.length < 2) {
            // If a player leaves and there's no longer 2 players, notify remaining player.
            // Also, if host leaves, potentially assign new host or end game.
            io.to(gameId).emit('playerLeft', { gameId, remainingPlayers: room.players });
             console.log('Player left game', gameId, '. Remaining players:', room.players.length);
        }
        if (room.players.length === 0) {
          delete gameRooms[gameId];
          console.log('Game room empty, deleting game:', gameId);
        }
        break; 
      }
    }
  });
});

server.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
}); 