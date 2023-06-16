import React, { useContext } from "react";
import Logout from "../../webhook/logout";
import UserData, { UserContext } from "../../webhook/UserContext";
import Avatar from "./Avatar";
import Icon from "./Icon";
import Mmr from "./Mmr";
import NextLink from "next/link";

const HeaderIcon = () => {
    const userData = UserData();
    if (!userData) {
        return <div>Loading...</div>;
    }
    const { avatar, username, stat } = userData;
    localStorage.setItem('userData', JSON.stringify(userData));
    return (
        <nav className="horizontal-container">
            <Icon filePath="/crown.png"/>
            <Avatar src={ avatar } alt="user avatar" width={40} height={40}/>
            <p className='icon-container transform hover:scale-125'>{ username }</p>
            <Mmr mmr={ stat?.mmr || 0 }/>
            <Icon filePath="/gear.png"/>
            <NextLink href="/friend">
                <Icon filePath="/user.png"/>
            </NextLink>
            <Logout/>
        </nav>
    );
};

export default HeaderIcon;
