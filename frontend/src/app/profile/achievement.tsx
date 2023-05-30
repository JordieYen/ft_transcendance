import { render } from "react-dom";
import Avatar from "../header_icon/user_avatar";

// write a renderAchievemnt funtion that take in achievement length and then based on the length,
// render the bracket.png and fill the remaining achievement with blank.png. there is total only 8 achievements
// so if the achievement length is 5, then render 5 bracket.png and 3 blank.png.
//
// then in the achievement.tsx, import the renderAchievement function and pass in the achievement.length
// as the argument. then render the achievement component in the profile.tsx
function renderAchievement(achievementLength: number) {
    const achievements = [];
    const totalAchievement = 8;

    for (let i = 0; i < totalAchievement; i++) {
        const imageSource = i < achievementLength ? "/bracket.png" : "/blank.png";
        achievements.push(<Avatar src={imageSource} alt="user avatar" width={50} height={50} />);
    }
    return achievements;
}

const Achievement: React.FC<any> = ({ achievement }) => {
    const renderAvartar = renderAchievement(achievement.length);    
    
    return (
        <div className='achievement-section'>
            <div className='avatar-row'>
            {renderAvartar.splice(0, 4)}
            </div>
            <div className='avatar-row'>
                {renderAvartar.splice(0, 4)}    
            </div>
        </div>
    )
}

export default Achievement;
