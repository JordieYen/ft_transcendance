import Image from 'next/image';
import React from 'react';
import UserData from '../data/user_data';

const Avartar: React.FC<{ src: string, alt: string, width: number, height: number }> = ({ src, alt, width, height }) => {
    return (
        <div>
            <img className="avatar-image" src={src} alt={alt} width={width} height={height} />
        </div>
    );
};
export default Avartar;
