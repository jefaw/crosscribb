/*
- Shows player's name
- Displays current top card
- Shows number of cards remaining
- Handles card selection and drag events
*/

export default function Player(props) {
  // hand = props.hand
  const { name, num, hand, turn } = props;

  //Get top card
  const card = hand.length > 0 ? hand[hand.length - 1] : false;
  const backImgSrc = `cards/backs/red2.svg`; // can be changed in future

  function handleDragStart(e) {
    e.dataTransfer.effectAllowed = "move"; // don't show plus icon on drag
  }

  const isActive = num === turn;
  const borderColor = num === 1 ? 'border-cyan-400' : 'border-fuchsia-400';
  const borderStyle = isActive ? `border-8 ${borderColor}` : 'border-2 border-stone-700';

  // Only show card if it's the player's turn
  const displayCard = isActive ? (
    <div className="flex flex-col items-center space-y-2">
      <img
        className="w-36 h-auto self-center hover:border-gray-700 border-transparent border-2 cursor-pointer rounded-lg shadow-lg transition-transform hover:scale-105"
        src={card.frontImgSrc}
        alt=""
        draggable={true}
        onDragStart={handleDragStart}
      />
      <p className="text-base font-medium text-gray-700">Cards left: {hand.length}</p>
    </div>
  ) : (
    <div className="flex flex-col items-center space-y-2">
      <img
        className="w-36 h-auto self-center rounded-lg shadow-lg"
        src={backImgSrc}
        alt=""
        draggable={false}
      />
      <p className="text-base font-medium text-gray-700">Cards left: {hand.length}</p>
    </div>
  );

  return (
    <>
      <div className={`flex flex-col justify-center bg-stone-300 m-8 py-6 px-4 rounded-lg ${borderStyle} transition-all duration-300`}>
        <h1 className="text-center text-xl font-bold mb-3 text-gray-800">{name}</h1>
        {card ? displayCard : null}
      </div>
    </>
  );
}
