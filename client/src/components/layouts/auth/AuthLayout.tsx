import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="">
            <div className="flex flex-col justify-start items-center md:grid grid-cols-5 h-screen">
                <div className="md:col-span-2  w-full h-full bg-blue-500 md:p-10 p-8 flex flex-col justify-center items-center">
                    <h2 className="font-black text-white md:text-7xl text-5xl md:p-8 p-5">
                        faKebook
                    </h2>
                    <div className="flex-1 h-full w-full flex justify-center items-center">
                        <p className="text-2xl md:text-4xl text-white font-bold md:text-left text-center md:max-w-[60%]">
                            Connect with friends and the world around you
                        </p>
                    </div>
                </div>
                <div className="col-span-3 h-full flex justify-center items-center">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
