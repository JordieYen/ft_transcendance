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
    const updateParentDimensions = () => {
      const parentDiv = userProfileRef.current;
      if (parentDiv) {
        const width = parentDiv.clientWidth;
        const height = parentDiv.clientHeight;
        if (width < 1280) {
          setMode(0);
        } else if (
          (width >= 1280 && width < 1440) ||
          (width < 1540 && height < 800)
        ) {
          setMode(1);
        } else if (width >= 1440 && width < 1920) {
          setMode(2);
        } else if (width >= 1920 && width < 1440) {
          setMode(3);
        } else {
          setMode(4);
        }
      }
    };

    // Initial dimensions setup
    updateParentDimensions();

    // Add event listener for window resize
    window.addEventListener("resize", updateParentDimensions);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateParentDimensions);
    };
  }, []);

  return (
    <div
      ref={userProfileRef}
      className={`w-screen h-screen absolute top-0 left-0 ${
        (mode === 1 && "") ||
        (mode === 2 && "px-10") ||
        (mode >= 3 && "px-32 py-16") ||
        (mode === 4 && "px-48 py-28")
      }`}
    >
      <div className="flex w-full h-full px-16 pt-[128px] pb-10 md:px-24 lg:px-32 flex-col space-y-4">
        <UserNameAchievement mode={mode} />
        {mode === 0 ? (
          <>
            <div>
              <UserStats mode={mode} />
            </div>
            <div className="flex flex-col h-full space-x-8 overflow-hidden">
              <UserMatchHistory mode={mode} />
            </div>
          </>
        ) : (
          <div className="flex flex-1 h-full space-x-8 overflow-hidden">
            <div className="flex flex-col h-full w-full xl:w-[65%]">
              <UserMatchHistory mode={mode} />
            </div>
            <UserStats mode={mode} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
