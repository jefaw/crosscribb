export default function GameOver({ winner, totalScores, resetGame }) {
  return (
    <div className="absolute inset-0 mx-auto my-auto w-[330px] h-[450px] p-5 bg-slate-600 opacity-95 text-white rounded-lg border-2 border-solid border-slate-800
      transition-opacity ease-in duration-700">
      <h2 className="text-center text-3xl mb-3">Game Over!</h2>
      <div className="flex flex-col">
        <div className="w-full flex justify-center mb-3 text-center">
          <div>
            <h3 className="font-bold text-3xl text-cyan-400">Row</h3>
            <p className="text-2xl">Total Score: {totalScores[0]}</p>
          </div>
        </div>
        <div className="w-full flex justify-center mb-3 text-center">
          <div>
            <h3 className="font-bold text-3xl text-fuchsia-400">Column</h3>
            <p className="text-2xl mb-2">Total Score: {totalScores[1]}</p>
            <p className="font-semi-bold text-xl bg-emerald-600 rounded-md mb-1 italic">
              {winner} wins the game!
            </p>
          </div>
        </div>
        <button
          onClick={resetGame}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Play Again
        </button>
      </div>
    </div>
  );
} 