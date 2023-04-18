import { useLocation } from "react-router-dom";
import { IUser } from "../../interfaces/user.interface";
import Avatar from "../Avatar";

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

export default ChatTopBar;
