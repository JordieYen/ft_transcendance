import useUserStore from "@/store/useUserStore";
import axios from "axios";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { formatDate } from "./UserProfile";
import "@/styles/globals.css";

const MatchHistory = ({ mode }: { mode: number }) => {
  const userData = useUserStore((state) => state.userData);
  const [isRender, setIsRender] = useState(false);
  const [userMatchHistory, setUserMatchHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("match-history", {
          withCredentials: true,
        });
        const totalMatchHistory = response.data;
        let sortedMatchHistory: any[] = [];
        for (const match of totalMatchHistory) {
          if (
            (match.p1 && match.p1.id === userData.id) ||
            (match.p2 && match.p2.id === userData.id)
          ) {
            sortedMatchHistory.push(match);
          }
        }
        setUserMatchHistory([...sortedMatchHistory].reverse());
        setIsRender(true);
      } catch (error) {
        console.log("error fetching match-history", error);
      }
    };
    fetchData();
  }, [userData]);

  return (
    <>
      {isRender && (
        <div className="w-full flex flex-col">
          {userMatchHistory.map((match: any, i) => {
            const isWinner = userData.id === match?.winner_uid;
            const gameDate = formatDate(new Date(match.date_of_creation), 2);

            const opponentUsername =
              userData.id === match?.p1?.id
                ? match?.p2?.username
                : match?.p1?.username;
            const playerScore =
              userData.id === match?.p1?.id ? match?.p1_score : match?.p2_score;
            const playerSmash =
              userData.id === match?.p1?.id
                ? match?.p1_smashes
                : match?.p2_smashes;
            const opponentScore =
              userData.id === match?.p1?.id ? match?.p2_score : match?.p1_score;
            const opponentSmash =
              userData.id === match?.p1?.id
                ? match?.p2_smashes
                : match?.p1_smashes;

            return (
              <div
                key={i}
                className={`flex h-20 items-center ${
                  i % 2 === 0 ? "rounded-2xl bg-jetblack" : ""
                }`}
              >
                <div className="w-6 h-full flex justify-start items-center">
                  <div
                    className={`w-2 h-6 ${isWinner ? "bg-green" : "bg-tomato"}`}
                  />
                </div>
                <p className="flex flex-1 text-timberwolf text-left">
                  {opponentUsername}
                </p>
                <p className="w-24 text-dimgrey text-sm text-center">
                  {gameDate}
                </p>
                <div
                  className={`flex justify-center items-center ${
                    ((mode === 0 || mode === 1) && "w-60") ||
                    (mode === 2 && "w-64") ||
                    (mode >= 3 && "w-72")
                  }`}
                >
                  <p className="text-3xl font-bold">{opponentScore}</p>
                  <div
                    className={`hidden md:flex flex-col ${
                      opponentScore < 10 ? "ml-5" : "ml-2"
                    }`}
                  >
                    <p className="text-dimgrey text-xs">smashes</p>
                    <p className="text-timberwolf text-right">
                      {opponentSmash}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex justify-center items-center ${
                    ((mode === 0 || mode === 1) && "w-60") ||
                    (mode === 2 && "w-64") ||
                    (mode >= 3 && "w-72")
                  }`}
                >
                  <div
                    className={`hidden md:flex flex-col ${
                      playerScore < 10 ? "mr-4" : "mr-1"
                    }`}
                  >
                    <p className="text-dimgrey text-xs">smashes</p>
                    <p className="text-timberwolf text-left">{playerSmash}</p>
                  </div>
                  <p className="text-3xl font-bold">{playerScore}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const MatchHistoryTitle = ({ mode }: { mode: number }) => {
  return (
    <div className="flex w-full pt-1 pb-2 pl-6">
      <p className="flex flex-1 text-dimgrey text-sm text-left">name</p>
      <p className="w-24 text-dimgrey text-sm text-center">date</p>
      <p
        className={`text-dimgrey text-sm text-center ${
          ((mode === 0 || mode === 1) && "w-60") ||
          (mode === 2 && "w-64") ||
          (mode >= 3 && "w-72")
        }`}
      >
        enemy stats
      </p>
      <p
        className={`text-dimgrey text-sm text-center ${
          ((mode === 0 || mode === 1) && "w-60") ||
          (mode === 2 && "w-64") ||
          (mode >= 3 && "w-72")
        }`}
      >
        your stats
      </p>
    </div>
  );
};

const UserMatchHistory = ({ mode }: { mode: number }) => {
  return (
    <div className="flex flex-col w-full h-full no-scrollbar">
      <MatchHistoryTitle mode={mode} />
      <div className="flex flex-col flex-1 w-full h-full pb-10 rounded-3xl overflow-y-scroll no-scrollbar">
        <MatchHistory mode={mode} />
      </div>
    </div>
  );
};

export default UserMatchHistory;
