import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useChat } from "../../../context/ChatContext";
import { IChats } from "../../../interfaces/chats.interface";
import { IUser } from "../../../interfaces/user.interface";
import { BASE_URL_API } from "../../../utils/contst";
import Avatar from "../../Avatar";

const CloseFriend = () => {
    const chat = useChat();

    return (
        <div className="hidden md:block sticky top-[110px] h-[calc(100vh-110px)] bg-white col-span-2 px-2 shadow-md">
            <div className="w-full">
                <input
                    className="w-full bg-transparent p-3 outline-none border-b focus:border-b-blue-500 transition-all"
                    type="text"
                    placeholder="Search for friends ...."
                />
            </div>
            <div className="my-4">
                {chat?.chats.map((chat, index) => {
                    return (
                        <FriendItem
                            key={index}
                            {...chat}
                            friendIndex={index}
                        ></FriendItem>
                    );
                })}
            </div>
        </div>
    );
};

interface FriendItemProps extends IChats {
    friendIndex: number;
}

const FriendItem: React.FC<FriendItemProps> = ({
    _id,
    members,
    createdAt,
    updatedAt,
    friendIndex,
}) => {
    const [user, setUser] = useState<IUser>();
    const auth = useAuth();
    const navigation = useNavigate();
    const chat = useChat();

    useEffect(() => {
        if (chat?.friends[friendIndex]) {
            setUser(chat.friends[friendIndex]);
        }
    }, [chat?.friends[friendIndex]]);

    return (
        <div
            onClick={() => {
                navigation(`/chat/${_id}`, {
                    state: {
                        friendData: user,
                    },
                });
            }}
            className="w-full flex justify-start items-center gap-2 py-3 px-2 hover:bg-gray-100 rounded-sm cursor-pointer text-sm"
        >
            <Avatar src={user?.avatar} to={`/profile/${user?.id}`}></Avatar>
            <div className="flex-1 flex flex-col justify-center items-start">
                <div className="flex justify-between items-center w-full">
                    <span className="text-base font-medium">
                        {user?.userName}
                    </span>
                    <span className="text-xs text-slate-400">
                        {moment(updatedAt).fromNow()}
                    </span>
                </div>
                <p className="text-xs text-ellipsis whitespace-nowrap overflow-hidden max-w-[200px] text-slate-500">
                    Helllo
                </p>
            </div>
        </div>
    );
};

export default CloseFriend;
