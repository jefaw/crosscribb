import { tallyScores } from "../lib/helpers";

export default function RoundScore(props) {
  const { nextRound, board } = props;
  
  //[rowTotals, colTotals]
  const scoresArray = tallyScores(board)


  return (
    <div
      className="absolute inset-0 mx-auto my-auto w-[330px] h-[450px] p-5 px-10 bg-slate-600 opacity-90 text-white rounded-lg border-2 border-solid border-slate-800
      transition-opacity ease-in duration-700 opacity-90"
    >
      <h2 className="text-center text-4xl mb-5">Round Summary</h2>
      <div className="flex flex-col">
        <div className="w-full flex justify-center mb-5 text-center">
          <div>
            <h3 className="italic text-3xl mb-3">Row</h3>
            <p className="text-2xl">Round Score: {scoresArray[0].total()}</p>
            <p className="text-2xl">Total Score: 18</p>
          </div>
        </div>
        <div className="w-full flex justify-center mb-5 text-center">
          <div>
            <h3 className="italic text-3xl mb-3">Column</h3>
            <p className="text-2xl">Round Score: 12</p>
            <p className="text-2xl">Total Score: 18</p>
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
