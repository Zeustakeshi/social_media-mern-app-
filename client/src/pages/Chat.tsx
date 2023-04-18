import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ChatInput from "../components/chat/ChatInput";
import ChatMessage from "../components/chat/ChatMessage";
import ChatTopBar from "../components/chat/ChatTopBar";
import { useAuth } from "../context/authContext";
import { useChat } from "../context/ChatContext";
import { IMessage } from "../interfaces/chats.interface";
import { BASE_URL_API } from "../utils/contst";

const Chat = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const auth = useAuth();
    const chatID = useParams().id;
    const { state } = useLocation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const chat = useChat();

    useEffect(() => {
        if (!state) return;
        (async () => {
            try {
                const res = await axios({
                    method: "GET",
                    url: BASE_URL_API + `/messages/${chatID}`,
                    withCredentials: true,
                });

                setMessages(res.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [state]);

    useEffect(() => {
        if (!chat?.socket || chatID === "main") return;
        chat.socket.on("getMessages", (messageDetails) => {
            if (messageDetails.chatID === chatID) {
                console.log("run");

                setMessages((prev: any) => {
                    if (prev.includes(messageDetails)) return prev;
                    return [...prev, messageDetails];
                });
            }
        });

        return () => {
            chat.socket?.off("getMessages");
        };
    }, [chat?.socket, chatID]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    if (!state) return <div>No chat data</div>;
    return (
        <div className="min-h-full bg-white border border-slate-50 flex flex-col justify-center  items-center">
            <ChatTopBar></ChatTopBar>
            <div className="overflow-auto hiden-scrollbar flex-1 max-h-[calc(100vh-300px)] h-full w-full  row-span-6 p-4">
                {messages.map((mess, index) => {
                    return (
                        <div key={index} ref={scrollRef}>
                            <ChatMessage
                                {...mess}
                                senderInfo={
                                    mess.senderID === auth?.currentUser?.id
                                        ? auth?.currentUser
                                        : state.friendData
                                }
                                isCurrentUserMessage={
                                    mess.senderID === auth?.currentUser?.id
                                }
                            ></ChatMessage>
                        </div>
                    );
                })}
            </div>
            <ChatInput
                setMessages={setMessages}
                currentUser={auth?.currentUser}
            ></ChatInput>
        </div>
    );
};

export default Chat;
