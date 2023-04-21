import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Tippy from "@tippyjs/react/headless";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { IPost } from "../interfaces/post.interface";
import { IUser } from "../interfaces/user.interface";
import api from "../utils/api";
import { BASE_URL_API } from "../utils/contst";
import Avatar from "./Avatar";
import Comments from "./Comments";
import Image from "./Image";

const Posts = ({ userID }: { userID?: string }) => {
    const [posts, setPosts] = useState<IPost[]>([]);

    useEffect(() => {
        if (!userID) return;

        (async () => {
            try {
                const postsRes = await api({
                    method: "GET",
                    url: BASE_URL_API + `/post/${userID}`,
                    withCredentials: true,
                });

                const posts = await Promise.all(
                    postsRes.data.map(async (post: IPost) => {
                        const comments = await api({
                            method: "GET",
                            url: BASE_URL_API + `/post/${post._id}/comment`,
                            withCredentials: true,
                        });

                        return {
                            ...post,
                            comments: comments.data,
                        };
                    })
                );

                setPosts(posts);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [userID]);

    return (
        <div className="w-full flex flex-col justify-start items-center gap-5 mt-5">
            {posts.map((post, index) => {
                return <Post key={index} {...post}></Post>;
            })}
        </div>
    );
};

const Post: React.FC<IPost> = ({
    img,
    _id,
    createdAt,
    comments = [],
    desc,
    likes,
    userID,
}) => {
    const [showComments, setShowComments] = useState(false);
    const [author, setAuthor] = useState<IUser>();
    const auth = useAuth();

    useEffect(() => {
        (async () => {
            if (!userID) return;
            try {
                const authorInfo = await api({
                    method: "GET",
                    url: BASE_URL_API + `/user/${userID}`,
                    withCredentials: true,
                });
                setAuthor(authorInfo.data);
            } catch (error) {
                console.log(error);
            }
        })();
        setShowComments(false);
    }, [userID]);

    const handleDeletePost = async () => {
        if (author?.id !== auth?.currentUser?.id) {
            alert("You can't delete this post!");
            return null;
        }

        try {
            const res = await api({
                method: "DELETE",
                url: BASE_URL_API + `/post/${_id}`,
                withCredentials: true,
            });
            alert(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full shadow-lg bg-white md:p-5 p-3 md:py-8 py-6 rounded-lg">
            <div className="mb-5 flex justify-between items-center w-full">
                <div className="flex justify-start items-start flex-1 w-full gap-2">
                    <Avatar
                        src={author?.avatar}
                        to={`/profile/${author?.id}`}
                    ></Avatar>
                    <div>
                        <h4 className="font-semibold ">{author?.userName}</h4>
                        <p className="font-medium text-sm text-slate-600">
                            {moment(createdAt).fromNow()}
                        </p>
                    </div>
                </div>
                {auth?.currentUser?.id === author?.id && (
                    <Tippy
                        arrow
                        interactive
                        placement="bottom"
                        render={(attrs) => (
                            <div
                                className="rounded-md bg-white shadow-lg flex flex-col justify-center items-center"
                                tabIndex={-1}
                                {...attrs}
                            >
                                <button
                                    onClick={handleDeletePost}
                                    className="hover:bg-gray-100 flex justify-center items-center gap-2 text-sm text-red-600 px-4 py-3 rounded-lg"
                                >
                                    <DeleteForeverIcon fontSize="small" />
                                    <span>Delete</span>
                                </button>
                                <button className="hover:bg-gray-100 flex justify-center items-center gap-2 text-sm px-4 py-3 rounded-lg text-slate-500">
                                    <VisibilityOffIcon fontSize="small" />
                                    <span>Hidden</span>
                                </button>
                            </div>
                        )}
                    >
                        <div className="p-2 hover:bg-slate-100 rounded-full cursor-pointer text-slate-500">
                            <MoreHorizOutlinedIcon></MoreHorizOutlinedIcon>
                        </div>
                    </Tippy>
                )}
            </div>
            <div className="">
                {desc && <p className="my-3">{desc}</p>}
                {img && (
                    <div className="skeleton md:h-[500px] h-[350px] rounded-lg shadow-md">
                        <Image src={img}></Image>
                    </div>
                )}
            </div>
            <div className="mt-5 w-full flex md:justify-start justify-between items-center md:gap-3 text-sm">
                <LikeButton postID={_id} likes={likes}></LikeButton>
                <div
                    onClick={() => setShowComments((prev) => !prev)}
                    className="hover:bg-slate-200 rounded-lg text-slate-600 md:px-3 md:py-2 px-2 py-1 flex justify-center items-center gap-2 cursor-pointer"
                >
                    <ChatBubbleOutlineRoundedIcon></ChatBubbleOutlineRoundedIcon>
                    <p className="font-medium ">{comments.length} Comments</p>
                </div>
                <div className="md:flex hidden hover:bg-slate-200 rounded-lg text-slate-600 md:px-3 md:py-2 px-2 py-1  justify-center items-center gap-2 cursor-pointer">
                    <ShareIcon></ShareIcon>
                    <p className=" font-medium ">Share</p>
                </div>
            </div>
            {showComments && (
                <Comments commentData={comments} postID={_id}></Comments>
            )}
        </div>
    );
};

interface LikeButtonProps {
    likes?: string[];
    postID: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ likes, postID }) => {
    const auth = useAuth();
    const [liked, setLiked] = useState(() => {
        if (auth?.currentUser?.id) {
            return likes?.includes(auth.currentUser.id);
        } else {
            return false;
        }
    });
    const [couterLike, setCouterLike] = useState(likes?.length || 0);

    const handleLike = async () => {
        if (liked) return;
        try {
            const res = await api({
                method: "PATCH",
                url: BASE_URL_API + `/post/${postID}/like`,
                withCredentials: true,
            });
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUnlike = async () => {
        if (!liked) return;

        try {
            const res = await api({
                method: "PATCH",
                url: BASE_URL_API + `/post/${postID}/unlike`,
                withCredentials: true,
            });
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handletoggleLike = async () => {
        if (liked) {
            handleUnlike();
            setCouterLike((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
            setLiked(false);
        } else {
            handleLike();
            setCouterLike((prev) => prev + 1);
            setLiked(true);
        }
    };

    return (
        <div
            onClick={handletoggleLike}
            className=" hover:bg-slate-200 rounded-lg text-slate-600 md:px-3 md:py-2 px-2 py-1 flex justify-center items-center gap-2 cursor-pointer"
        >
            <span
                style={{
                    color: liked ? "#dc2626" : "#475569",
                }}
            >
                {!liked ? (
                    <FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon>
                ) : (
                    <FavoriteOutlinedIcon></FavoriteOutlinedIcon>
                )}
            </span>
            <p className="flex justify-start items-center gap-1 font-medium ">
                <span>{couterLike}</span> <span>Like</span>
            </p>
        </div>
    );
};

export default Posts;
