import { NextRouter, useRouter } from "next/router";
import { useState } from "react";
import Logout from "@/app/data/logout";
import UserData from "@/app/data/user_data";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "@/styles/globals.css";
import "@/styles/styling.css";
import { IconButton } from "./IconButton";
import { Router } from "react-router-dom";
import Link from "next/link";
import toast from "react-hot-toast";
import useModal from "@/hooks/useModal";
import LeaderboardsModal from "@/components/LeaderboardsModal"

interface HeaderLogoProps {
  currentPath: string;
}

// export const HeaderLogo = ({ currentPath }: HeaderLogoProps) => {
//   return (
//     <div className="flex flex-1 items-center gap-2">
//       {currentPath === "/login" ? (
//         <div className="flex flex-1 items-center gap-2">
//           <Image
//             className="object-contain"
//             src="/main-logo.svg"
//             alt="Logo"
//             width={120}
//             height={88}
//           />
//           <p className="text-3xl font-pmarker text-timberwolf">Pongmington</p>
//         </div>
//       ) : (
//         <div className="flex flex-1 items-center gap-2">
//           <button
//             className="flex items-center gap-2"
//             onClick={() => router.push("/pong-main")}
//           >
//             <Image
//               className="object-contain"
//               src="/main-logo.svg"
//               alt="Logo"
//               width={120}
//               height={88}
//             />
//             {/* <img className="object-contain" src="/logo.png" alt="Logo" /> */}
//             <p className="text-3xl font-pmarker text-timberwolf">Pongmington</p>
//             {/* <img className="object-contain" src="/pongmington.png" alt="Pongminton"/> */}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

/* Version-2: Logo still clickable in login page, but will do nothing */
export const HeaderLogo = ({ currentPath }: HeaderLogoProps) => {
  return (
    <div className="flex flex-1 items-center">
      <Link
        className="flex items-center gap-2"
        // onClick={() => {
        //   if (currentPath !== "/login") router.push("/pong-main");
        // }}
        href={currentPath !== "/login" ? "/pong-main" : ""}
      >
        <Image
          className="object-contain"
          src="/main-logo.svg"
          alt="Logo"
          width={120}
          height={88}
        />
        {/* <img className="object-contain" src="/logo.png" alt="Logo" /> */}
        <p className="text-3xl font-pmarker text-timberwolf">Pongmington</p>
        {/* <img className="object-contain" src="/pongmington.png" alt="Pongminton"/> */}
      </Link>
    </div>
  );
};

export const HeaderIcon = () => {
  const router = useRouter();
  const [isLeaderboardOpen, openLeaderboardModal, closeLeaderboardModal, leaderboardRef] = useModal(false);
  // const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    console.log("loggingout");
    router.push("/login").then(() => {
      toast((t) => (
        <div className="flex flex-1 items-center justify-start border-saffron">
          <div className="flex flex-col items-center justify-center text-timberwolf">
            <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
          </div>
          <div className="mx-[10px] my-1">
            <p className="text-timberwolf font-roboto text-base">
              Logout successful
            </p>
          </div>
        </div>
      ));
    });
  };
  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/auth/logout", {
  //       credentials: "include",
  //     });
  //     console.log("logout response", response);
  //     router.push("/login");
  //   } catch (error) {
  //     setError("Error loggin out");
  //   }
  // };

  return (
    <>
      {/* crown icon */}
      <LeaderboardsModal
        isOpen={isLeaderboardOpen}
        closeModal={closeLeaderboardModal}
        accRef={leaderboardRef}
      />
      <IconButton onClick={() => openLeaderboardModal()}>
        <FontAwesomeIcon icon={faCrown} size="lg" />
      </IconButton>

      {/* profile avatar/name/mmr group */}
      <Link
        className="flex items-center space-x-2 group"
        /* HANDLE PROFILE CLICK BELOW! */
        href={"/profile"}
      >
        <Image
          width={100}
          height={100}
          className="w-9 h-9 rounded-full object-cover"
          /* UNCOMMENT BELOW WHEN BACKEND AVATAR IS READY */
          //   src={avatar}
          /* AND DELETE BELOW */
          src={
            "https://cdn.intra.42.fr/users/c7670c044d4b5cd2705483d2c1125c31/nfernand.jpg"
          }
          alt="user avatar"
        />
        {/* UNCOMMENT BELOW WHEN BACKEND NAME IS READY */}
        {/* <p className="icon-container">{username}</p> */}
        {/* AND DELETE BELOW */}
        <p className="font-xs text-dimgrey peer group-hover:text-timberwolf">
          {"name"}
        </p>
        <div className="flex items-center rounded-lg bg-dimgrey py-0 px-1 space-x-1 text-onyxgrey group-hover:bg-timberwolf">
          <FontAwesomeIcon icon={faTrophy} size="sm" />
          {/* UNCOMMENT BELOW WHEN BACKEND MMR IS READY */}
          {/* <span className="mmr-number">{stat.mmr}</span> */}
          {/* AND DELETE BELOW */}
          <span className="font-xs font-roboto">{100}</span>
        </div>
      </Link>

      {/* gear icon */}
      <Link href={"/settings"}>
        <IconButton>
          <FontAwesomeIcon icon={faGear} size="lg" />
        </IconButton>
      </Link>

      {/* logout icon */}
      <IconButton onClick={handleLogout}>
        <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
      </IconButton>
    </>
  );
};

const Header = () => {
  const router = useRouter();
  const currentPath = router.asPath;
  return (
    <nav className="flex mx-32 mt-5 mb-8 items-center gap-8">
      <HeaderLogo currentPath={currentPath} />
      {currentPath !== "/login" && <HeaderIcon />}
    </nav>
  );
};

export default Header;
