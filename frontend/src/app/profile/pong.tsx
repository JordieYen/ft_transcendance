import React, { useEffect, useState } from 'react';
import UserData from '../data/user_data';
import Logout from '../data/logout';
import Avartar from '../header_icon/user_avatar';
import { isConciseBody } from 'typescript';

const PongMain = () => {
    
    const userData = UserData();
    if (!userData) {
      return <div>Loading...</div>;
    }
    const { avatar, createdAt, id, intra_uid, username, online, p1_match, stat, userAchievement } = userData;
    const joinDate = new Date(createdAt).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className="top-profile">
        <div className='avatar-section'>
          <Avartar src={ avatar } alt="user avartar"  width={200} height={200}/> 
        </div>
        <div className='username-section'>
          <p>{ username }</p>
          <p>Joined { joinDate } </p>
        </div>
        <div className="vertical-line">
        </div>
        <div className="lifetime-section">
          <p>Total Games</p>
          <p>25</p>
        </div>
        <div className="lifetime-wins-section">
          <p>Total Wins</p>
          <p>8</p>
        </div>
        <div className="lifetime-wins-streak-section">
          <p>Win Streak</p>
          <p>4</p>
        </div>
        <div className="vertical-line">
        </div>

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
      </div>
    );
};

export default PongMain;
