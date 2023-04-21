import api from "../../utils/api";
import React, { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { BASE_URL_API } from "../../utils/contst";
import queryString from "query-string";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SearchResultsUser from "./SearchResultsUser";
import { ISearchUser } from "../../interfaces/search.interface";

interface ISearchProps {
    searchURL: string;
}

const SearchUser: React.FC<ISearchProps> = ({ searchURL }) => {
    const [searchValue, setSearchValue] = useState("");
    const [resutls, setResutls] = useState<ISearchUser[]>([]);
    const [showResults, setShowResults] = useState(false);

    const debounceValue = useDebounce<string>(searchValue, 800);

    useEffect(() => {
        if (debounceValue === "") return;
        handleSearch(debounceValue.toLowerCase().trim());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceValue]);

    useEffect(() => {
        if (searchValue.trim() === "" || resutls.length === 0) {
            setShowResults(false);
        } else {
            setShowResults(true);
        }
    }, [searchValue, resutls]);

    const handleSearch = async (value: string) => {
        const encodedSearchTerm = encodeURIComponent(value);
        try {
            const res = await api({
                method: "GET",
                url: searchURL + "/?q=" + encodedSearchTerm,
                withCredentials: true,
            });
            setResutls(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="relative">
            <div className="hidden w-[500px] group bg-slate-100 md:grid grid-cols-8 grid-rows-1  rounded-lg focus-within:border-blue-500">
                <div className="col-span-1 flex justify-center items-center">
                    <SearchRoundedIcon></SearchRoundedIcon>
                </div>
                <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-transparent col-span-7 px-4 pl-0 py-2 border-none outline-none "
                    type="text"
                    placeholder="Search..."
                />
            </div>

            {showResults && (
                <SearchResultsUser
                    searchData={resutls}
                    onClose={() => setShowResults(false)}
                ></SearchResultsUser>
            )}
        </div>
    );
};

export default SearchUser;
