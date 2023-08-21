import Avatar from "../header_icon/Avatar";
import { Tooltip } from 'react-tooltip'


function getAchievementImage(achievementName: string) {
    switch (achievementName) {
        case "Im secured":
            return "/achievement/Im_secured.png";
        case "Lee Zii Jia":
            return "/achievement/Lee_Zii_Jia.png";
        case "Bloodthirsty":
            return "/achievement/Bloodthirsty.png";
        case "Merciless":
            return "/achievement/Merciless.png";
        case "Ruthless":
            return "/achievement/Ruthless.png";
        case "Relentless":
            return "/achievement/Relentless.png";
        case "Brutal":
            return "/achievement/Brutal.png";
        case "Nuclear":
            return "/achievement/Nuclear.png";
        case "Unstoppable":
            return "/achievement/Unstoppable.png";
        case "Kill Chain":
            return "/achievement/Kill_Chain.png";
        default:
            return "/blank.png";
    }
}


function renderUserAchievement(achievement: any) {
    const achievements = [];
    const totalAchievement = 10;
    
    for (let i = 0; i < totalAchievement; i++) {
        let imageSource = "/blank.png"
        let achievementName = "";
        let achievementDescription = "";
        if (i < achievement.length) {
            achievementName = achievement[i]?.achievement.name;
            achievementDescription = achievement[i]?.achievement.description;
            imageSource = getAchievementImage(achievementName);
        } 
        // else {
        //     achievementName = "";
        //     achievementDescription = "";
        //     imageSource = "/blank.png"

        // }
        achievements.push({
            id: `tooltip-${i}`,
            imageSource,
            achievementName,
            achievementDescription
        });
    }
    return achievements;
}

const Achievement: React.FC<any> = ({ achievement }) => {
    const renderAvartar = renderUserAchievement(achievement);    
    // console.log(renderAvartar);
    return (
        renderAvartar && (
            <div className='achievement-section'>
                <div className='avatar-row'>
                {renderAvartar.slice(0, 5).map((achievement, index, tooltip) => (
                    <span key={index}
                        // data-tooltip-id={`tooltip-${index}`}
                        data-tooltip-id={achievement?.id}
                        data-tooltip-place="top"
                        >
                            {achievement.achievementName && achievement.achievementDescription && (
                            <Tooltip id={achievement.id}>
                            <span className="tooltip-name text-myyellow font-bold">{achievement?.achievementName}</span>: {achievement?.achievementDescription}
                            </Tooltip>
                        )}
                        <Avatar
                            key={index}
                            src={achievement?.imageSource}
                            alt={achievement?.achievementName}
                            width={50}
                            height={50}
                        />
                    </span>
                    ))
                }
                </div>
                <div className='avatar-row'>
                {renderAvartar.slice(5).map((achievement, index) => (
                    <span
                        key={index}
                        // data-tooltip-id={`tooltip-${index}`}
                        data-tooltip-id={achievement.id}
                        data-tooltip-place="top"
                    >
                     {achievement.achievementName && achievement.achievementDescription && (
                            <Tooltip id={achievement.id}>
                            <span className="tooltip-name text-myyellow font-bold">{achievement?.achievementName}</span>: {achievement?.achievementDescription}
                            </Tooltip>
                        )}
                        <Avatar
                            key={index}
                            src={achievement?.imageSource}
                            alt={achievement?.achievementName}
                            width={50}
                            height={50}
                        />
                    </span>
                ))}
                </div>
            </div>
        )
    )
}

export default Achievement;
