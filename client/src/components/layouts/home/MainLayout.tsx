import React from "react";
import { Outlet } from "react-router-dom";
import { ChatProvider } from "../../../context/ChatContext";
import Avatar from "../../Avatar";
import OnineFriend from "../chat/OnineFriend";
import Footer from "../Footer";
import Header from "../Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import SidebarRightBox from "./SidebarRightBox";

const MainLayout = () => {
    return (
        <div className="flex flex-col justify-start items-center bg-slate-50 ">
            <Header></Header>
            <div className="app-container w-full h-full md:grid md:grid-cols-8 md:gap-5  ">
                <SidebarLeft></SidebarLeft>
                <div className="col-span-4">
                    <Outlet></Outlet>
                </div>
                {/* <SidebarRight></SidebarRight> */}
                <div className="hidden md:block sticky top-[110px] h-[calc(100vh-110px)] col-span-2  overflow-auto hiden-scrollbar">
                    <SidebarRightBox title="Suggestion for you">
                        {new Array(2).fill(0).map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className=" justify-start items-center px-2 py-3 flex gap-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <Avatar
                                        size={60}
                                        className="rounded-lg"
                                    ></Avatar>
                                    <div className="flex-1 flex flex-col justify-center items-start">
                                        <div className="flex justify-start items-center gap-3">
                                            <div className="font-medium text-lg ">
                                                Minh Hieu
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-end items-center gap-2">
                                            <button className="px-2 py-1 rounded-md bg-blue-500 font-medium text-white text-xs">
                                                Follow
                                            </button>
                                            <button className="px-2 py-1 rounded-md bg-rose-500 font-medium text-white text-xs">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </SidebarRightBox>
                    <SidebarRightBox title="Online Firend">
                        <ChatProvider>
                            <OnineFriend></OnineFriend>
                        </ChatProvider>
                    </SidebarRightBox>
                </div>
            </div>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default MainLayout;
