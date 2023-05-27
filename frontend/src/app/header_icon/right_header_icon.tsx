import Logout from "../data/logout";
import UserData from "../data/user_data";
import Crown from "./crown";
import Mmr from "./mmr";
import Setting from "./setting";
import Avartar from "./user_avatar";

const RightLogo = () => {
    const user = UserData();
    if (!user) {
        return <div>Loading...</div>;
    }
    const { avatar, id, intra_uid, username, online, p1_match, stat, userAchievement } = user;
    return (
        <div className="horizontal-container">
            <Crown/>
            <Avartar src={ avatar } alt="user avatar" width={25} height={25}/>
            <p>{ username }</p>
            <Mmr mmr={ stat?.mmr }/>
            <Setting/>
            <Logout/>
        </div>
    );
};

export default RightLogo;
