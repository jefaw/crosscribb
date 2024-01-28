import Board from "./Board";
import Player from "./Player";

export default function Game(props) {
  return (
    <div>
      <Player name="BenDaBeast" />
      <Board />
      <Player name="Jeffaw" />
    </div>
  );
}
