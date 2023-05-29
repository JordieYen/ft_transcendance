import React from "react";
import Logout from "../data/logout";
import UserData from "../data/user_data";
import Crown from "./crown";
import Mmr from "./mmr";
import Setting from "./setting";
import Avartar from "./user_avatar";

const HeaderIcon = () => {
    const userData = UserData();
    if (!userData) {
        return <div>Loading...</div>;
    }
    const { avatar, id, intra_uid, username, online, p1_match, stat, userAchievement } = userData;
    return (
        <nav className="horizontal-container">
            <Crown/>
            <Avartar src={ avatar } alt="user avatar" width={25} height={25}/>
            <p className='icon-container'>{ username }</p>
            <Mmr mmr={ stat?.mmr }/>
            <Setting/>
            <Logout/>
        </nav>
    );
};

export default HeaderIcon;
