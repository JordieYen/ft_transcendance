import React from "react";
import Logout from "../../data/logout";
import UserData from "../../data/user_data";
import Crown from "./crown";
import Icon from "./icon";
import Mmr from "./mmr";
import Setting from "./setting";
import Avatar from "./user_avatar";

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
            <p className='icon-container'>{ username }</p>
            <Mmr mmr={ stat?.mmr || 0 }/>
            <Icon filePath="/gear.png"/>
            <Logout/>
        </nav>
    );
};

export default HeaderIcon;
