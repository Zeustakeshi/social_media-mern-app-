import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MapsUgcRoundedIcon from "@mui/icons-material/MapsUgcRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import PersonAddDisabledRoundedIcon from "@mui/icons-material/PersonAddDisabledRounded";
import axios, { all } from "axios";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CreatePost from "../components/CreatePost";
import Image from "../components/Image";
import Posts from "../components/Posts";
import { useAuth } from "../context/authContext";
import { IUser } from "../interfaces/user.interface";
import { BASE_URL_API, generateRandomImage } from "../utils/contst";
const Profile = () => {
    const [userInfo, setUserInfo] = useState<IUser>();

    const profileID = useParams().id;
    const auth = useAuth();
    const navigation = useNavigate();

    const handleLogout = async () => {
        try {
            await auth?.logout();
            navigation("/login");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            if (!profileID) return;
            try {
                const profile = await axios({
                    method: "GET",
                    url: BASE_URL_API + `/user/${profileID}`,
                    withCredentials: true,
                });
                setUserInfo(profile.data);
                if (profile.data.userName) {
                    document.title = profile.data.userName;
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [profileID, auth?.currentUser]);

    const handleChangeAvatar = async () => {
        if (auth?.currentUser?.id !== profileID || !auth?.currentUser?.id)
            return;
        const imgURL = prompt("Enter Avatar URL");
        if (!imgURL?.trim()) return;
        try {
            const res = await axios({
                method: "PATCH",
                url: BASE_URL_API + `/user/${auth?.currentUser?.id}`,
                data: {
                    avatar: imgURL,
                },
                withCredentials: true,
            });
            auth.setCurrentUser((prev) => ({ ...prev, avatar: imgURL }));
            alert(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="h-[300px] skeleton shadow-lg rounded-lg">
                <Image src={generateRandomImage("home")}></Image>
            </div>
            <Avatar
                onClick={handleChangeAvatar}
                className={`${
                    auth?.currentUser?.id === profileID ? "cursor-pointer" : ""
                } -mt-[10%] mx-auto shadow-md border-[6px] border-white`}
                size={200}
                src={userInfo?.avatar}
            ></Avatar>
            <div className="p-5 bg-white rounded-lg shadow-[rgba(0,0,0,0.1)_0px_5px_10px] h-[400px] md:-mt-[10%] -mt-[14%] text-center">
                <UserName
                    allowEdit={auth?.currentUser?.id === profileID}
                    userName={userInfo?.userName}
                    userID={userInfo?.id}
                ></UserName>
                <p className=" text-slate-800 ">{userInfo?.desc}</p>
                <div className="mt-5 w-full flex justify-center items-center gap-5">
                    {auth?.currentUser?.id === profileID ? (
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 rounded-lg bg-red-600 text-white font-medium gap-2 flex justify-center items-center"
                        >
                            <span>
                                <LogoutRoundedIcon></LogoutRoundedIcon>
                            </span>
                            <span>Logout</span>
                        </button>
                    ) : (
                        <>
                            <AddfriendButton
                                isFollowed={userInfo?.isFollowWithCurrentUser}
                                profileID={profileID}
                                currentUserID={auth?.currentUser?.id}
                            ></AddfriendButton>

                            <button
                                onClick={() => {
                                    navigation(`/chat/main`);
                                }}
                                className="px-3 py-2 rounded-lg bg-blue-500 text-white font-medium gap-2 flex justify-center items-center"
                            >
                                <span>
                                    <MapsUgcRoundedIcon></MapsUgcRoundedIcon>
                                </span>
                                <span>Chat now</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
            {auth?.currentUser?.id === profileID && <CreatePost></CreatePost>}
            <Posts userID={profileID}></Posts>
        </div>
    );
};

interface UserNameProps {
    userName?: string;
    userID?: string;
    allowEdit?: boolean;
}

const UserName: React.FC<UserNameProps> = ({
    userName,
    userID,
    allowEdit = false,
}) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [userNameValue, setUserNameValue] = useState<string>(userName || "");
    const auth = useAuth();
    const handleUpdateUserName = async () => {
        if (
            !userNameValue?.trim() ||
            userNameValue.trim() === auth?.currentUser?.userName?.trim()
        ) {
            alert("Invalid userName");
            return null;
        }
        try {
            const res = await axios({
                method: "PATCH",
                url: BASE_URL_API + `/user/${userID}`,
                data: {
                    userName: userNameValue,
                },
                withCredentials: true,
            });
            alert(res.data);
            auth?.setCurrentUser((prev) => ({
                ...prev,
                userName: userNameValue,
            }));
        } catch (error) {
            console.log(error);
        }
        setIsEdit(false);
    };

    if (isEdit) {
        return (
            <div className="group mb-5 text-center pt-[12%] flex justify-center items-center gap-2">
                <input
                    value={userNameValue}
                    onChange={(e) => setUserNameValue(e.target.value)}
                    type="text"
                    placeholder="Enter new userName"
                    className="px-3 py-2 outline-none bg-slate-100 placeholder:text-slate-600 rounded-md"
                />
                <span
                    onClick={handleUpdateUserName}
                    className=" w-[30px] h-[30px] rounded-full  bg-green-500 text-green-600 bg-opacity-20 flex justify-center items-center tet-slate-600 cursor-pointer"
                >
                    <CheckRoundedIcon fontSize="inherit" />
                </span>
                <span
                    className=" w-[30px] h-[30px] rounded-full  bg-red-500 text-red-600 bg-opacity-20 flex justify-center items-center tet-slate-600 cursor-pointer"
                    onClick={() => setIsEdit(false)}
                >
                    <CloseRoundedIcon fontSize="inherit" />
                </span>
            </div>
        );
    } else {
        return (
            <h3 className=" transition-all group mb-5 font-semibold text-2xl text-center pt-[12%] flex justify-center items-center gap-x-2">
                <span>{userName}</span>
                {allowEdit && (
                    <span
                        onClick={() => setIsEdit(true)}
                        className="text-base cursor-pointer w-[40px] h-[40px] hidden group-hover:flex justify-center items-center rounded-full bg-slate-100"
                    >
                        <ModeEditRoundedIcon fontSize="inherit" />
                    </span>
                )}
            </h3>
        );
    }
};

interface AddfriendButtonProps {
    profileID?: string;
    currentUserID?: string;
    isFollowed?: boolean;
}

const AddfriendButton: React.FC<AddfriendButtonProps> = ({
    currentUserID,
    profileID,
    isFollowed = false,
}) => {
    const [addfriend, setAddFriend] = useState(false);
    useEffect(() => {
        setAddFriend(isFollowed);
    }, [isFollowed]);

    const toggleAddfriend = async () => {
        if (!currentUserID || !profileID) return;
        if (addfriend) {
            // folowing user
            const res = await axios({
                method: "PATCH",
                url: BASE_URL_API + `/user/${profileID}/unfollow`,
                withCredentials: true,
            });
            alert(res.data);
            setAddFriend(false);
        } else {
            // unfolowing user
            const res = await axios({
                method: "PATCH",
                url: BASE_URL_API + `/user/${profileID}/follow`,
                withCredentials: true,
            });
            alert(res.data);
            setAddFriend(true);
        }
    };

    return (
        <button
            onClick={toggleAddfriend}
            className="px-3 py-2 rounded-lg bg-blue-500 text-white font-medium gap-2 flex justify-center items-center"
        >
            <span>
                {addfriend ? (
                    <PersonAddDisabledRoundedIcon></PersonAddDisabledRoundedIcon>
                ) : (
                    <GroupAddIcon></GroupAddIcon>
                )}
            </span>
            <span>{addfriend ? "Unfollow" : "Add friend"}</span>
        </button>
    );
};

export default Profile;
