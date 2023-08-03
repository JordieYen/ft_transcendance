import useGameStore from "@/store/useGameStore";

const PlayerOneScore = () => {
  const gameData = useGameStore((state) => state.gameData);

  return (
    <div>
      <p className="text-timberwolf text-3xl font-bold">{gameData.p1Score}</p>
    </div>
  );
};

const PlayerTwoScore = () => {
  const gameData = useGameStore((state) => state.gameData);

  return (
    <div>
      <p className="text-timberwolf text-3xl font-bold">{gameData.p2Score}</p>
    </div>
  );
};

const GameHeader = () => {
  return (
    <div className="flex h-[108px] pt-5 mb-5 items-center justify-center space-x-5">
      <PlayerOneScore />
      <p className="text-timberwolf text-2xl font-bold">:</p>
      <PlayerTwoScore />
    </div>
  );
};

export default GameHeader;
