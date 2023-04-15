import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import Avatar from "./Avatar";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import axios from "axios";
import { BASE_URL_API } from "../utils/contst";
const CreatePost = () => {
    const [postDesc, setPostDesc] = useState<string>("");
    const [postImage, setPostImage] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const auth = useAuth();

    const handlePost = async () => {
        if (!postDesc.trim()) {
            alert("Post must have a description!");
            return null;
        }

        if (!auth?.currentUser?.id) {
            alert("You must be login for this action!!");
            return null;
        }

        setLoading(true);
        try {
            await axios({
                method: "POST",
                url: BASE_URL_API + `/post`,
                data: {
                    userID: auth?.currentUser?.id,
                    desc: postDesc,
                    img: postImage,
                },
                withCredentials: true,
            });
            setPostDesc("");
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div className="my-5 bg-white px-4 py-5 rounded-lg shadow-lg">
            <div className="flex justify-start items-center gap-3">
                <Avatar
                    src={auth?.currentUser?.avatar}
                    to={`/profile/${auth?.currentUser?.id}`}
                ></Avatar>
                <div className="flex-1 bg-slate-100 rounded-lg overflow-hidden">
                    <input
                        value={postDesc}
                        onChange={(e) => setPostDesc(e.target.value)}
                        type="text"
                        placeholder="What's happening?"
                        className="bg-transparent w-full md:py-3 px-3 py-2 text-sm outline-none placeholder:text-slate-500"
                    />
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
                <div className="flex justify-start items-center">
                    <div className="md:text-base text-xs flex justify-center items-center gap-2 text-slate-500 md:p-3 p-2 cursor-pointer hover:bg-slate-100 transition-all rounded-lg">
                        <span className="md:text-xl text-lg">
                            <VideocamOutlinedIcon fontSize="inherit" />
                        </span>
                        <span className="md:text-base text-[10px]">
                            Live Video
                        </span>
                    </div>
                    <ChoosePostImg setPostImage={setPostImage}></ChoosePostImg>
                    <div className="md:text-base text-xs flex justify-center items-center gap-2 text-slate-500 md:p-3 p-2 cursor-pointer hover:bg-slate-100 transition-all rounded-lg">
                        <span className="md:text-xl text-lg">
                            <SentimentSatisfiedOutlinedIcon fontSize="inherit" />
                        </span>
                        <span className="md:text-base text-[10px]">
                            Feeling
                        </span>
                    </div>
                </div>
                <div onClick={handlePost} className="">
                    <button
                        disabled={loading}
                        className={`${
                            loading ? "opacity-30" : ""
                        } px-5 py-2 md:text-base text-sm rounded-md bg-blue-500 text-white font-medium`}
                    >
                        {loading ? "Loading..." : " Post"}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ChoosePostImgProps {
    setPostImage: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ChoosePostImg: React.FC<ChoosePostImgProps> = ({ setPostImage }) => {
    const handleChooseImage = () => {
        const imgURL = prompt("Enter post image url") || undefined;
        setPostImage(imgURL);
    };
    return (
        <div
            onClick={handleChooseImage}
            className="md:text-base text-xs flex justify-center items-center gap-2 text-slate-500 md:p-3 p-2 cursor-pointer hover:bg-slate-100 transition-all rounded-lg"
        >
            <span className="md:text-xl text-lg">
                <PhotoSizeSelectActualOutlinedIcon fontSize="inherit" />
            </span>
            <span className="md:text-base text-[10px]">Photo/ video</span>
        </div>
    );
};

export default CreatePost;
