import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import api from "../../utils/api";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { IMessage } from "../../interfaces/chats.interface";
import { IUser } from "../../interfaces/user.interface";
import { BASE_URL_API } from "../../utils/contst";
interface ChatInputProps {
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    currentUser?: IUser;
}

const ChatInput: React.FC<ChatInputProps> = ({ setMessages, currentUser }) => {
    const [message, setMessage] = useState<string>("");
    const [showButtonSend, setShowButtonSend] = useState<boolean>(false);
    const chatID = useParams().id;
    const chat = useChat();
    const { friendData }: { friendData: IUser } = useLocation().state;

    useEffect(() => {
        if (message.trim()) {
            setShowButtonSend(true);
        } else {
            setShowButtonSend(false);
        }
    }, [message]);

    const handleSendChat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim() || !chat?.socket) return;

        try {
            await api({
                method: "POST",
                url: BASE_URL_API + `/messages`,
                data: {
                    chatID: chatID,
                    message: message,
                },
                withCredentials: true,
            });

            const chatDetails = {
                chatID: chatID,
                createdAt: moment()
                    .utcOffset("+00:00")
                    .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                message: message,
                senderID: currentUser?.id,
                updatedAt: moment()
                    .utcOffset("+00:00")
                    .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            };

            // send messages realtime with socket server
            chat.socket.emit("sendMessages", friendData.id, chatDetails);

            setMessages((prev) => [...prev, chatDetails]);
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

export default ChatInput;
