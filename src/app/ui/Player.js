

export default function Player(props) {

  // hand = props.hand
  const topCard = props.hand.pop();
  console.log(topCard)
  return (
      <>
        <div className="flex flex-col justify-center bg-orange-600 m-10 py-5">
          <h1 className="text-center text-2xl ">{props.name}</h1>
          <img className="w-1/2 h-auto self-center"src={topCard.imgSrc} alt="" />
          <p className="self-center"> Cards left: {props.hand.length +1}</p>
        </div>
        
      </>
  );
}
