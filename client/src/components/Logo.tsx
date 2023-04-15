import React from "react";
import { NavLink } from "react-router-dom";

interface ILogo {
    className?: string;
}

const Logo: React.FC<ILogo> = ({ className = "" }) => {
    return (
        <NavLink
            to="/"
            className={`inline-block md:text-2xl text-xl text-blue-500 font-bold md:px-5 md:py-4 px-2 py-2 ${className}`}
        >
            Fakebook
        </NavLink>
    );
};

export default Logo;
