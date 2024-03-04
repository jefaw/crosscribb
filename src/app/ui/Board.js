import Spot from "./Spot";

export default function Board(props) {
  const { board, centerCard } = props;
  let displayBoard = [];
  // Render board
  for (let r = 0; r < 5; r++) {
    let row = [];
    for (let c = 0; c < 5; c++) {
      // Pushing spot into row
      if (r === 2 && c === 2) {
        row.push(<Spot r={r} c={c} card={centerCard} key={`${r}, ${c}`} />);
      } else {
        row.push(<Spot r={r} c={c} card={board[r][c]} key={`${r}, ${c}`} />);
      }
    }

    // Pushing row of spots into board
    displayBoard.push(
      <tr className="" key={r}>
        {row}
      </tr>
    );
  }

  return (
    <div className="flex justify-center">
      <table className="bg-green-600 border-separate border-spacing-4 h-screen">
        <tbody>{displayBoard}</tbody>
      </table>
    </div>
  );
}
