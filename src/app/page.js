import Image from "next/image";
import Board from "./ui/Board";

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-white italic text-4xl font-bold color p-10">Cross Cribs</h1>
      <Board />
    </div>
  );
}
