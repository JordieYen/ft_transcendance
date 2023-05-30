import React, { useEffect, useState } from 'react';
import UserData from '../data/user_data';
import Logout from '../data/logout';
import Avartar from '../header_icon/user_avatar';
import './profile.css';
import MatchHistory from './match_history';
import formatDateMalaysia from '../utils/date';

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
              <Avartar src={ avatar } alt='user avartar'  width={140} height={140}/> 
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
            <div className='achievement-section'>
              <div className='avatar-row'>
                <Avartar src={ '/bracket.png' } alt='user avatar' width={50} height={50}/>
                <Avartar src={ '/bracket.png' } alt='user avatar' width={50} height={50}/>
                <Avartar src={ '/bracket.png' } alt='user avatar' width={50} height={50}/>
                <Avartar src={ '/bracket.png' } alt='user avatar' width={50} height={50}/>
              </div>
              <div className='avatar-row'>
                <Avartar src={ '/bracket.png' } alt='user avatar' width={50} height={50}/>
                <Avartar src={ '/bracket.png' } alt='user avatar' width={50} height={50}/>
                <Avartar src={ '/bracket.png' } alt='user avatar' width={50} height={50}/>
                <Avartar src={ '/bracket.png' } alt='user avatar' width={50} height={50}/>
              </div>
            </div>
        </div>
        <div className='bottom-content'>
            <MatchHistory p1_match={p1_match} p2_match={p2_match} userId={ id } />
            <div className='match-making'>
              <div className='circle-top'>
                <div className='circle-content'>
                    <p>MATCH MAKING ON<br/><span>200</span><br/>HIGHEST 200</p>
                </div>
              </div>
              <div className='circle-bottom'>
                <div className='circle-content'>
                 <p>LIFETIME KILLS<br/><span>25</span><br/>DEATHS 10<br/>K/DR 2.50</p>
                </div>
              </div>
              <div className='stats'>
                <p>Smash Count <span>5</span></p>
                <hr />
                <p>Lights Out Count <span>5</span></p>
              </div>
            </div>
        </div>
      </div>
  );
};

          {/* <img src={avatar} alt="User Avatar" style={{ width: '200px', height: '200px' }} /> */}
          {/* <p>Id: {id}</p>
          <p>Intra_uid: {intra_uid}</p>
          <p>Username: {username}</p>
          <p>Online: {online ? 'online' : 'offline'}</p>
          <p>P1 Match: {p1_match[0] ? 'match 1' : 'no match'}</p>
          <p>P1 Score: {p1_match[0]?.p1_score}</p>
          <p>Stat lose: {stat?.losses}</p>
          <p>Stat wins: {stat?.wins}</p>
          <p>Stat mmr: {stat?.mmr}</p>
        <p>Achievement: {userAchievement[0] ? userAchievement[0]?.achievement?.name : 'no achievement'}</p> */}

export default PongMain;
