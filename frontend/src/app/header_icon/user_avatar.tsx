import Image from 'next/image';
import React from 'react';
import UserData from '../data/user_data';

const Avatar: React.FC<{ src: string, alt: string, width: number, height: number }> = ({ src, alt, width, height }) => {
    return (
        <span className='icon-container'>
            <img className="avatar-image" src={src} alt={alt} width={width} height={height} />
        </span>
    );
};
export default Avatar;
