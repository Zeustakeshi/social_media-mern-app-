import Avatar from "../components/Avatar";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { SetStateAction, useEffect, useRef, useState } from "react";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, BASE_URL_API } from "../utils/contst";
import { IMessage } from "../interfaces/chats.interface";
import { useAuth } from "../context/authContext";
import { IUser } from "../interfaces/user.interface";
import { io } from "socket.io-client";
import moment from "moment";
import useSocket from "../hooks/useSocket";

const Chat = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);

    const auth = useAuth();
    const chatID = useParams().id;
    const { state } = useLocation();
    const socket = useSocket(BASE_URL);
    const scrollRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (!socket || !state) return;
    //     const { friendData }: { friendData: IUser } = state;
    //     socket.emit("newUser", auth?.currentUser?.id);

    //     socket.emit("friends-online", friendData.id);
    //     socket.on("getFriendOnlines", (friends) => {
    //         console.log(friends);
    //     });
    // }, [socket, state]);

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

interface ChatMessageProps extends IMessage {
    createdAt?: string;
    message?: string;
    senderInfo: IUser;
    isCurrentUserMessage?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    senderInfo,
    message,
    isCurrentUserMessage,
    createdAt,
}) => {
    return (
        <div
            className={`flex justify-${
                isCurrentUserMessage ? "end" : "start"
            } items-start gap-4 my-5`}
        >
            {!isCurrentUserMessage && (
                <Avatar
                    size={35}
                    to={`/profile/${senderInfo.id}`}
                    src={senderInfo.avatar}
                ></Avatar>
            )}
            <div
                className={`flex flex-col justify-start items-start gap-1 ${
                    isCurrentUserMessage ? "bg-[#e5efff] " : "bg-gray-100"
                } p-3 rounded-lg  max-w-[60%] shadow-md`}
            >
                <div className="text-slate-600 text-sm">
                    {senderInfo.userName}
                </div>
                <div>{message}</div>
                <div className="text-xs text-slate-400">
                    {moment(createdAt).format("HH:mm")}
                </div>
            </div>
            {isCurrentUserMessage && (
                <Avatar
                    size={35}
                    to={`/profile/${senderInfo.id}`}
                    src={senderInfo.avatar}
                ></Avatar>
            )}
        </div>
    );
};

const ChatTopBar: React.FC = ({}) => {
    const { friendData }: { friendData: IUser } = useLocation().state;
    return (
        <div className="px-5 py-3 w-full border-b border-b-slate-100 ">
            <div className="flex-1 flex justify-start items-center gap-2">
                <Avatar src={friendData.avatar}></Avatar>
                <div className="flex flex-col justify-center items-start">
                    <div className="text-lg font-semibold">
                        {friendData.userName}
                    </div>
                    <div className="text-sm text-slate-600">1 minutes ago</div>
                </div>
            </div>
        </div>
    );
};

interface ChatInputProps {
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    currentUser?: IUser;
}

const ChatInput: React.FC<ChatInputProps> = ({ setMessages, currentUser }) => {
    const [message, setMessage] = useState<string>("");
    const [showButtonSend, setShowButtonSend] = useState<boolean>(false);
    const chatID = useParams().id;

    useEffect(() => {
        if (message.trim()) {
            setShowButtonSend(true);
        } else {
            setShowButtonSend(false);
        }
    }, [message]);

    const handleSendChat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            // await axios({
            //     method: "POST",
            //     url: BASE_URL + `/messages`,
            //     data: {
            //         chatID: chatID,
            //         message: message,
            //     },
            //     withCredentials: true,
            // });
            setMessages((prev) => [
                ...prev,
                {
                    chatID: chatID,
                    createdAt: moment()
                        .utcOffset("+00:00")
                        .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                    message: message,
                    senderID: currentUser?.id,
                    updatedAt: moment()
                        .utcOffset("+00:00")
                        .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                },
            ]);
            setMessage("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form
            onSubmit={handleSendChat}
            className="w-full flex justify-center items-center gap-2 px-3 border-t border-t-blue-500"
        >
            <input
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                }}
                type="text"
                placeholder="Enter message ..."
                className="w-full flex-1 px-4 py-3 outline-none"
            />
            {showButtonSend ? (
                <button
                    type="submit"
                    className="text-blue-500 p-4 cursor-pointer"
                >
                    <SendRoundedIcon></SendRoundedIcon>
                </button>
            ) : (
                <button className="text-blue-500 p-4 cursor-pointer">
                    <ThumbUpRoundedIcon></ThumbUpRoundedIcon>
                </button>
            )}
        </form>
    );
};

export default Chat;
