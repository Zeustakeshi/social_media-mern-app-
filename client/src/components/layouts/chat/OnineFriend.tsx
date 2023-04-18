import React from "react";
import { useChat } from "../../../context/ChatContext";
import Avatar from "../../Avatar";

const OnineFriend = () => {
    const chat = useChat();

    return (
        <div className="hidden md:block sticky top-[110px] h-[calc(100vh-110px)] bg-white col-span-2 px-2 overflow-auto hiden-scrollbar py-5">
            {chat?.friendOlines.map((firend: any, index: number) => {
                return (
                    <div
                        key={index}
                        className="flex  gap-2 justify-start items-center px-2 py-2 hover:bg-gray-50 cursor-pointer rounded-md"
                    >
                        <Avatar
                            isActiveStatus
                            size={50}
                            src={firend.avatar}
                        ></Avatar>
                        <div className="flex flex-col gap-1 justify-start items-start">
                            <h4 className="text-lg font-medium">
                                {firend.userName}
                            </h4>
                            <p className="text-sm font-medium text-slate-500">
                                1 minutes ago
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OnineFriend;
