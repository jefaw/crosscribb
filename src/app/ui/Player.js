

export default function Player(props) {

  // hand = props.hand
  const topCard = props.hand.pop();
  console.log(topCard)
  return (
    <div className="w-full h-20 bg-slate-500">
      <p className="text-center">{props.name}</p>
      <img src={topCard.imgSrc} alt="" />
      <p>Cards left: {props.hand.length +1}</p>
    </div>
  );
}
