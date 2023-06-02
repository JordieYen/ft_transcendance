import Avatar from "../header_icon/Avatar";

function renderAchievement(achievementLength: number) {
    const achievements = [];
    const totalAchievement = 8;

    for (let i = 0; i < totalAchievement; i++) {
        const imageSource = i < achievementLength ? "/bracket.png" : "/blank.png";
        achievements.push(
         <Avatar key={i} src={imageSource} alt="user avatar" width={50} height={50} />
        );
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
