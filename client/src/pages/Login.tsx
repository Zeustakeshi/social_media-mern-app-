import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { BASE_URL_API } from "../utils/contst";
const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const navigation = useNavigate();
    useEffect(() => {
        document.title = "Login";
    }, []);

    useEffect(() => {
        if (auth?.currentUser?.id) {
            navigation("/");
        }
    }, [auth?.currentUser?.id]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userName.trim() || !password.trim()) return;
        setLoading(true);
        try {
            await auth?.login(userName, password);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <form
            onSubmit={handleLogin}
            className="w-full max-w-[500px] px-5 md:px-0 flex flex-col md:gap-6 gap-5 justify-start items-center"
        >
            <h2 className="font-semibold md:text-5xl text-4xl md:mb-4 my-5 text-blue-500">
                Login
            </h2>
            <div className="w-full flex flex-col justify-start items-start gap-5 ">
                <div className="w-full h-full bg-slate-200 rounded-lg">
                    <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="rounded-[inherit] px-6 py-4 w-full h-full outline-none border-none bg-transparent"
                        type="text"
                        placeholder="Email or phone number"
                    />
                </div>
                <div className="w-full h-full bg-slate-200 rounded-lg">
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-[inherit] px-6 py-4 w-full h-full outline-none border-none bg-transparent"
                        type="password"
                        placeholder="Password"
                    />
                </div>
            </div>
            <button className="bg-blue-500 font-semibold mt-5 text-white text-xl px-5 py-3 rounded-lg  md:min-w-[400px] w-full">
                {loading ? "Loading..." : "Login"}
            </button>
            <div className="my-5 text-lg text-gray-400">
                You are new member ?
                <NavLink
                    to="/register"
                    className="text-blue-500 font-bold inline-block p-3"
                >
                    Register now
                </NavLink>
            </div>
        </form>
    );
};

export default Login;
