import api from "../utils/api";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import useSocket from "../hooks/useSocket";
import { IChats } from "../interfaces/chats.interface";
import { IUser } from "../interfaces/user.interface";
import { BASE_URL, BASE_URL_API } from "../utils/contst";
import { useAuth } from "./authContext";

interface ChatProviderProps {
    children: React.ReactNode;
}

interface IChatContext {
    chats: IChats[];
    friends: string[] | any;
    friendOlines: IUser[] | any;
    socket?: Socket;
}

const ChatContext = React.createContext<IChatContext | null>(null);

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [chats, setChats] = useState<IChats[]>([]);
    const [friends, setFriends] = useState<any>([]);
    const [friendOlines, setFriendOlines] = useState<any>([]);
    const auth = useAuth();
    const socket = useSocket(BASE_URL, {
        userID: auth?.currentUser?.id,
    });

    useEffect(() => {
        // get chat from api
        (async () => {
            try {
                const res = await api({
                    method: "GET",
                    url: BASE_URL_API + `/chats`,
                    withCredentials: true,
                });
                const chats: IChats[] = res.data;
                setChats(chats);
                const friends = await Promise.all(
                    chats.map(async (chat) => {
                        const friendID = chat.members?.filter(
                            (m) => m !== auth?.currentUser?.id
                        )[0];
                        try {
                            const res = await api({
                                method: "GET",
                                url: BASE_URL_API + `/user/${friendID}`,
                                withCredentials: true,
                            });
                            return res.data;
                        } catch (error) {
                            console.log(error);
                        }
                    })
                );
                setFriends(friends);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    useEffect(() => {
        if (!socket || !friends.length || !chats.length) {
            return;
        }

        socket.on("connect_error", (err) => {
            console.log(err);
        });
        socket.emit("newUser", auth?.currentUser?.id);
        friends.forEach((friend: any) => {
            // console.log("send to " + friend.userName);

            socket.emit("onlineFriend", friend.id);
            socket.emit("notifyForFriendOnline", friend.id, {
                userID: auth?.currentUser?.id,
                isOnline: true,
            });
        });

        socket.on("getOnlineFriend", (friendID) => {
            const friendInfo = friends.find(
                (friend: any) => friend.id === friendID
            );
            if (!friendInfo) return;
            setFriendOlines((prev: any) => {
                if (!prev.includes(friendInfo)) {
                    return [...prev, friendInfo];
                } else return prev;
            });
        });

        socket.on("notifyFromFriend", (message) => {
            const { userID: friendID, isOnline } = message;
            const friendInfo = friends.find(
                (friend: any) => friend.id === friendID
            );
            if (!friendInfo) return;
            setFriendOlines((prev: any) => {
                if (!prev.includes(friendInfo) && isOnline) {
                    return [...prev, friendInfo];
                } else return prev;
            });
        });

        return () => {
            socket.removeAllListeners();
        };
    }, [friends, socket]);
    const values = { chats, friends, friendOlines, socket };

    return (
        <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
    );
};

const useChat = () => {
    const context = useContext(ChatContext);
    if (typeof context === "undefined")
        throw new Error("useChat must be used within ChatProvider");
    return context;
};

export { useChat, ChatProvider };
