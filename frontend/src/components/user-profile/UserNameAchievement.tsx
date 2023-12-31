import useUserStore from "@/store/useUserStore";
import { formatDate } from "./UserProfile";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import "@/styles/globals.css";

const RenderAchievementIcon = ({
  achv,
  achvImage,
}: {
  achv: any;
  achvImage: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-[50px] h-[50px] relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        width={50}
        height={50}
        className="w-[50px] h-[50px] rounded-full object-cover"
        src={achvImage}
        alt="user_achv"
      />
      <div
        className={`${
          isHovered ? "block" : "hidden"
        } flex flex-col absolute bottom-[120%] left-[50%] -translate-x-1/2 w-[290px] bg-dimgrey rounded-3xl px-6 py-4 space-y-1 z-20`}
      >
        <p>{achv.achievement.name}</p>
        <p className="text-sm">{achv.achievement.description}</p>
        <p className="text-xs text-onyxgrey">
          Achieved {formatDate(new Date(achv.createdAt), 2)}
        </p>
      </div>
    </div>
  );
};

const UserAchievement = ({ mode }: { mode: number }) => {
  const userData = useUserStore((state) => state.userData);
  const [userAchv, setUserAchv] = useState<any[]>([]);
  const oopsPath =
    "M288 48C173.1 48 80 141.1 80 256C80 261.7 80.23 267.4 80.68 272.1L80.01 272.1C68.39 256.5 48.28 252.2 32.02 259.3C32.01 258.2 32 257.1 32 256C32 114.6 146.6 0 288 0C429.4 0 544 114.6 544 256C544 397.4 429.4 512 288 512C213.5 512 146.4 480.2 99.62 429.3C112.6 418.5 122.1 403.7 126 386.5C164.2 433.8 222.6 464 288 464C402.9 464 496 370.9 496 256C496 141.1 402.9 48 288 48L288 48zM35.66 299.4C37.84 296.3 39.86 293.6 41.6 291.3C44.8 286.9 51.2 286.9 54.4 291.3C67.57 308.6 96 349 96 369C96 383.2 89.58 395.9 79.45 404.5C71.02 411.7 60.02 416 48 416C21.54 416 0 395 0 369C0 351.7 21.44 319.1 35.66 299.4H35.66zM360.4 409.5C350.7 418.6 335.5 418.1 326.5 408.4C319.1 400.5 306.4 392 288 392C269.6 392 256.9 400.5 249.5 408.4C240.5 418.1 225.3 418.6 215.6 409.5C205.9 400.5 205.4 385.3 214.5 375.6C228.7 360.3 253.4 344 288 344C322.6 344 347.3 360.3 361.5 375.6C370.6 385.3 370.1 400.5 360.4 409.5zM367.6 304C349.1 304 335.6 289.7 335.6 272C335.6 254.3 349.1 240 367.6 240C385.3 240 399.6 254.3 399.6 272C399.6 289.7 385.3 304 367.6 304zM207.6 240C225.3 240 239.6 254.3 239.6 272C239.6 289.7 225.3 304 207.6 304C189.1 304 175.6 289.7 175.6 272C175.6 254.3 189.1 240 207.6 240zM219.9 178.7C196.4 202.3 166 217.9 133.1 223.4L130.6 223.8C121.9 225.2 113.7 219.3 112.2 210.6C110.8 201.9 116.7 193.7 125.4 192.2L127.9 191.8C154.2 187.4 178.5 174.9 197.3 156.1L204.7 148.7C210.9 142.4 221.1 142.4 227.3 148.7C233.6 154.9 233.6 165.1 227.3 171.3L219.9 178.7zM371.3 148.7L378.7 156.1C397.5 174.9 421.8 187.4 448.2 191.8L450.6 192.2C459.3 193.7 465.2 201.9 463.8 210.6C462.3 219.3 454.1 225.2 445.4 223.8L442.9 223.4C409.1 217.9 379.6 202.3 356.1 178.7L348.7 171.3C342.4 165.1 342.4 154.9 348.7 148.7C354.9 142.4 365.1 142.4 371.3 148.7z";

  useEffect(() => {
    const fetchAchvData = async () => {
      try {
        const response = await axios.get(
          `User-achievement/player?id=${userData.id}`,
          {
            withCredentials: true,
          },
        );
        setUserAchv(response.data);
      } catch (error) {
        console.log("error user achievement", error);
      }
    };
    fetchAchvData();
  }, [userData]);

  function getAchvImage(name: string) {
    switch (name) {
      case "Im secured":
        return "/achievement/Im_secured.png";
      case "Lee Zii Jia":
        return "/achievement/Lee_Zii_Jia.png";
      case "Bloodthirsty":
        return "/achievement/Bloodthirsty.png";
      case "Merciless":
        return "/achievement/Merciless.png";
      case "Ruthless":
        return "/achievement/Ruthless.png";
      case "Relentless":
        return "/achievement/Relentless.png";
      case "Brutal":
        return "/achievement/Brutal.png";
      case "Nuclear":
        return "/achievement/Nuclear.png";
      case "Unstoppable":
        return "/achievement/Unstoppable.png";
      case "Kill Chain":
        return "/achievement/Kill_Chain.png";
      default:
        return "/blank.png";
    }
  }

  return (
    <div
      className={`flex ${
        (mode === 0 && "w-full") ||
        ((mode === 1 || mode === 2) && "w-[300px]") ||
        (mode >= 3 && "w-[350px]")
      } h-full py-1`}
    >
      {userAchv.length !== 0 ? (
        <div
          className={`h-full flex xs:flex-col sm:flex-row md:flex-row xl:flex-col ${
            mode <= 2 ? "space-x-3" : "space-x-[25px]"
          } xl:space-x-0 space-y-1`}
        >
          <div
            className={`w-full h-1/2 flex ${
              mode <= 2 ? "space-x-3" : "space-x-[25px]"
            }`}
          >
            {userAchv.slice(0, 5).map((achv: any, i) => {
              const achvImage = getAchvImage(achv.achievement.name);
              return (
                <RenderAchievementIcon
                  key={i}
                  achv={achv}
                  achvImage={achvImage}
                />
              );
            })}
          </div>
          <div
            className={`w-full h-1/2 flex space-x-3 ${
              mode <= 2 ? "space-x-3" : "space-x-[25px]"
            }`}
          >
            {userAchv.slice(5, 10).map((achv: any, i) => {
              const achvImage = getAchvImage(achv.achievement.name);
              return (
                <RenderAchievementIcon
                  achv={achv}
                  achvImage={achvImage}
                  key={i}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-1">
          <svg
            className="w-8 h-8 fill-dimgrey"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path d={oopsPath} />
          </svg>
          <p className="text-dimgrey text-xs">No achievements earned!</p>
        </div>
      )}
    </div>
  );
};

const LifetimeScore = ({ mode }: { mode: number }) => {
  const userData = useUserStore((state) => state.userData);

  return (
    <div
      className={`flex flex-1 w-full h-full items-center justify-between ${
        mode >= 3 && "px-10"
      }`}
    >
      <div className="flex flex-col w-1/3">
        <p className="text-xs">lifetime games</p>
        <p className="text-timberwolf text-4xl">
          {userData.stat?.wins + userData.stat?.losses}
        </p>
      </div>
      <div className="flex flex-col w-1/3">
        <p className="text-xs">lifetime wins</p>
        <p className="text-timberwolf text-4xl">{userData.stat?.wins}</p>
      </div>
      <div className="flex flex-col w-1/3">
        <p className="text-xs">longest win streak</p>
        <p className="text-timberwolf text-4xl">{userData.stat?.win_streak}</p>
      </div>
    </div>
  );
};

const UserName = () => {
  const userData = useUserStore((state) => state.userData);

  return (
    <div className="flex w-full lg:w-[210px] space-x-3 items-center">
      <div className="flex lg:flex-1 flex-col">
        <p className="text-timberwolf text-3xl font-semibold">
          {userData.username}
        </p>
        <p className="hidden lg:flex text-dimgrey text-sm">
          Joined {formatDate(new Date(userData.createdAt), 1)}
        </p>
      </div>
    </div>
  );
};

const UserAvatar = () => {
  const userData = useUserStore((state) => state.userData);

  return (
    <img
      width={100}
      height={100}
      className="hidden sm:flex w-[80px] h-[80px] rounded-full object-cover"
      src={userData.avatar}
      alt="user avatar"
    />
  );
};

const UserNameAchievement = ({ mode }: { mode: number }) => {
  return (
    <div
      className={`flex w-full bg-jetblack items-center ${
        ((mode === 0 || mode === 1) && "h-fit px-5 py-2") ||
        (mode === 2 && "h-[148px] px-10 py-4") ||
        (mode === 3 && "h-[164px] px-16 py-6") ||
        (mode === 4 && "h-[196px] px-32 py-10")
      } rounded-3xl`}
    >
      <UserAvatar />
      <div className="flex flex-1 w-full h-full flex-col xl:flex-row mx-4 space-y-1 items-center justify-start">
        <div className="flex flex-1 flex-col lg:flex-row w-full h-full items-center">
          <UserName />
          <div className="hidden lg:block lg:h-[80%] lg:w-[3px] mx-4 rounded-full bg-dimgrey" />
          <LifetimeScore mode={mode} />
        </div>
        <div className="hidden xl:block xl:h-[80%] xl:w-[3px] mx-4 rounded-full bg-dimgrey" />
        <UserAchievement mode={mode} />
      </div>
    </div>
  );
};

export default UserNameAchievement;
