import React from "react";
import { NavLink } from "react-router-dom";
import calendarImg from "../../../assets/calendar.png";
import friendsImg from "../../../assets/friends.png";
import gamingImg from "../../../assets/gaming.png";
import marketImg from "../../../assets/market.png";
import memoriesImg from "../../../assets/memories.png";
import photoImg from "../../../assets/photo.png";
import watchImg from "../../../assets/watch.png";
import { useAuth } from "../../../context/authContext";
import Avatar from "../../Avatar";
import Image from "../../Image";

const SidebarLeft = () => {
    const auth = useAuth();
    return (
        <div className="hidden md:block sticky top-[110px] h-[calc(100vh-110px)] bg-white col-span-2 px-2 shadow-md">
            <div className="py-4  border-b border-b-gray-300">
                <SidebarLeftItem
                    img={<Avatar size={40} src={auth?.currentUser?.avatar} />}
                    label={auth?.currentUser?.userName}
                ></SidebarLeftItem>
                <SidebarLeftItem
                    img={<Image src={friendsImg} size={40} />}
                    label="Friends"
                ></SidebarLeftItem>
                <SidebarLeftItem
                    img={<Image src={marketImg} size={40} />}
                    label="Maketplace"
                ></SidebarLeftItem>
                <SidebarLeftItem
                    img={<Image src={watchImg} size={40} />}
                    label="Watch"
                ></SidebarLeftItem>
                <SidebarLeftItem
                    img={<Image src={memoriesImg} size={40} />}
                    label="Memories"
                ></SidebarLeftItem>
            </div>
            <div className="py-4">
                <h5 className="text-sm font-medium text-gray-400 my-3">
                    Your shortcuts
                </h5>{" "}
                <SidebarLeftItem
                    img={<Image src={calendarImg} size={40} />}
                    label="Events"
                ></SidebarLeftItem>
                <SidebarLeftItem
                    img={<Image src={photoImg} size={40} />}
                    label="Gallery"
                ></SidebarLeftItem>
                <SidebarLeftItem
                    img={<Image src={gamingImg} size={40} />}
                    label="Gaming"
                ></SidebarLeftItem>
            </div>
        </div>
    );
};

interface SidebarLeftItemProps {
    to?: string;
    onClick?: () => void;
    img: React.ReactNode;
    label?: string;
}

const SidebarLeftItem: React.FC<SidebarLeftItemProps> = ({
    onClick = () => {},
    to,
    img,
    label,
}) => {
    return (
        <NavLink
            to={to || ""}
            onClick={onClick}
            className="p-4 flex justify-start items-center gap-2 hover:bg-gray-100 rounded-lg"
        >
            <div>{img}</div>
            <div>{label}</div>
        </NavLink>
    );
};

export default SidebarLeft;
