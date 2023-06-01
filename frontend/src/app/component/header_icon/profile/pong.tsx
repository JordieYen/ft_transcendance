import UserData from '../../../data/user_data';
import Avatar from '../user_avatar';
import './profile.css';
import MatchHistory from './match_history';
import formatDateMalaysia from '../../../utils/date';
import Achievement from './achievement';
import MatchMaking from './match_making';

const PongMain: React.FC<any> = () => {
    
    const userData = UserData();
    if (!userData) {
      return <div>Loading...</div>;
    }
    const { avatar, createdAt, id, intra_uid, username, online, p1_match, p2_match, stat, userAchievement } = userData;
    const joinDate = formatDateMalaysia(new Date(createdAt));

    return (
      <div className='profile-page'>
        <div className='top-profile'>
          <div className='avatar-section'>
              <Avatar src={ avatar } alt='user avartar'  width={140} height={140}/> 
              <div className='username'>
                <p>{ username }</p>
                <p className='text-myyellow'>Joined { joinDate } </p>
              </div>
          </div>
          <div className='vertical-line'>
          </div>
          <div className='lifetime-section'>
            <div className='total-games'>
              <p>Total Games</p>
              <p>{ stat?.total_games || 0 }</p>
            </div>
            <div className='lifetime-wins'>
              <p>Total Wins</p>
              <p>{ stat?.wins || 0 }</p>
            </div>
            <div className='lifetime-wins-streak'>
              <p>Win Streaks</p>
              <p>{ stat?.winStreak || 0}</p>
            </div>
          </div>
          <div className='vertical-line'>
          </div>
            <Achievement achievement={userAchievement} />
        </div>
        <div className='bottom-content'>
            <MatchHistory p1_match={p1_match} p2_match={p2_match} userId={ id } />
            <MatchMaking />
        </div>
      </div>
  );
};

export default PongMain;
