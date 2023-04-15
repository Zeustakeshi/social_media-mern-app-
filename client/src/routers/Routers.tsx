import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../components/layouts/auth/AuthLayout";
import ChatLayout from "../components/layouts/chat/ChatLayout";
import MainLayout from "../components/layouts/home/MainLayout";
import { useAuth } from "../context/authContext";
import Chat from "../pages/Chat";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Register from "../pages/Register";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const auth = useAuth();

    const currentUser = auth?.currentUser;
    if (!currentUser?.userName) return <Navigate to="/login"></Navigate>;
    return children;
};

const Router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainLayout></MainLayout>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/",
                element: <Home></Home>,
            },
            {
                path: "/profile/:id",
                element: <Profile></Profile>,
            },
        ],
    },
    {
        path: "/",
        element: <AuthLayout></AuthLayout>,
        children: [
            {
                path: "/login",
                element: <Login></Login>,
            },
            {
                path: "/register",
                element: <Register></Register>,
            },
        ],
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <ChatLayout></ChatLayout>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/chat/:id",
                element: <Chat></Chat>,
            },
        ],
    },
]);

export default Router;
