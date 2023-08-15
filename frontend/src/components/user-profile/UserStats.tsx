import useUserStore from "@/store/useUserStore";

const LifetimeKills = () => {
  const userData = useUserStore((state) => state.userData);

  return (
    <div className="w-[180px] h-[180px] rounded-full border-[1px] border-timberwolf flex items-center justify-center">
      <div className="w-[170px] h-[170px] rounded-full border-[2px] border-timberwolf flex flex-col items-center justify-center">
        <p className="w-full text-sm text-center">
          lifetime
          <br />
          kills
        </p>
        <p className="text-3xl font-bold my-1">{userData.stat?.kills}</p>
        <div className="flex">
          <p className="text-dimgrey text-sm">deaths&nbsp;</p>
          <p className="text-sm font-bold">{userData.stat?.deaths}</p>
        </div>
        <div className="flex">
          <p className="text-dimgrey text-sm">K/DR&nbsp;</p>
          <p className="text-sm font-bold">
            {userData.stat?.deaths === 0
              ? "inf"
              : (userData.stat?.kills / userData.stat?.deaths).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

const MatchmakingRating = () => {
  const userData = useUserStore((state) => state.userData);

  return (
    <div className="w-[180px] h-[180px] rounded-full border-[1px] border-timberwolf flex items-center justify-center">
      <div className="w-[170px] h-[170px] rounded-full border-[2px] border-timberwolf flex flex-col items-center justify-center">
        <p className="w-full text-sm text-center">
          matchmaking
          <br />
          rating
        </p>
        <p className="text-3xl font-bold my-1">{userData.stat?.current_mmr}</p>
        <div className="flex">
          <p className="text-dimgrey text-sm">highest&nbsp;</p>
          <p className="text-sm font-bold">{userData.stat?.best_mmr}</p>
        </div>
      </div>
    </div>
  );
};

const UserStats = () => {
  const userData = useUserStore((state) => state.userData);
  return (
    <div className="hidden xl:flex lg:flex-1 lg:flex-col h-full bg-jetblack rounded-3xl items-center py-4 space-y-4">
      <MatchmakingRating />
      <LifetimeKills />
      <div className="flex space-x-20">
        <p className="text-timberwolf">Smash count</p>
        <p className="text-timberwolf">{userData.stat?.smashes}</p>
      </div>
    </div>
  );
};

export default UserStats;
