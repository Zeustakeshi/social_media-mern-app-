import dotenv from "dotenv";
dotenv.config();

export const generateRandomImage = (q: string) => {
    return `https://source.unsplash.com/featured/?${q}`;
};

export const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(";").shift();
};

export const BASE_URL_API =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api"
        : "https://fakebook-4mvb.onrender.com/api";

export const BASE_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://fakebook-4mvb.onrender.com";
