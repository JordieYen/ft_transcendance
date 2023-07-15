import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import "@/styles/globals.css";
import "@/styles/styling.css";
import { IconButton } from "./IconButton";
import Link from "next/link";
import toast from "react-hot-toast";
import useUserStore, { UserData } from "@/store/useUserStore";
import NextLink from "next/link";
import Icon from "@/app/component/header_icon/Icon";
import { motion } from "framer-motion";
import useAnimateStore from "@/store/useAnimateStore";

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
        className="flex gap-2 items-center"
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
        <p className="hidden md:block text-3xl font-pmarker text-timberwolf">
          Pongmington
        </p>
        {/* <img className="object-contain" src="/pongmington.png" alt="Pongminton"/> */}
      </Link>
    </div>
  );
};

export const LogoutIcon = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        credentials: "include",
      });
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
    } catch (error) {
      toast.error("Error logging out! Try again later");
    }
  };
  return (
    <IconButton onClick={handleLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
    </IconButton>
  );
};

export const FriendsIcon = () => {
  return (
    <NextLink href="/friend">
      <IconButton>
        <FontAwesomeIcon icon={faUserGroup} size="lg" />
      </IconButton>
    </NextLink>
  );
};

export const SettingsIcon = () => {
  return (
    <Link href={"/settings"}>
      <IconButton>
        <FontAwesomeIcon icon={faGear} size="lg" />
      </IconButton>
    </Link>
  );
};

export const ProfileIconGroup = ({ user }: { user: UserData }) => {
  return (
    <Link
      className="flex items-center space-x-2 group"
      /* HANDLE PROFILE CLICK BELOW! */
      href={"/profile"}
    >
      <img
        width={100}
        height={100}
        className="w-9 h-9 rounded-full object-cover"
        src={user.avatar}
        alt="user avatar"
      />
      <p className="hidden lg:block text-dimgrey group-hover:text-timberwolf">
        {user.username}
      </p>
      <div className="flex items-center rounded-lg bg-dimgrey py-1 px-2 gap-1 text-onyxgrey group-hover:bg-timberwolf">
        <FontAwesomeIcon icon={faTrophy} size="sm" />
        <span className="text-onyxgrey font-roboto">
          {user.stat === null ? 0 : user?.stat?.current_mmr}
        </span>
      </div>
    </Link>
  );
};

export const LeaderboardsIcon = () => {
  return (
    <IconButton onClick={() => console.log("leaderboards")}>
      <FontAwesomeIcon icon={faCrown} size="lg" />
    </IconButton>
  );
};

export const HeaderIcon = () => {
  const userData = useUserStore((state) => state.userData);
  const setUserData = useUserStore((state) => state.setUserData);

  /**
   * useEffect is only required during the initial loading of the website or page,
   * where user data will be stored in useUserStore hook. To call specific user
   * data from other components, simply call useUserStore.
   * The square bracket (containing dependencies) is left empty since it's
   * only needed to be called once and doesn't depend on anything.
   */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/profile", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return null;
  }

  const {
    avatar,
    id,
    intra_uid,
    username,
    online,
    p1_match,
    stat,
    userAchievement,
  } = userData;

  return (
    <>
      <LeaderboardsIcon />
      <ProfileIconGroup user={userData} />
      <FriendsIcon />
      <SettingsIcon />
      <LogoutIcon />
    </>
  );
};

const Header = () => {
  const router = useRouter();
  const currentPath = router.asPath;
  const [currentStep, currentPage, setCurrentStep, setCurrentPage] =
    useAnimateStore((state) => [
      state.currentStep,
      state.currentPage,
      state.setCurrentStep,
      state.setCurrentPage,
    ]);
  return (
    <>
      {currentPath !== "/login" && currentPath !== "/setup" && (
        <motion.div
          initial={currentPage === "setup" ? { y: "100vh" } : { y: "0vh" }}
          animate={{ y: "0vh" }}
          transition={{ ease: "easeInOut", duration: 1.5 }}
          onAnimationComplete={
            currentPage === "setup" ? () => setCurrentPage("main") : undefined
          }
        >
          <nav className="flex mx-16 md:mx-24 lg:mx-32 mt-5 mb-8 items-center gap-8">
            <HeaderLogo currentPath={currentPath} />
            <HeaderIcon />
          </nav>
        </motion.div>
      )}
    </>
  );
};

export default Header;
