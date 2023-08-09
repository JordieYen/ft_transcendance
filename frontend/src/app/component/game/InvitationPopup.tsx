import { UserData } from '@/store/useUserStore';
import React from 'react';
import { GameInvitationProps } from './GameContext';

const InvitationPopup = (props: GameInvitationProps) => {
    const { user, friend, onAccept, onDecline } = props;
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-black'>
            <div className='bg-white border rounded p-4'>
                <h1 className='text-xl font-bold mb-2 text-black'>Game invitation from {user.username}</h1>
                <div className='flex justify-between'>
                    <button className="bg-mygrey text-white px-4 py-2 rounded" onClick={onAccept}>Accept</button>
                    <button className="bg-mygrey text-white px-4 py-2 rounded" onClick={onDecline}>Decline</button>
                </div>
            </div>
        </div>
    )
}

export default InvitationPopup;
