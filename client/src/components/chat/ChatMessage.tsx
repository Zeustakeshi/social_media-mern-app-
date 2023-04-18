import moment from "moment";
import { IMessage } from "../../interfaces/chats.interface";
import { IUser } from "../../interfaces/user.interface";
import Avatar from "../Avatar";

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

export default ChatMessage;
