export default function TurnIndicator({ turn, player1Name, player2Name, myPlayerNumber }) {
  const isOnlineGame = myPlayerNumber !== null && myPlayerNumber !== undefined;
  
  let p1DisplayTurn = player1Name;
  let p2DisplayTurn = player2Name;
  let turnMessage;

  if (isOnlineGame) {
    if (turn === myPlayerNumber) {
      turnMessage = "Your Turn";
      if (myPlayerNumber === 1) p1DisplayTurn = `${player1Name} (You)`;
      if (myPlayerNumber === 2) p2DisplayTurn = `${player2Name} (You)`;
    } else {
      turnMessage = "Opponent's Turn";
      if (myPlayerNumber === 1) p2DisplayTurn = `${player2Name} (Opponent)`;
      if (myPlayerNumber === 2) p1DisplayTurn = `${player1Name} (Opponent)`;
    }
  } else {
    // Local game turn message
    turnMessage = turn === 1 ? `${player1Name}'s turn` : `${player2Name}'s turn`;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-slate-600 text-white p-3 rounded-lg shadow-lg z-20">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${turn === 1 ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
        <span className={`font-bold ${isOnlineGame && myPlayerNumber === 1 && turn === 1 ? 'text-yellow-300' : ''}`}>{p1DisplayTurn}</span>
        <span className="text-cyan-400 text-sm">(Row)</span>
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <div className={`w-3 h-3 rounded-full ${turn === 2 ? 'bg-fuchsia-400' : 'bg-gray-400'}`}></div>
        <span className={`font-bold ${isOnlineGame && myPlayerNumber === 2 && turn === 2 ? 'text-yellow-300' : ''}`}>{p2DisplayTurn}</span>
        <span className="text-fuchsia-400 text-sm">(Column)</span>
      </div>
      <div className="mt-3 pt-2 border-t border-slate-500 text-base text-center font-semibold">
        {turnMessage}
      </div>
    </div>
  );
} 