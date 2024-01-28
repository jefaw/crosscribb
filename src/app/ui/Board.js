import Deck from "../lib/Deck";
import Card from "./Card";
import { initBoard } from "../lib/helpers";
export default function Board() {
  // let deck = new Deck();
  let board = initBoard();
  let displayBoard = [];

  for (let r = 0; r < 5; r++) {
    let row = [];
    for (let c = 0; c < 5; c++) {
      row.push(<td className="w-10 sm:w-32 h-16 sm:h-40 mx-10 mb-10 bg-stone-200 border-2 border-stone-700"></td>);
    }
    displayBoard.push(
      <tr className="" key={r}>
        {row}
      </tr>
    );
  }

  return (
    <div className="flex justify-center">
      <table className="bg-green-600 border-separate border-spacing-4">
        <tbody>{displayBoard}</tbody>
      </table>
    </div>
  );
}
