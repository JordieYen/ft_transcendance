import Logo from "../header_icon/logo";
import React from 'react';
import HeaderIcon from "../header_icon/header_icon";

interface HeaderProps {
  showAdditionalIcon: boolean;
}

const Header = ({ showAdditionalIcon }: HeaderProps) => {
  return (
    <header>
        <Logo/>
        { showAdditionalIcon && <HeaderIcon/>}
    </header>
  );
};

export default Header;
