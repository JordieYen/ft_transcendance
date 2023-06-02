import React from "react";
import Logout from "../../webhook/logout";
import UserData from "../../webhook/user_data";
import Avatar from "./Avatar";
import Icon from "./Icon";
import Mmr from "./Mmr";

const HeaderIcon = () => {
    const userData = UserData();
    if (!userData) {
        return <div>Loading...</div>;
    }
    const { avatar, id, intra_uid, username, online, p1_match, stat, userAchievement } = userData;
    return (
        <nav className="horizontal-container">
            <Icon filePath="/crown.png"/>
            <Avatar src={ avatar } alt="user avatar" width={40} height={40}/>
            <p className='icon-container transform hover:scale-125'>{ username }</p>
            <Mmr mmr={ stat?.mmr || 0 }/>
            <Icon filePath="/gear.png"/>
            <Logout/>
        </nav>
    );
};

export default HeaderIcon;
