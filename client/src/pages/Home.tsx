import { useEffect } from "react";
import CreatePost from "../components/CreatePost";
import Posts from "../components/Posts";
import Stories from "../components/Stories";
import { useAuth } from "../context/authContext";

const Home = () => {
    const auth = useAuth();

    useEffect(() => {
        document.title = "Fakebook";
    }, []);

    return (
        <div className="md:p-4 p-3">
            <Stories></Stories>
            <CreatePost></CreatePost>
            <Posts userID={auth?.currentUser?.id}></Posts>
        </div>
    );
};

export default Home;
