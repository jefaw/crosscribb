export default function RoundHistory({ roundHistory }) {
  if (roundHistory.length === 0) return null;

  // Calculate running totals
  let rowTotal = 0;
  let columnTotal = 0;

  // Create a copy of roundHistory and reverse it
  const reversedHistory = [...roundHistory].reverse();

  return (
    <div className="fixed bottom-4 right-4 bg-slate-600 text-white p-4 rounded-lg shadow-lg max-h-[300px] overflow-y-auto w-[220px]">
      <h3 className="text-lg font-bold mb-3">Round History</h3>
      <div className="space-y-3">
        {reversedHistory.map((round) => {
          // Update running totals
          if (round.winner === "Row") {
            rowTotal += round.pointDiff;
          } else {
            columnTotal += round.pointDiff;
          }

          return (
            <div key={round.round} className="text-sm border-b border-slate-500 pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Round {round.round}</span>
                <span className={`font-bold ${round.winner === "Row" ? "text-cyan-400" : "text-fuchsia-400"}`}>
                  {round.winner} +{round.pointDiff}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-300 mt-1">
                <span>Row: {round.rowScore}</span>
                <span>Column: {round.columnScore}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-cyan-400">Total: {rowTotal}</span>
                <span className="text-fuchsia-400">Total: {columnTotal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 