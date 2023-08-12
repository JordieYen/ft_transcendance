import { useRef } from "react";
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
  return (
    <div className="flex w-screen h-screen absolute top-0 left-0 px-16 pt-[128px] pb-10 md:px-24 lg:px-32 flex-col space-y-4">
      <UserNameAchievement />
      <div className="flex flex-1 h-full space-x-8 overflow-hidden">
        <div className="flex flex-col h-full w-full xl:w-[65%]">
          <UserMatchHistory />
        </div>
        <UserStats />
      </div>
    </div>
  );
};

export default UserProfile;
