import React from "react";
import Avatar from "../../Avatar";

const SidebarRight = () => {
    return (
        <div className="hidden md:block sticky top-[110px] h-[calc(100vh-110px)] col-span-2  overflow-auto hiden-scrollbar">
            <SidebarRightBox title="Suggestion for you">
                {new Array(2).fill(0).map((item, index) => {
                    return (
                        <div
                            key={index}
                            className=" justify-start items-center px-2 py-3 flex gap-2 hover:bg-gray-50 cursor-pointer"
                        >
                            <Avatar size={60} className="rounded-lg"></Avatar>
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
            <SidebarRightBox title="Online friends">
                {new Array(10).fill(0).map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="flex  gap-2 justify-start items-center px-2 py-2 hover:bg-gray-50 cursor-pointer rounded-md"
                        >
                            <Avatar isActiveStatus size={50}></Avatar>
                            <div className="flex flex-col gap-1 justify-start items-start">
                                <h4 className="text-lg font-medium">
                                    Pham Minh Hieu
                                </h4>
                                <p className="text-sm font-medium text-slate-500">
                                    1 minutes ago
                                </p>
                            </div>
                        </div>
                    );
                })}
            </SidebarRightBox>
        </div>
    );
};

interface ISidebarRightBoxProps {
    title: string;
    children: React.ReactNode;
}

const SidebarRightBox: React.FC<ISidebarRightBoxProps> = ({
    children,
    title,
}) => {
    return (
        <div className="w-full rounded-lg bg-white shadow-md my-3 p-3">
            <h4 className="p-4 font-medium text-sm text-gray-400">{title}</h4>
            {children}
        </div>
    );
};

export default SidebarRight;
