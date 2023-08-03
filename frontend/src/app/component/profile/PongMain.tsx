import UserData from "../../webhook/UserContext";
import Avatar from "../header_icon/Avatar";
import "./profile.css";
import MatchHistory from "./MatchHistory";
import formatDateMalaysia from "../../utils/formatDateMalaysia";
import MatchMaking from "./MatchMaking";
import Achievement from "./Achievement";
import UserProfile from "@/app/webhook/UserProfile";

const PongMain: React.FC<any> = ({ userId }) => {
  // const { data: session, status } = useSession();
  // console.log("session", session);

  // if (status === "authenticated") {
  //   console.log("session", session);
  // } else if (status === "loading") {
  //   console.log("loading");
  // } else if (status === "unauthenticated") {
  //   console.log("unauthenticated");
  // } else {
  //   console.log("error");
  // }
  const userData = userId ? UserProfile(+userId) : UserData();
  if (!userData) {
    return <div>User not found in profile...</div>;
  }

  const {
    avatar,
    createdAt,
    id,
    username,
    p1_match,
    p2_match,
    stat,
    userAchievement,
  } = userData;
  const joinDate = formatDateMalaysia(new Date(createdAt));
  const totalGames = stat?.wins + stat?.losses;

  return (
    <div className="profile-page">
      <div className="top-profile">
        <div className="avatar-section">
          <Avatar src={avatar} alt="user avartar" width={100} height={100} />
          {/* <Image className="w-[100px] h-[100px] rounded-full object-cover" src={ avatar } alt='user avatar' width={100} height={100} /> */}
          <div className="username">
            <p>{username}</p>
            <p className="text-myyellow">Joined {joinDate} </p>
          </div>
        </div>
        <div className="vertical-line"></div>
        <div className="lifetime-section">
          <div className="total-games">
            <p>Total Games</p>
            {/* <p>{stat?.total_games || 0}</p> */}
            <p>{totalGames || 0}</p>
          </div>
          <div className="lifetime-wins">
            <p>Total Wins</p>
            <p>{stat?.wins || 0}</p>
          </div>
          <div className="lifetime-wins-streak">
            <p>Win Streaks</p>
            <p>{stat?.win_streak || 0}</p>
          </div>
        </div>
        <div className="vertical-line"></div>
        <Achievement achievement={userAchievement} />
      </div>
      <div className="bottom-content">
        <MatchHistory p1_match={p1_match} p2_match={p2_match} userId={id} />
        <MatchMaking stat={stat} />
      </div>
    </div>
  );
};

export default PongMain;
