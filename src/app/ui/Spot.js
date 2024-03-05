export default function Spot(props) {
  const { pos, card, selectedCard, playCard } = props;

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    playCard(pos);
  }

  const cardSpotStyles =
    "w-1/5 h-1/5 mx-10 mb-10 bg-stone-200 border-2 border-stone-700 hover:bg-blue-300 transition duration-300 cursor-pointer";

  if (card) {
    return (
      <td className={cardSpotStyles}>
        <img className="" src={card.frontImgSrc} alt="" />
      </td>
    );
  }
  // Show placeholder if no card played
  return (
    <td className={cardSpotStyles} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => playCard(pos)}></td>
  );
}
