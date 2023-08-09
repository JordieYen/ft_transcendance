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
    <div className="w-screen h-full px-16 md:px-24 lg:px-32 flex-col space-y-4">
      <UserNameAchievement />
      <div className="flex space-x-8">
        <UserMatchHistory />
        <UserStats />
      </div>
    </div>
  );
};

export default UserProfile;
