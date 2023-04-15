import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
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
}

const ChatContext = React.createContext<IChatContext | null>(null);

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [chats, setChats] = useState<IChats[]>([]);
    const [friends, setFriends] = useState<any>([]);
    const socket = useSocket(BASE_URL);
    const auth = useAuth();
    useEffect(() => {
        // get chat from api
        (async () => {
            try {
                const res = await axios({
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
                            const res = await axios({
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
        if (!socket) return;
        socket.emit("newUser", auth?.currentUser?.id);

        const friendIDs = friends.map((friend: any) => friend.id);

        socket.emit("friends-online", friendIDs);
        socket.on("getFriendOnlines", (friends) => {
            console.log(friends);
        });
    }, [socket, friends]);

    const values = { chats, friends };

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
