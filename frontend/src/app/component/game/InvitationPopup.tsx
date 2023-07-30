import { UserData } from '@/store/useUserStore';
import React from 'react';
import { GameInvitationProps } from './GameContext';

const InvitationPopup = (props: GameInvitationProps) => {
    const { user, friend, onAccept, onDecline } = props;
    return (
        <div>
            <h3>Game invitation from {user.username}</h3>
            <button onClick={onAccept}>Accept</button>
            <button onClick={onDecline}>Decline</button>
        </div>
    )
}

export default InvitationPopup;
