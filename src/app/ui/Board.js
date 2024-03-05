import Spot from "./Spot";

export default function Board(props) {
  const { board, centerCard, draggedCard, playCard } = props;
  let displayBoard = [];
  // Render board
  for (let r = 0; r < 5; r++) {
    let row = [];
    for (let c = 0; c < 5; c++) {
      // Pushing spot into row
      if (r === 2 && c === 2) {
        row.push(<Spot pos={[r, c]} card={centerCard} key={`${r}, ${c}`} />);
      } else {
        row.push(
          <Spot pos={[r, c]} card={board[r][c]} key={`${r}, ${c}`} draggedCard={draggedCard} playCard={playCard} />
        );
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
      <table className="bg-green-600 border-separate border-spacing-4 h-screen w-9/12">
        <tbody>{displayBoard}</tbody>
      </table>
    </div>
  );
}
