import UserData from "@/app/webhook/UserContext";
import React from "react";
import HeaderIcon from "../header_icon/HeaderIcon";
import Logo from "../header_icon/Logo";

const Header = () => {
  const router = useRouter();
  const currentPath = router.asPath;
  return (
    <header>
      <Logo />
      {showAdditionalIcon && <HeaderIcon />}
    </header>
  );
};

export default Header;
