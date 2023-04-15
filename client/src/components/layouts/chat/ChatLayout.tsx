import { Outlet } from "react-router-dom";
import { ChatProvider } from "../../../context/ChatContext";
import Header from "../Header";
import CloseFriend from "./CloseFriend";
import OnineFriend from "./OnineFriend";

const ChatLayout = () => {
    return (
        <div className="flex flex-col justify-start items-center bg-slate-50 ">
            <Header></Header>
            <ChatProvider>
                <div className="app-container w-full h-full md:grid md:grid-cols-8 ">
                    <CloseFriend></CloseFriend>
                    <div className="col-span-4">
                        <Outlet></Outlet>
                    </div>
                    <OnineFriend></OnineFriend>
                </div>
            </ChatProvider>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default ChatLayout;
