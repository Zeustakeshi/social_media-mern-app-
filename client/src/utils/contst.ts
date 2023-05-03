export const generateRandomImage = (q: string) => {
    return `https://source.unsplash.com/featured/?${q}`;
};

export const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(";").shift();
};

export const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;
export const BASE_URL = import.meta.env.VITE_BASE_URL;
