import useUserStore, { UserData } from "@/store/useUserStore";
import axios from "axios";
import { RefObject, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

const Leaderboards = ({ sortBy }: { sortBy: string }) => {
  const userData = useUserStore((state) => state.userData);
  const [users, setUsers] = useState<any[]>([]);

  /**
   * Sorting function that sorts the array differently based on given condition
   * 1. sort by MMR
   * 2. sort by Smashes
   */
  const sorting = (userData: any[]) => {
    let sortedUsers;
    if (sortBy === "MMR") {
      sortedUsers = userData.sort(
        (a: any, b: any) => b.stat.current_mmr - a.stat.current_mmr,
      );
    } else {
      sortedUsers = userData.sort(
        (a: any, b: any) => b.stat.smashes - a.stat.smashes,
      );
    }

    return sortedUsers;
  };

  /**
   * The useEffect hook is called after the initial render of the component and
   * runs the provided callback function. The second argument ([]) is an empty
   * array, indicating that the effect should only run once.
   *
   * Axios is used to make an HTTP GET request to the "users" endpoint, fetching
   * users data and its stats
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("users");
        const userData = response.data;

        setUsers(sorting(userData));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  /**
   * In React's useState hook, the setState function will perform a shallow
   * comparison to determine whether the new state value is different from the
   * current state value. It checks for referential equality, meaning it
   * compares the object references rather than deeply comparing the contents
   * of the objects.
   *
   * If an array as the state object is sorted differently, the object reference
   * will remain the same, and React's setState will consider it to be the same
   * object, thus not triggering a re-render.
   *
   * To work around this issue, a new copy of the array must be created using
   * [...myArray] before sorting it and then pass the new array to setState.
   */
  useEffect(() => {
    setUsers(sorting([...users]));
  }, [sortBy]);

  return (
    <div className="flex flex-col w-full">
      {users.map((user: UserData, i) => {
        return (
          <div
            key={i}
            className={`flex h-14 space-x-4 items-center justify-center px-4 ${
              i % 2 === 0 ? "rounded-lg bg-jetblack" : ""
            }`}
          >
            <p className="flex w-10 text-sm text-timberwolf justify-center">
              {i === 0 ? <FontAwesomeIcon icon={faCrown} size="lg" /> : i + 1}
            </p>
            <div className="w-10 justify-center items-center">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={user.avatar}
                alt="user_avatar"
              />
            </div>
            <p
              className={`flex ${
                user.username !== userData.username && "flex-1"
              } text-sm text-timberwolf justify-start`}
            >
              {user.username}
            </p>
            {user.username === userData.username && (
              <div className="flex flex-1">
                <p className="px-1 bg-saffron rounded-full text-xs font-bold text-jetblack">
                  You
                </p>
              </div>
            )}
            <div className="flex flex-col w-32">
              <p className="flex w-full text-timberwolf justify-end">
                {user.stat.current_mmr}
              </p>
              <p className="flex w-full text-xs text-dimgrey justify-end">
                {user.stat.best_mmr}
              </p>
            </div>
            <div className="flex flex-col w-32">
              <p className="flex w-full text-timberwolf justify-end">
                {user.stat.losses === 0
                  ? "inf"
                  : (
                      (user.stat.wins / (user.stat.wins + user.stat.losses)) *
                      100
                    ).toFixed(1) + "%"}
              </p>
              <p className="flex w-full text-xs text-dimgrey justify-end">
                {user.stat.win_streak}
              </p>
            </div>
            <p className="flex w-28 text-timberwolf items-center justify-end">
              {user.stat.deaths === 0
                ? "inf"
                : user.stat.kills / user.stat.deaths}
            </p>
            <p className="flex w-28 text-timberwolf items-center justify-end">
              {user.stat.smashes}
            </p>
            <p className="flex w-36 text-timberwolf items-center justify-end">
              We doing this?
            </p>
          </div>
        );
      })}
    </div>
  );
};

const LeaderboardTitle = () => {
  return (
    <div className="flex my-4 space-x-4 px-4">
      <p className="flex w-10 text-sm text-dimgrey items-center justify-center">
        #
      </p>
      <div className="flex w-10"></div>
      <p className="flex flex-1 text-sm text-dimgrey items-center justify-start">
        name
      </p>
      <div className="flex flex-col w-32">
        <p className="flex w-full text-sm text-dimgrey justify-end">MMR</p>
        <p className="flex w-full text-xs text-dimgrey justify-end">highest</p>
      </div>
      <div className="flex flex-col w-32">
        <p className="flex w-full text-sm text-dimgrey justify-end">winrate</p>
        <p className="flex w-full text-xs text-dimgrey justify-end">streak</p>
      </div>
      <p className="flex w-28 text-sm text-dimgrey items-center justify-end">
        K/DR
      </p>
      <p className="flex w-28 text-sm text-dimgrey items-center justify-end">
        smashes
      </p>
      <p className="flex w-36 text-sm text-dimgrey items-center justify-end">
        last match
      </p>
    </div>
  );
};

interface LeaderboardsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  lbRef: RefObject<HTMLDivElement>;
}

const LeaderboardsModal = ({
  isOpen,
  closeModal,
  lbRef,
}: LeaderboardsModalProps) => {
  const [sortBy, setSortBy] = useState("MMR");

  const handleClick = (str: string) => {
    if (sortBy !== str) setSortBy(str);
  };

  return (
    <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0 left-0">
      <div
        className="overlay-content w-10/12 h-5/6 bg-onyxgrey rounded-2xl p-8"
        ref={lbRef}
      >
        <h2>
          <p className="flex text-4xl text-timberwolf mb-8">
            All time leaderboard
          </p>
        </h2>
        <div className="flex w-full h-10">
          <p className="flex flex-1 text-2xl">Top player</p>
          <div className="flex space-x-4">
            <button
              className={`flex w-40 h-full rounded-lg border-2 border-saffron ${
                sortBy === "MMR" ? "bg-saffron" : ""
              } items-center justify-center`}
              onClick={() => handleClick("MMR")}
            >
              <p
                className={`${
                  sortBy === "MMR" ? "text-jetblack" : "text-timberwolf"
                }`}
              >
                MMR
              </p>
            </button>
            <button
              className={`flex w-40 h-full rounded-lg border-2 border-saffron ${
                sortBy === "Smashes" ? "bg-saffron" : ""
              } items-center justify-center`}
              onClick={() => handleClick("Smashes")}
            >
              <p
                className={`${
                  sortBy === "Smashes" ? "text-jetblack" : "text-timberwolf"
                }`}
              >
                Smashes
              </p>
            </button>
          </div>
        </div>
        <LeaderboardTitle />
        <div className="flex w-full space-x-10">
          <Leaderboards sortBy={sortBy} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardsModal;
