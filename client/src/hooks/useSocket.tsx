import { useEffect, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

const useSocket = (endpoint: string) => {
    const [socket, setSocket] = useState<Socket>();
    useEffect(() => {
        const newSocket = io(endpoint, { withCredentials: true });
        setSocket(newSocket);
        return () => {
            newSocket.close();
        };
    }, [endpoint]);

    return socket;
};

export default useSocket;
