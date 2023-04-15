import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import useClickOutSide from "../../hooks/useClickOutsite";
import { ISearchUser } from "../../interfaces/search.interface";
import Avatar from "../Avatar";
interface ISearchResutlsUserProps {
    searchData: ISearchUser[];
    onClose: () => void;
}

const SearchResultsUser: React.FC<ISearchResutlsUserProps> = ({
    searchData,
    onClose = () => {},
}) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const { nodeRef: clickRef } = useClickOutSide<HTMLDivElement>(onClose);
    return (
        <div
            ref={nodeRef}
            className="absolute top-[110%] left-[50%] -translate-x-[50%] bg-white shadow-xl w-[150%] rounded-lg"
        >
            <div ref={clickRef}>
                {searchData.map((data, index) => {
                    return (
                        <SearchResultsItem
                            key={index}
                            {...data}
                            onClick={onClose}
                        ></SearchResultsItem>
                    );
                })}
            </div>
        </div>
    );
};

interface SearchUserResultItemProps extends ISearchUser {
    onClick: () => void;
}

const SearchResultsItem: React.FC<SearchUserResultItemProps> = ({
    userName,
    avatar,
    id,
    desc,
    onClick = () => {},
}) => {
    return (
        <NavLink
            onClick={onClick}
            to={id ? `/profile/${id}` : "/"}
            className="transition-all group hover:bg-gray-100 flex justify-between items-center last:border-b-0 px-5 rounded-xl py-4 cursor-pointer"
        >
            <div className="flex-1 flex justify-start items-start gap-x-4 ">
                <Avatar
                    to={id ? `/profile/${id}` : "/"}
                    src={avatar}
                    size={60}
                ></Avatar>
                <div className="flex-1">
                    <h5 className="content-overflow-one-line font-medium text-xl mb-3">
                        {userName}
                    </h5>
                    <p>{desc}</p>
                </div>
            </div>
            <div className="group-hover:text-blue-500">
                <ArrowForwardIosIcon></ArrowForwardIosIcon>
            </div>
        </NavLink>
    );
};

export default SearchResultsUser;
