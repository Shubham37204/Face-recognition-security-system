import React from 'react';
import { NavLink } from "react-router-dom";
import "./AdminPanel.css";

const AdminPanel = () => {
    return (
        <div style={{ marginTop: "6pc" }}>
            <h1 className="text-center text-3xl font-bold mb-8">Admin Panel</h1>
            <div class="grid gap-x-8 gap-y-4 grid-cols-3 mr-10">
                <div>
                    <NavLink to="/Account">
                        <div class="relative grid h-[18rem] ml-6 w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
                            <div class="bg-image1 absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                                <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
                            </div>
                            <div class="relative p-6 px-6 py-14 md:px-12">
                                <h2 class="mb-6 block font-sans text-4xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                                    Create Account
                                </h2>
                            </div>
                        </div>
                    </NavLink>
                </div>
                <div >
                    <NavLink to="/SearchAccount">
                        <div class="relative grid h-[18rem] ml-6 w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
                            <div class="bg-image2 absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                                <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
                            </div>
                            <div class="relative p-6 px-6 py-14 md:px-12">
                                <h2 class="mb-6 block font-sans text-4xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                                    Search Account
                                </h2>
                            </div>
                        </div>
                    </NavLink>
                </div>
                <div>
                    <NavLink to="/ModelGallery">
                        <div class="relative grid h-[18rem] ml-6 w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
                            <div class="bg-image3 absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                                <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
                            </div>
                            <div class="relative p-6 px-6 py-14 md:px-12">
                                <h2 class="mb-6 block font-sans text-4xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                                ModelGallery
                                </h2>
                            </div>
                        </div>
                    </NavLink>
                </div>
                <div style={{ marginTop: "6pc" }}>
                    <NavLink to="/MatchFace">
                        <div class="relative grid h-[18rem] ml-6 w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
                            <div class="bg-image4 absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-image-create-account2 bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                                <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
                            </div>
                            <div class="relative p-6 px-6 py-14 md:px-12">
                                <h2 class="mb-6 block font-sans text-4xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                                    Edit Account
                                </h2>
                            </div>
                        </div>
                    </NavLink>
                </div>
                <div style={{ marginTop: "6pc" }}>
                    <NavLink to="/DeleteAccount">
                        <div class="relative grid h-[18rem] ml-6 w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
                            <div class="bg-image5 absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                                <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
                            </div>
                            <div class="relative p-6 px-6 py-14 md:px-12">
                                <h2 class="mb-6 block font-sans text-4xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                                    Delete Account
                                </h2>
                            </div>
                        </div>
                    </NavLink>
                </div>
                <div style={{ marginTop: "6pc" }}>
                    <NavLink to="/Timeline">
                        <div class="relative grid h-[18rem] ml-6 w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
                            <div class="bg-image6 absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                                <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
                            </div>
                            <div class="relative p-6 px-6 py-14 md:px-12">
                                <h2 class="mb-6 block font-sans text-4xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                                General Timeline
                                </h2>
                            </div>
                        </div>
                    </NavLink>
                </div>
                <div style={{ marginTop: "6pc" }}>
                    <NavLink to="/LoginTimeline">
                        <div class="relative grid h-[18rem] ml-6 w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
                            <div class="bg-image7 absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                                <div class="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
                            </div>
                            <div class="relative p-6 px-6 py-14 md:px-12">
                                <h2 class="mb-6 block font-sans text-4xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                               Login Timeline
                                </h2>
                            </div>
                        </div>
                    </NavLink>
                </div>
            </div>

        </div >
    )
}

export default AdminPanel