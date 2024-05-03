"use client";

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/navigation";
import Image from "next/image";
import { ExtendedUser } from '@/next-auth';
import { enterDropdown } from '@/lib/constants';
import NavigationItem from './navigation-item';
import { CloseIcon } from './icons';
import { signOut } from 'next-auth/react';
import Divider from './divider';


export default function Navbar({ user }: { user?: ExtendedUser }) {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<any>(null);
    const handleClose = () => {
        setIsOpen(false);
    }
    // onclick outside handler
    const handleClickListener = (event: MouseEvent) => {
        let clickedInside;

        clickedInside =
            wrapperRef?.current && wrapperRef.current.contains(event.target);

        if (clickedInside) return;
        else handleClose();
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickListener);

        return () => {
            document.removeEventListener("mousedown", handleClickListener);
        };
    }, []);


    useEffect(() => {
        document.body.style.overflow = !isOpen
            ? "auto"
            : "hidden";
    }, [isOpen])


    return (
        <>
            <div className='relative flex justify-center h-[230px] md:h-[300px]'>
                <div className="container px-default pt-4 md:pt-6 relative z-50 h-min">
                    <div className="flex-between">
                        {/* User */}
                        <div>
                            <p className='text-white text-lg lg:text-[20px]'>
                                Bienvenido <span className="text-clime">{user?.name}</span>
                            </p>
                            <div className='flex items-center gap-3'>
                                <button onClick={() => router.refresh()} className='text-sm font-medium text-white'>BodyOnline</button>
                                <p className='text-slate-300 opacity-90 text-ligth text-sm'>
                                    {new Date().toLocaleDateString("es-MX", { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Profile btn */}
                        <div className="relative" ref={wrapperRef}>

                            <button onClick={() => setIsOpen(!isOpen)}>
                                <ProfileImage url={user?.image} />
                            </button>

                            <AnimatePresence
                                initial={false}
                                onExitComplete={() => null}
                            >
                                {isOpen ? (
                                    <motion.div onClick={(e) => e.stopPropagation()}
                                        variants={enterDropdown}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className='dropdown'
                                    >
                                        <div className='w-full px-2 md:px-3 pt-3 md:pt-4 flex-between'>
                                            <p className="text-start text-sm font-medium text-slate-700">{user?.email}</p>

                                            <button type='button' className="rounded_btn" onClick={handleClose}>
                                                <CloseIcon fill='fill-slate-500' />
                                            </button>
                                        </div>

                                        <div className="px-6">
                                            <Divider />
                                        </div>

                                        <NavigationItem title='Inicio' href='/' selected={pathname === '/'} />
                                        <NavigationItem title='Mi organización' href='/organizacion' selected={pathname === '/organizacion'} />

                                        <div className="px-6">
                                            <Divider />
                                        </div>

                                        <button type='button' className='menu_navigation_item' onClick={() => signOut()}>
                                            <div className="flex-center">

                                                <p className='text-sm text-start'>Cerrar sesión</p>
                                            </div>
                                        </button>

                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Background */}
                <div className="absolute bottom-0 rounded-[100%] -z-5
                            h-[170%] w-[130vw] md:w-[110vw]
                            bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]
                            from-cgreen via-cgreen/95 to-cgreen/30 bg-caqua overflow-hidden" >
                    <div className="absolute top-0 w-full bg-gradient-to-b from-cgreen/20 to-transparent h-full"></div>
                </div>
            </div >


        </>
    );
}


const ProfileImage = ({ url }: { url: ExtendedUser['image'] }) => {
    return (
        <div className="relative rounded-full overflow-hidden p-2 bg-cgreen active:bg-cgreen/50 md:hover:bg-cgreen/50 transition-all">
            {!url ?
                <div className="flex-center"><UserIcon /></div>
                :
                <Image
                    height={100}
                    width={100}
                    src={url}
                    alt="profile"
                />
            }
        </div>
    );
};

const UserIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5 fill-white">
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
//                         <p className='font-medium'>{data?.user?.name}</p>
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