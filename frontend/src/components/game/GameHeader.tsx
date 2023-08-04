import useGameStore from "@/store/useGameStore";

const PlayerOne = () => {
  const gameData = useGameStore((state) => state.gameData);

  return (
    <div className="flex space-x-12 items-center">
      {gameData.playerOne ? (
        <img
          width={100}
          height={100}
          className="w-[60px] h-[60px] rounded-full object-cover"
          src={gameData.playerOne.avatar}
          alt="p1 avatar"
        />
      ) : (
        <div className="w-[60px] h-[60px] rounded-full bg-jetblack" />
      )}

      <p className="text-timberwolf text-3xl font-bold">{gameData.p1Score}</p>
    </div>
  );
};

const PlayerTwo = () => {
  const gameData = useGameStore((state) => state.gameData);

  return (
    <div className="flex space-x-12 items-center">
      <p className="text-timberwolf text-3xl font-bold">{gameData.p2Score}</p>
      {gameData.playerTwo ? (
        <img
          width={100}
          height={100}
          className="w-[60px] h-[60px] rounded-full object-cover"
          src={gameData.playerTwo.avatar}
          alt="p2 avatar"
        />
      ) : (
        <div className="w-[60px] h-[60px] rounded-full bg-jetblack" />
      )}
    </div>
  );
};

const GameHeader = () => {
  return (
    <div className="flex h-[108px] pt-5 mb-5 items-center justify-center space-x-5">
      <PlayerOne />
      <p className="text-timberwolf text-2xl font-bold">:</p>
      <PlayerTwo />
    </div>
  );
};

export default GameHeader;
