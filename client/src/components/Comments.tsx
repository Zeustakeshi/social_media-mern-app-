import SendRoundedIcon from "@mui/icons-material/SendRounded";
import axios from "axios";
import api from "../utils/api";
import moment from "moment";
import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { IComment, ICommentsProps } from "../interfaces/comment.interface";
import { BASE_URL_API } from "../utils/contst";
import Avatar from "./Avatar";

const Comments: React.FC<ICommentsProps> = ({ commentData = [], postID }) => {
    const [comments, setComments] = useState<IComment[]>(commentData);
    const auth = useAuth();

    return (
        <div className="w-full">
            <div className="flex flex-col justify-start items-start md:gap-6 gap-4 my-5">
                {comments.map((comment, index) => {
                    return <Comment key={index} {...comment}></Comment>;
                })}
            </div>
            <div className="flex mt-4 justify-start items-center w-full gap-3">
                <Avatar src={auth?.currentUser?.avatar} size={38}></Avatar>
                <InputComment
                    setComments={setComments}
                    postID={postID}
                ></InputComment>
            </div>
        </div>
    );
};

interface InputCommentProps {
    postID: string;
    setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
}

const InputComment: React.FC<InputCommentProps> = ({ setComments, postID }) => {
    const [comment, setComment] = useState("");
    const auth = useAuth();
    const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            const res = await api({
                method: "POST",
                url: BASE_URL_API + `/post/${postID}/comment`,
                data: { comment: comment },
                withCredentials: true,
            });

            setComments((prev) => [
                ...prev,
                {
                    ...res.data.data,
                    userName: auth?.currentUser?.userName,
                    avatar: auth?.currentUser?.avatar,
                },
            ]);
            setComment("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form
            onSubmit={handleComment}
            className="flex-1 w-full flex justify-between items-center gap-3 md:text-base text-sm"
        >
            <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="px-3 py-2 w-full outline-none  border-b focus:border-b-blue-500 border-b-transparent transition-all bg-gray-50 rounded-sm"
                type="text"
                placeholder="Write a comment ..."
            />
            <button
                type="submit"
                className="text-blue-500 bg-blue-500 bg-opacity-10 w-[60px] md:h-[50px] h-[40px] flex justify-center items-center rounded-md text-lg"
            >
                <SendRoundedIcon fontSize="inherit"></SendRoundedIcon>
            </button>
        </form>
    );
};

const Comment: React.FC<IComment> = ({
    avatar,
    userName,
    _id,
    createdAt,
    comment,
    userID,
}) => {
    const auth = useAuth();

    return (
        <div
            style={{
                alignItems: auth?.currentUser?.id === userID ? "end" : "start",
            }}
            className="flex flex-col justify-start items-start gap-3 md:text-base text-sm w-full"
        >
            <div className="flex justify-start items-center gap-3">
                <Avatar
                    src={avatar}
                    size={35}
                    to={`/profile/${userID}`}
                ></Avatar>
                <h5 className="text-sm font-semibold">{userName}</h5>
                <p className="text-xs text-slate-500 font-medium">
                    {moment(createdAt).fromNow()}
                </p>
            </div>
            <div
                style={{
                    background:
                        auth?.currentUser?.id === userID
                            ? "#3b82f6"
                            : "#e2e8f0",
                    color: auth?.currentUser?.id === userID ? "white" : "",
                }}
                className="bg-slate-200 rounded-lg md:p-3 p-2 text-sm max-w-[80%]"
            >
                {comment}
            </div>
        </div>
    );
};

export default Comments;
