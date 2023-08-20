import useUserStore from "@/store/useUserStore";
import { useEffect, useRef, useState } from "react";
import "@/styles/globals.css";

const LifetimeKills = ({ mode }: { mode: number }) => {
  const userData = useUserStore((state) => state.userData);

  return (
    <div
      className={`${
        (mode === 0 && "w-[150px] h-[150px]") ||
        (mode === 1 && "w-[180px] h-[180px]") ||
        (mode === 2 && "w-[200px] h-[200px]") ||
        (mode >= 3 && "w-[220px] h-[220px]")
      } rounded-full border-[1px] border-timberwolf flex items-center justify-center`}
    >
      <div
        className={`${
          (mode === 0 && "w-[140px] h-[140px]") ||
          (mode === 1 && "w-[170px] h-[170px]") ||
          (mode === 2 && "w-[190px] h-[190px]") ||
          (mode >= 3 && "w-[210px] h-[210px]")
        } rounded-full border-[2px] border-timberwolf flex flex-col items-center justify-center`}
      >
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

const MatchmakingRating = ({ mode }: { mode: number }) => {
  const userData = useUserStore((state) => state.userData);

  return (
    <div
      className={`${
        (mode === 0 && "w-[150px] h-[150px]") ||
        (mode === 1 && "w-[180px] h-[180px]") ||
        (mode === 2 && "w-[200px] h-[200px]") ||
        (mode >= 3 && "w-[220px] h-[220px]")
      } rounded-full border-[1px] border-timberwolf flex items-center justify-center`}
    >
      <div
        className={`${
          (mode === 0 && "w-[140px] h-[140px]") ||
          (mode === 1 && "w-[170px] h-[170px]") ||
          (mode === 2 && "w-[190px] h-[190px]") ||
          (mode >= 3 && "w-[210px] h-[210px]")
        } rounded-full border-[2px] border-timberwolf flex flex-col items-center justify-center`}
      >
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

const UserStats = ({ mode }: { mode: number }) => {
  const userData = useUserStore((state) => state.userData);

  return (
    <div
      className={`bg-jetblack rounded-3xl items-center px-10 ${
        (mode === 0 && "flex w-full h-[180px] py-2") ||
        (mode === 1 && "flex flex-col w-[35%] h-full py-4") ||
        (mode === 2 && "flex flex-col w-[35%] h-full py-4") ||
        (mode >= 3 && "flex flex-col w-[35%] h-full py-12")
      } justify-between overflow-y-scroll no-scrollbar`}
    >
      <MatchmakingRating mode={mode} />
      <LifetimeKills mode={mode} />
      <div className={`flex ${mode === 0 && "flex-col"} space-x-20`}>
        <p className="text-timberwolf">Smash count</p>
        <p className="text-timberwolf">{userData.stat?.smashes}</p>
      </div>
    </div>
  );
};

export default UserStats;
