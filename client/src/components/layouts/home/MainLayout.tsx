import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

const MainLayout = () => {
    return (
        <div className="flex flex-col justify-start items-center bg-slate-50 ">
            <Header></Header>
            <div className="app-container w-full h-full md:grid md:grid-cols-8 md:gap-5  ">
                <SidebarLeft></SidebarLeft>
                <div className="col-span-4">
                    <Outlet></Outlet>
                </div>
                <SidebarRight></SidebarRight>
            </div>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default MainLayout;
