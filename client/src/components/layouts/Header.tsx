import React from "react";
import Navbar from "./Navbar";

const Header = () => {
    return (
        <div className="w-full sticky top-0 shadow-sm bg-white z-50">
            <div className="app-container">
                <Navbar></Navbar>
            </div>
        </div>
    );
};

export default Header;
