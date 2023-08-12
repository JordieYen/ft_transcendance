import { useEffect, useRef, useState } from "react";
import UserMatchHistory from "./UserMatchHistory";
import UserNameAchievement from "./UserNameAchievement";
import UserStats from "./UserStats";

export function formatDate(date: Date, style: number): string {
  const monthFormat = style === 1 ? "long" : "numeric";
  return date.toLocaleDateString("en-MY", {
    day: "numeric",
    month: monthFormat,
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  });
}

const UserProfile = () => {
  const userProfileRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState(0);

  useEffect(() => {
    if (userProfileRef && userProfileRef.current) {
      const parentDiv = userProfileRef.current;
      if (parentDiv) {
        const width = parentDiv.clientWidth;
        const height = parentDiv.clientHeight;
        console.log("height", height);
        if (height <= 900) {
          setMode(1);
        } else if (height > 900 && height <= 1080) {
          setMode(2);
        } else {
          setMode(3);
        }
      }
    }
  }, [userProfileRef]);

  return (
    <div
      ref={userProfileRef}
      className={`w-screen h-screen absolute top-0 left-0 ${
        (mode === 1 && "") ||
        (mode === 2 && "px-20 py-10") ||
        (mode === 3 && "px-40 py-40")
      }`}
    >
      <div className="flex w-full h-full px-16 pt-[128px] pb-10 md:px-24 lg:px-32 flex-col space-y-4">
        <UserNameAchievement mode={mode} />
        <div className="flex flex-1 h-full space-x-8 overflow-hidden">
          <div className="flex flex-col h-full w-full xl:w-[65%]">
            <UserMatchHistory mode={mode} />
          </div>
          <UserStats />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
