export const generateRandomImage = (q: string) => {
    return `https://source.unsplash.com/featured/?${q}`;
};

export const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(";").shift();
};

export const BASE_URL_API = "https://fakebook-4mvb.onrender.com/api";
export const BASE_URL = "https://fakebook-4mvb.onrender.com";

// DEV;
// export const BASE_URL_API = "http://localhost:3000/api";
// export const BASE_URL = "http://localhost:3000";
