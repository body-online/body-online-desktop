"use client";

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/navigation";
import Image from "next/image";
import { ExtendedUser } from '@/next-auth';
import { enterDropdown, enterModal } from '@/lib/constants';
import NavigationItem from './navigation-item';
import { CloseIcon } from './icons';
import { signOut } from 'next-auth/react';
import Divider from './divider';


export default function Navbar({ user }: { user?: ExtendedUser }) {
    const pathname = usePathname();
    // const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<any>(null);
    const handleOpen = () => {


        setIsOpen(true)
    }
    const handleClose = () => {


        setIsOpen(false);
    }


    // onclick outside handler
    const handleClickListener = (event: MouseEvent) => {
        let clickedInside;

        clickedInside =
            wrapperRef?.current && wrapperRef.current.contains(event.target);

        if (clickedInside && isOpen || !isOpen) return;
        return handleClose();
    };
    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            return handleClose();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            document.removeEventListener('keydown', handleEsc);
            document.removeEventListener("mousedown", handleClickListener);
            document.body.style.overflow = "auto";
        } else {
            document.addEventListener('keydown', handleEsc);
            document.addEventListener("mousedown", handleClickListener);
            document.body.style.overflow = "hidden";
        }
    }, [isOpen])



    return (
        <>
            <div className='flex w-full justify-center relative'>
                <div className="container px-default pt-4 relative z-50 h-min">
                    <div className="flex-between">
                        {/* User */}
                        <div>
                            <p className='text-white text-base sm:text-lg'>
                                Bienvenido
                                <span className="text-clime font-normal">
                                    {' '}{user?.name}
                                </span>
                            </p>
                            <div className='flex items-center gap-3'>
                                {/* <button onClick={() => router.refresh()} className='text-sm font-medium text-white'>BodyOnline</button> */}
                                <p className='text-slate-200 font-light hidden sm:block text-sm'>
                                    {new Date().toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Profile btn */}
                        <div className="relative" ref={wrapperRef}>

                            <button className='rounded_btn focus:ring-0 bg-white' onClick={() => handleOpen()}>
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

                                            {/* <button type='button' className="rounded_btn" onClick={handleClose}>
                                                <CloseIcon fill='fill-slate-500' />
                                            </button> */}
                                            {/* close indicator */}
                                            <motion.button
                                                variants={enterModal}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                type='button'
                                                onClick={() => handleClose()}
                                                className="px-1 py-1 rounded-md bg-slate-200 absolute top-2 right-2 z-20">
                                                <p className='text-[10px] sm:text-[12px] font-bold text-slate-500'>ESC</p>
                                            </motion.button>
                                        </div>

                                        <div className="px-6">
                                            <Divider />
                                        </div>

                                        <NavigationItem title='Inicio' href='/' selected={pathname === '/'} />
                                        {/* <NavigationItem title='Mi organización' href='/organizacion' selected={pathname === '/organizacion'} /> */}

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

                <div className="absolute top-0 left-0 w-full ">
                    <div className="relative flex justify-center h-[230px] md:h-[300px] overflow-hidden">
                        {/* Background */}
                        <div className="absolute bottom-0 rounded-[100%] -z-5
                            h-[170%] w-[130vw] md:w-[110vw]
                            bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]
                            from-cgreen via-cgreen/95 to-cgreen/50 bg-caqua overflow-hidden" >
                            <div className="absolute top-0 w-full bg-gradient-to-b from-cgreen/20 to-transparent h-full"></div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}


const ProfileImage = ({ url }: { url: ExtendedUser['image'] }) => {
    return (
        <div className="">
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5 fill-cgreen">
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
        </svg>

    )
}