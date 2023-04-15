import React from "react";
import Image from "./Image";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useAuth } from "../context/authContext";
interface IStory {
    id?: string | number;
    img?: string;
    uid?: string | number;
    userName?: string;
}

const storiesData: IStory[] = [
    {
        id: 1,
        img: "https://source.unsplash.com/featured/?story",
        uid: 1,
        userName: "Minh Hieu",
    },
    {
        id: 2,
        img: "https://source.unsplash.com/featured/?story",
        uid: 1,
        userName: "Minh Hieu2",
    },
    {
        id: 3,
        img: "https://source.unsplash.com/featured/?story",
        uid: 1,
        userName: "Minh Hieu4",
    },
    {
        id: 4,
        img: "https://source.unsplash.com/featured/?story",
        uid: 1,
        userName: "Minh Hieu",
    },
    {
        id: 5,
        img: "https://source.unsplash.com/featured/?story",
        uid: 2,
        userName: "Minh Hieu",
    },
    {
        id: 6,
        img: "https://source.unsplash.com/featured/?story",
        uid: 2,
        userName: "Minh Hieu",
    },
    {
        id: 6,
        img: "https://source.unsplash.com/featured/?story",
        uid: 2,
        userName: "Minh Hieu",
    },
];

const Stories = () => {
    const auth = useAuth();
    return (
        <div className="flex justify-start items-start gap-3 flex-nowrap overflow-auto hiden-scrollbar cursor-pointer">
            <Story
                userName={auth?.currentUser?.userName}
                img={auth?.currentUser?.avatar}
                isAddStory
            ></Story>
            {storiesData.map((story: IStory, index: number) => {
                return <Story key={index} {...story}></Story>;
            })}
        </div>
    );
};

interface StoryProps extends IStory {
    isAddStory?: boolean;
}

const Story: React.FC<StoryProps> = ({ img, userName, isAddStory = false }) => {
    return (
        <div className="select-none md:min-w-[180px] min-w-[140px] group: relative col-span-1 md:h-[300px] h-[250px] shadow-lg rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
            <p className="absolute bottom-3 left-3 font-medium text-white text-sm">
                {userName}
            </p>
            <Image src={img}></Image>
            {isAddStory && (
                <div className="absolute bottom-10 left-2 p-3 bg-blue-500 text-white font-bold rounded-full w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
                    <AddOutlinedIcon></AddOutlinedIcon>
                </div>
            )}
        </div>
    );
};

export default Stories;
