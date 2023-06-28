import { UserData } from "@/store/useUserStore";
import axios from "axios";
import { RefObject, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

const LeaderboardSmash = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("match-history");
        const historyData = response.data;

        console.log("history", response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex w-full mt-4 space-x-4">
      {/* <p className="flex w-10 text-sm text-dimgrey justify-center">#</p>
      <p className="flex flex-1 text-sm text-dimgrey justify-start">name</p>
      <p className="flex w-24 text-sm text-dimgrey justify-end">smashes</p>
      <p className="flex w-36 text-sm text-dimgrey justify-end">Date</p> */}
    </div>
  );
};

const LeaderboardMMR = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("users");
        const userData = response.data;
        const sortedUsers = userData.sort(
          (a: any, b: any) => b.stat.current_mmr - a.stat.current_mmr,
        );

        setUsers(sortedUsers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {users.map((user: UserData, i) => {
        return (
          <div
            key={i}
            className={`flex h-12 space-x-4 items-center justify-center px-4 ${
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
            <p className="flex flex-1 text-sm text-timberwolf justify-start">
              {user.username}
            </p>
            <p className="flex w-20 text-sm text-timberwolf justify-end">
              {user.stat.current_mmr}
            </p>
            <p className="flex w-20 text-sm text-timberwolf justify-end">
              {user.stat.deaths === 0
                ? "inf"
                : user.stat.kills / user.stat.deaths}
            </p>
            <p className="flex w-20 text-sm text-timberwolf justify-end">
              {user.stat.smashes}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const LeaderboardTitle = () => {
  return (
    <div className="flex w-full space-x-10">
      <div className="flex flex-col w-full">
        <p className="text-2xl">Top player</p>
        <div className="flex my-4 space-x-4 px-4">
          <p className="flex w-10 text-sm text-dimgrey justify-center">#</p>
          <div className="flex w-10"></div>
          <p className="flex flex-1 text-sm text-dimgrey justify-start">name</p>
          <p className="flex w-20 text-sm text-dimgrey justify-end">MMR</p>
          <p className="flex w-20 text-sm text-dimgrey justify-end">K/DR</p>
          <p className="flex w-20 text-sm text-dimgrey justify-end">smashes</p>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <p className="text-2xl">Top smashes in a game</p>
        <div className="flex my-4 space-x-4 px-4">
          <p className="flex w-10 text-sm text-dimgrey justify-center">#</p>
          <div className="flex w-10"></div>
          <p className="flex flex-1 text-sm text-dimgrey justify-start">name</p>
          <p className="flex w-24 text-sm text-dimgrey justify-end">smashes</p>
          <p className="flex w-36 text-sm text-dimgrey justify-end">Date</p>
        </div>
      </div>
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
        <LeaderboardTitle />
        <div className="flex w-full space-x-10">
          <LeaderboardMMR />
          <LeaderboardSmash />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardsModal;
