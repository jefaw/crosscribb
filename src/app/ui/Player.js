export default function Player(props) {
  // hand = props.hand
  const { name, hand } = props;

  //Get top card
  const card = hand.length > 0 ? hand[hand.length - 1] : false;
  const backImgSrc = `cards/backs/red2.svg`; // can be changed in future

  function handleDragStart(e) {
    e.dataTransfer.effectAllowed = "move"; // don't show plus icon on drag
  }

  const displayCard = (
    <>
      <img
        className="w-1/5 h-auto self-center hover:border-gray-700 border-transparent border-2 cursor-pointer"
        src={card.frontImgSrc}
        alt=""
      />
      <p className="self-center"> Cards left: {hand.length}</p>
    </>
  );

  const displayCardBack = (
    <img
      className="w-1/5 h-auto self-center hover:border-gray-700 border-transparent border-2 cursor-pointer"
      src={backImgSrc}
      alt=""
    />
  );

  return (
    <>
      <div className="flex flex-col justify-center bg-stone-300 m-10 py-5" onDragStart={handleDragStart}>
        <h1 className="text-center text-2xl ">{name}</h1>
        {card ? displayCard : displayCardBack}
      </div>
    </>
  );
}
