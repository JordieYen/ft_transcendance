import React from "react";
import { useRouter } from "next/router";
// import Logo from "../header_icon/logo";
import HeaderLogo from "@/components/Header";
// import HeaderIcon from "../header_icon/header_icon";
import HeaderIcon from "@/components/Header";

const Header = () => {
  const router = useRouter();
  const currentPath = router.asPath;
  return (
    <header>
      <HeaderLogo />
      {currentPath !== "/login" && <HeaderIcon />}
    </header>
  );
};

export default Header;
