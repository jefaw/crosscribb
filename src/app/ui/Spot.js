import CardPlayed from "./CardPlayed";
import EmptySpot from "./EmptySpot";
export default function Spot(props) {
  const { r, c, card } = props;

  // Function to handle the click on a table cell
  const handleCellClick = (row, col) => {
    // You can perform actions based on the clicked cell (row, col)
    console.log(`Clicked on cell (${row}, ${col})`);
  };

  const cardSpotStyles =
    "w-10 h-20 mx-10 mb-10 bg-stone-200 border-2 border-stone-700 hover:bg-blue-300 transition duration-300 cursor-pointer";

  if (card) {
    return (
      <td className={cardSpotStyles} onClick={() => handleCellClick(r, c)}>
        <img className="" src={card.imgSrc} alt="" />
      </td>
    );
  }
  // Show placeholder if no card played
  return <td className={cardSpotStyles} onClick={() => handleCellClick(r, c)}></td>;
}
