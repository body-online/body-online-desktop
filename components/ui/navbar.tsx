"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NavigationItem from "./navigation-item";
import { NavigationItemProps } from '@/lib/types';
import { navigationItems } from '@/lib/constants';
import Divider from './divider';


export default function Nav() {
    const wrapperRef = useRef<any>(null);
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [toggleDropdown, setToggleDropdown] = useState(false);

    const handleCloseDropdown = () => {
        setToggleDropdown(false);
    }

    // onclick outside handler
    const handleClickListener = (event: MouseEvent) => {
        let clickedInside;

        clickedInside =
            wrapperRef?.current && wrapperRef.current.contains(event.target);

        if (clickedInside) return;
        else handleCloseDropdown();
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickListener);

        return () => {
            document.removeEventListener("mousedown", handleClickListener);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = !toggleDropdown
            ? "auto"
            : "hidden";
    }, [toggleDropdown])


    return (
        <div className="sticky top-0 z-30 w-full">
            <div className="bg-white h-16 border-b flex items-center">
                <div className="flex-between h-full w-full max-w-7xl mx-auto px-4 md:px-12">
                    <Link
                        href="/"
                        onClick={() => router.refresh()}
                        className="flex-center gap-2"
                    >
                        {/* <Logo /> */}
                        <span className="w-max">
                            <h1 className='text-lg font-bold'>BodyOnline</h1>
                            <div className="w-full h-[3px] relative bg-gradient-to-r from-cgreen via-caqua to-clime -mt-1 overflow-hidden" />
                        </span>
                    </Link>

                    {status === "authenticated" ? (
                        <div className="mx-4 gap-6 h-full hidden lg:flex">
                            {navigationItems.map((i, index: number) => {
                                return (
                                    <NavigationItem
                                        key={index}
                                        title={i.title}
                                        href={i.href}
                                        selected={pathname === i.href}
                                    />
                                );
                            })}
                        </div>
                    ) : null}

                    {status === "loading" ? (
                        <div className="rounded-full h-7 w-7 animate-pulse bg-slate-200" />
                    ) : status === "authenticated" ? (
                        <div className="relative flex-center">
                            <div className="hidden gap-2 items-center lg:flex">
                                <div className="flex-end gap-2">
                                    <p className="text-base font-semibold truncate leading-5">
                                        {session?.user?.name}
                                    </p>
                                    <ProfileImage />
                                    <button
                                        className="rounded_btn"
                                        onClick={() => {
                                            handleCloseDropdown();
                                            signOut();
                                        }}
                                    >
                                        <LogOutIcon />
                                    </button>
                                </div>
                            </div>

                            <button
                                className="lg:hidden"
                                onClick={() => {
                                    setToggleDropdown(!toggleDropdown);
                                }}
                            >
                                <ProfileImage />
                                {/* <MenuIcon /> */}
                            </button>

                            {/* dropdown card */}
                            {toggleDropdown ? (
                                <div className="dropdown" ref={wrapperRef}>
                                    <div className="flex items-center justify-between gap-2 p-3">
                                        <div className="flex gap-2 items-center">
                                            <ProfileImage />
                                            <p className="subtitle truncate">{session?.user?.name}</p>
                                        </div>
                                        <CloseIcon action={handleCloseDropdown} />
                                    </div>

                                    <Divider />

                                    <div className="flex flex-col lg:hidden">
                                        {navigationItems.map((i: NavigationItemProps, index: number) => {
                                            return (
                                                <NavigationItem
                                                    key={index}
                                                    title={i.title}
                                                    href={i.href}
                                                    selected={pathname === i.href}
                                                    handleClose={() => handleCloseDropdown()}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="flex-end p-4 lg:hidden">
                                        <button
                                            className="flex-center gap-1 px-4 py-3 rounded-lg w-full md:w-max border hover:bg-slate-50 active:bg-slate-50 transition-all"
                                            onClick={() => {
                                                handleCloseDropdown();
                                                signOut();
                                            }}
                                        >
                                            <LogOutIcon />
                                            <p className='font-medium text-xs md:text-sm  text-slate-950'>Cerrar Sesión</p>
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </div >
    );
}

const Logo = () => {
    return (
        <div className='bg-orange-500 rounded-lg p-[5px]'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="fill-white w-5 h-5">
                <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 31.372 31.372 0 0 0-7.86 3.83.75.75 0 0 1-.84 0 31.508 31.508 0 0 0-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 0 1 3.305-2.033.75.75 0 0 0-.714-1.319 37 37 0 0 0-3.446 2.12A2.216 2.216 0 0 0 6 9.393v.38a31.293 31.293 0 0 0-4.28-1.746.75.75 0 0 1-.254-1.285 41.059 41.059 0 0 1 8.198-5.424ZM6 11.459a29.848 29.848 0 0 0-2.455-1.158 41.029 41.029 0 0 0-.39 3.114.75.75 0 0 0 .419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 1 0 1.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 0 1 3.095 2.348.75.75 0 0 0 .992 0 26.547 26.547 0 0 1 5.93-3.95.75.75 0 0 0 .42-.739 41.053 41.053 0 0 0-.39-3.114 29.925 29.925 0 0 0-5.199 2.801 2.25 2.25 0 0 1-2.514 0c-.41-.275-.826-.541-1.25-.797a6.985 6.985 0 0 1-1.084 3.45 26.503 26.503 0 0 0-1.281-.78A5.487 5.487 0 0 0 6 12v-.54Z" clipRule="evenodd" />
            </svg>

        </div>
    );
};
const LogOutIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
        </svg>
    );
};
const CloseIcon = ({ action }: { action: Function }) => {
    return (
        <div
            className="cursor-pointer hover:bg-slate-200 rounded-full p-[1px] transition-all"
            onClick={() => action()}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
            >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
        </div>
    );
};
const ProfileImage = () => {
    const { data: session, status } = useSession();

    return (
        <div className="relative rounded-full overflow-hidden p-2 bg-clime">
            {!session?.user?.image ?
                <div className="flex-center"><UserIcon /></div>
                :
                <Image
                    height={100}
                    width={100}
                    src={session?.user?.image}
                    alt="profile"
                />
            }
        </div>
    );
};
const MenuIcon = () => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
            >
                <path
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
};

const UserIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="black" className="w-5 h-5">
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
        </svg>

    )
}
// 'use client';

// import logout from '@/actions/logout';
// import Link from 'next/link';
// import React from 'react'
// import toast from 'react-hot-toast';
// import { UserIcon } from './icons';
// import { useSession } from 'next-auth/react';

// const Navbar = () => {
//     const session = useSession()

//     return (
//         <div className='w-full border-b bg-white'>
//             <div className="flex items-center justify-between h-20 container px-default">
// <div className="w-max">
//     <Link href="/">
//         <h1 className='text-lg font-bold'>BodyOnline</h1>
//     </Link>
//     <div className="w-full h-[3px] relative bg-gradient-to-r from-cgreen via-caqua to-clime -mt-1 overflow-hidden" />
// </div>

//                 <div className="flex items-center gap-2">
//                     <div className='flex-center gap-2'>
//                         <p className='font-medium'>{session?.data?.user?.name}</p>
//                         <div className="h-8 w-8 bg-cgreen rounded-full flex-center"><UserIcon /></div>
//                     </div>
//                     <form className='w-min h-min' action={async () => {
//                         try {
//                             logout()
//                         } catch (error) {
//                             toast.error('Error al desloguearse')
//                         }
//                     }}>
//                         <button type='submit' className='px-3 py-2 rounded-full w-max bg-black hover:bg-slate-800 transition-all'>
//                             <p className="text-sm text-white font-medium">
//                                 Cerrar sesión
//                             </p>
//                         </button>
//                     </form>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default Navbar