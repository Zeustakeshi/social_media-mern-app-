import { useEffect, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import { getCookie } from "../utils/contst";

const useSocket = (endpoint: string, query?: any) => {
    const [socket, setSocket] = useState<Socket>();
    useEffect(() => {
        const newSocket = io(endpoint, {
            withCredentials: true,
            query: query,
            auth: { authorization: `Bearer ${getCookie("access_token")}` },
        });
        setSocket(newSocket);
        return () => {
            newSocket.close();
        };
    }, [endpoint]);

    return socket;
};

export default useSocket;
