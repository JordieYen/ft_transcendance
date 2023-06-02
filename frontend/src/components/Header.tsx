import { useRouter } from "next/router";
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
import Logo from "@/app/header_icon/logo";

export const HeaderLogo = () => {
  return (
    <div className="flex flex-1 items-center gap-2">
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
    </div>
  );
};

export const HeaderIcon = () => {
  const router = useRouter();
  // const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    console.log("loggingout");
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
      <IconButton onClick={() => router.push("/leaderboards")}>
        <FontAwesomeIcon icon={faCrown} size="lg" />
      </IconButton>

      {/* profile avatar/name/mmr group */}
      <button
        className="flex items-center space-x-2 group"
        /* HANDLE PROFILE CLICK BELOW! */
        onClick={() => console.log("Header profile clicked")}
      >
        <Image
          width={36}
          height={36}
          style={{ borderRadius: "50%" }}
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
      </button>

      {/* gear icon */}
      <IconButton onClick={() => router.push("/settings")}>
        <FontAwesomeIcon icon={faGear} size="lg" />
      </IconButton>

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
      <HeaderLogo />
      {currentPath !== "/login" && <HeaderIcon />}
    </nav>
  );
};

export default Header;
