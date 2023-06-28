import UserData from "@/app/webhook/UserContext";
import React from "react";
import HeaderIcon from "../header_icon/HeaderIcon";
import Logo from "../header_icon/Logo";

interface HeaderProps {
  showAdditionalIcon: boolean;
}

const Header = ({ showAdditionalIcon }: HeaderProps) => {
  return (
    <header>
      <Logo />
      {showAdditionalIcon && <HeaderIcon />}
    </header>
  );
};

export default Header;
