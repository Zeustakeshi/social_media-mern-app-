import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { BASE_URL_API } from "../../utils/contst";
import Avatar from "../Avatar";
import Logo from "../Logo";
import Search from "../search/SearchUser";
const Navbar = () => {
    const auth = useAuth();

    return (
        <nav className="app-container flex justify-between items-center p-3">
            <div className="flex justify-start items-center md:gap-2">
                <Logo></Logo>
                <NavbarIcon to="/" className="hidden md:inline-block ">
                    <HomeOutlinedIcon></HomeOutlinedIcon>
                </NavbarIcon>
                <NavbarIcon>
                    <DarkModeOutlinedIcon></DarkModeOutlinedIcon>
                </NavbarIcon>
                <NavbarIcon className="hidden md:inline-block ">
                    <SpaceDashboardOutlinedIcon></SpaceDashboardOutlinedIcon>
                </NavbarIcon>
                <Search searchURL={BASE_URL_API + "/user/search"}></Search>
            </div>
            <div className="flex justify-end items-center md:gap-2">
                {/* Friends */}
                <NavbarIcon className="hidden md:inline-block ">
                    <PersonOutlineOutlinedIcon></PersonOutlineOutlinedIcon>
                </NavbarIcon>
                {/* Chat */}
                <NavbarIcon to="/chat/main">
                    <MapsUgcRoundedIcon></MapsUgcRoundedIcon>
                </NavbarIcon>
                {/* Notification */}
                <NavbarIcon>
                    <NotificationsNoneRoundedIcon></NotificationsNoneRoundedIcon>
                </NavbarIcon>
                <div className="flex justify-end items-center gap-2 cursor-pointer">
                    <Avatar
                        src={auth?.currentUser?.avatar}
                        to={`/profile/${auth?.currentUser?.id}`}
                    ></Avatar>
                    <p className="md:block hidden font-medium ">
                        {auth?.currentUser?.userName}
                    </p>
                </div>
            </div>
        </nav>
    );
};

interface INavIcon {
    children: React.ReactNode;
    to?: string;
    onClick?: () => void;
    className?: string;
}

const NavbarIcon: React.FC<INavIcon> = ({
    children,
    to,
    onClick = () => {},
    className = "",
}) => {
    if (to) {
        return (
            <NavLink onClick={onClick} to={to} className={`p-2 ${className}`}>
                {children}
            </NavLink>
        );
    }
    return (
        <div onClick={onClick} className={`p-2 ${className}`}>
            {children}
        </div>
    );
};

export default Navbar;
