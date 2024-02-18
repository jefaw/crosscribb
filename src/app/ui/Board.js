'use client'

import { initBoard } from "../lib/helpers";
export default function Board() {
  // let deck = new Deck();
  let board = initBoard();
  let displayBoard = [];

  // Function to handle the click on a table cell
  const handleCellClick = (row, col) => {
    // You can perform actions based on the clicked cell (row, col)
    console.log(`Clicked on cell (${row}, ${col})`);
  };

  //loop to create rows
  for (let r = 0; r < 5; r++) {
    let row = [];

    // Loop to create columns within each row
    for (let c = 0; c < 5; c++) {
      
      // Pushing a table cell (td) with Tailwind CSS classes into the row
      row.push(<td 
        key={`${r}-${c}`} // Adding a unique key to each table cell
        className="w-10 sm:w-32 h-16 sm:h-40 mx-10 mb-10 bg-stone-200 border-2 border-stone-700 hover:bg-blue-300 transition duration-300 cursor-pointer"
        
        onClick={() => handleCellClick(r, c)}>

        </td>);
    }
     // Pushing a table row (tr) with the cells (td) into the displayBoard array
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
