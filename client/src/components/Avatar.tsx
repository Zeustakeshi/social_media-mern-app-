import React from "react";
import useWindowSize from "../hooks/useWindowSize";
import Image from "./Image";

interface IAvatarProps {
    onClick?: () => void;
    src?: string;
    to?: string;
    className?: string;
    size?: 50 | 100 | number;
    isActiveStatus?: boolean;
}

const defaultImgURL = "https://source.unsplash.com/featured/?user";

const Avatar: React.FC<IAvatarProps> = ({
    src,
    to,
    className = "",
    size = 50,
    onClick = () => {},
    isActiveStatus = false,
}) => {
    const windowSize = useWindowSize();
    if (windowSize.width && windowSize.width < 680) {
        size *= 0.8;
    }

    return (
        <div
            onClick={onClick}
            style={{
                width: size,
                height: size,
            }}
            className={`relative md:w-[${size}px] md:h-[${size}px] !w-[${
                size * 0.8
            }px] !h-[${size * 0.8}px] rounded-full skeleton ${className}`}
        >
            {isActiveStatus && (
                <span className="absolute -top-1 -right-1 rounded-full w-[45%] h-[45%] bg-white flex justify-center items-center">
                    <span className="bg-green-500 w-[80%] h-[80%] block rounded-full"></span>
                </span>
            )}
            <Image to={to} src={src || defaultImgURL}></Image>
        </div>
    );
};

export default Avatar;
