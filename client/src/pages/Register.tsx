import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Register = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const auth = useAuth();
    const navigation = useNavigate();
    useEffect(() => {
        document.title = "Register";
    }, []);

    useEffect(() => {
        if (auth?.currentUser?.id) {
            navigation("/");
        }
    }, [auth?.currentUser?.id]);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            (!userName.trim() &&
                !password.trim() &&
                !confirmPassword.trim() &&
                !email.trim()) ||
            password.trim() !== confirmPassword.trim()
        )
            return;
        try {
            await auth?.register(userName, email, password);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form
            onSubmit={handleRegister}
            action=""
            className="w-full md:max-w-[500px] px-5 md:px-0 flex flex-col md:gap-6 gap-5 justify-start items-center"
        >
            <h2 className="font-semibold md:text-5xl text-4xl md:mb-4 my-5 text-blue-500">
                Register
            </h2>
            <div className="w-full flex flex-col justify-start items-start gap-5">
                <div className="w-full h-full bg-slate-200 rounded-lg">
                    <input
                        className="rounded-[inherit] px-6 py-4 w-full h-full outline-none border-none bg-transparent"
                        type="text"
                        placeholder="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="w-full h-full bg-slate-200 rounded-lg">
                    <input
                        className="rounded-[inherit] px-6 py-4 w-full h-full outline-none border-none bg-transparent"
                        type="text"
                        placeholder="Email or phone number"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="w-full h-full bg-slate-200 rounded-lg">
                    <input
                        className="rounded-[inherit] px-6 py-4 w-full h-full outline-none border-none bg-transparent"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="w-full h-full bg-slate-200 rounded-lg">
                    <input
                        className="rounded-[inherit] px-6 py-4 w-full h-full outline-none border-none bg-transparent"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className="capitalize md:text-sm text-xs text-slate-300 px-3 font-medium">
                by clicking register, you agree to our terms, data policy, and
                cookies policy. you may receie SMS notifications from us and can
                opt out any time.
            </div>
            <button className="bg-blue-500 font-semibold mt-5 text-white text-xl px-5 py-3 rounded-lg w-full md:min-w-[400px]">
                Register
            </button>
            <div className="my-5 text-lg text-gray-400">
                Already have an account ?
                <NavLink
                    to="/login"
                    className="text-blue-500 font-bold inline-block p-3"
                >
                    Login now
                </NavLink>
            </div>
        </form>
    );
};

export default Register;
