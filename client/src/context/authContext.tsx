import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import { BASE_URL_API } from "../utils/contst";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface IAuthContext {
    currentUser: IUser | undefined;
    login: (userName: string, password: string) => void;
    register: (userName: string, email: string, password: string) => void;
    logout: () => void;
    setCurrentUser: React.Dispatch<React.SetStateAction<IUser | {}>>;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<IUser | {}>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    const register = async (
        userName: string,
        email: string,
        password: string
    ) => {
        const res = await axios({
            method: "POST",
            url: BASE_URL_API + "/auth/register",
            data: {
                userName,
                email,
                password,
            },
            withCredentials: true,
            credentials: 'include',
        });
        setCurrentUser(res.data);
    };

    const login = async (userName: string, password: string) => {
        const res = await axios({
            method: "POST",
            url: BASE_URL_API + "/auth/login",
            data: {
                email: userName,
                password,
            },
            withCredentials: true,
            credentials: 'include',
        });
        setCurrentUser(res.data);
    };

    const logout = async () => {
        await axios({
            method: "POST",
            url: BASE_URL_API + "/auth/logout",
            withCredentials: true,
        });
        setCurrentUser({});
    };

    const values = { currentUser, setCurrentUser, login, register, logout };

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (typeof context === "undefined")
        throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export { useAuth, AuthProvider };
