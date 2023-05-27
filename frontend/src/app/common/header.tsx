import Logo from "../header_icon/logo";
import React from 'react';
import RightLogo from "../header_icon/right_header_icon";

const Header = ({ showAdditionalIcon }: { showAdditionalIcon: boolean }) => {
  
  return (
    <header>
        <Logo/>
        { showAdditionalIcon && <RightLogo />}
    </header>
  );
};

export default Header;
