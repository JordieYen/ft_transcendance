import Image from 'next/image';
import React from 'react';
import UserData from '../../webhook/UserContext';

const Avatar: React.FC<{ src: string, alt: string, width: number, height: number }> = ({ src, alt, width, height }) => {
    return (
        <span className='icon-container'>
            <Image className="avatar-image transform hover:scale-125 w-full h-auto" src={src} alt={alt} width={width} height={height} priority={true}/>
        </span>
    );
};
export default Avatar;
