import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "react-tooltip/dist/react-tooltip.css";

interface AvatarProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  onClick?: () => void;
}

const Avatar = ({ src, alt, width, height, onClick }: AvatarProps) => {
  return (
    <span className="icon-container" onClick={onClick}>
      <Image
        className="avatar-image transform hover:scale-125 object-cover"
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={true}
      />
    </span>
  );
};

export default Avatar;
