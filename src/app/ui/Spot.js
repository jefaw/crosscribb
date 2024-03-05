import { useState } from "react";
import EmptySpot from "./EmptySpot";
export default function Spot(props) {
  const { pos, card, draggedCard, playCard } = props;
  const [r, c] = pos;
  const [dragOver, setDragOver] = useState(false);

  // Function to handle the click on a table cell
  const handleCellClick = (row, col) => {
    // You can perform actions based on the clicked cell (row, col)
    console.log(`Clicked on cell (${row}, ${col})`);
  };

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    // setDragOver(true);
  }

  function handleDrop(e) {
    e.preventDefault();
    console.log("draggedCard = ", draggedCard);
    playCard(draggedCard, pos);
    // setDragOver(false);
    // playCard();
  }

  const cardSpotStyles =
    "w-1/5 h-1/5 mx-10 mb-10 bg-stone-200 border-2 border-stone-700 hover:bg-blue-300 transition duration-300 cursor-pointer";

  if (card) {
    return (
      <td className={cardSpotStyles} onClick={() => handleCellClick(r, c)}>
        <img className="" src={card.frontImgSrc} alt="" />
      </td>
    );
  }
  // Show placeholder if no card played
  return (
    <td
      className={cardSpotStyles}
      onClick={() => handleCellClick(r, c)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    ></td>
  );
}
