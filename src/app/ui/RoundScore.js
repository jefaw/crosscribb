
export default function RoundScore(props) {
  const { nextRound, scoresArray } = props;

  function scoreDiff(){
    let winner = scoresArray[0].total() > scoresArray[1].total() 
      ? "Row" : "Column"

    return winner; 
  }
  
  return (
    <div
      className="absolute inset-0 mx-auto my-auto w-[330px] h-[450px] p-5 px-10 bg-slate-600 opacity-90 text-white rounded-lg border-2 border-solid border-slate-800
      transition-opacity ease-in duration-700"
    >
      <h2 className="text-center text-3xl mb-5">Round Summary</h2>
      <div className="flex flex-col">
        <div className="w-full flex justify-center mb-5 text-center">
          <div>
            <h3 className="font-bold text-3xl mb-3 text-pink-400">Row</h3>
            <p className="text-2xl text-pink-400">Round Score: {scoresArray[0].total()}</p>
            <p className="text-1xl">{scoresArray[0].pairs} (pairs) + {scoresArray[0].runs} (runs) + {scoresArray[0].fifteens} (fifteens)</p>
            <p className="text-2xl">Total Score: 9999</p>
          </div>
        </div>
        <div className="w-full flex justify-center mb-5 text-center ">
          <div>
            <h3 className="font-bold text-3xl mb-3 text-orange-600">Column</h3>
            <p className="text-2xl text-orange-600">Round Score: {scoresArray[1].total()}</p>
            <p className="text-1xl">{scoresArray[1].pairs} (pairs) + {scoresArray[1].runs} (runs) + {scoresArray[1].fifteens} (fifteens)</p>
            <p className="text-2xl ">Total Score: 9999</p>

            <p className="font-semi-bold text-xl bg-green-700">{scoreDiff()} earns {Math.abs(scoresArray[0].total() - scoresArray[1].total())} points!</p>
          </div>
        </div>
        <button
          className="bg-yellow-400 text-black rounded-xl text-2xl border-white border-2 hover:bg-yellow-500"
          onClick={nextRound}
        >
          <span className="drop-shadow-md">Next Round</span>
        </button>
      </div>
    </div>
  );
}
