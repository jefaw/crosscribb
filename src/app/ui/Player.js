export default function Player(props) {
  // hand = props.hand
  const { name, hand } = props;

  //Get top card
  const card = hand.length > 0 ? hand[hand.length - 1] : false;

  const displayCard = (
    <>
      <img className="w-1/4 h-auto self-center hover:border-gray-700 border-transparent border-2 cursor-pointer" src={card.imgSrc} alt="" />
      <p className="self-center"> Cards left: {hand.length + 1}</p>
    </>
  );

  return (
    <>
      <div className="flex flex-col justify-center bg-orange-600 m-10 py-5">
        <h1 className="text-center text-2xl ">{name}</h1>
        {card && displayCard}
      </div>
    </>
  );
}
