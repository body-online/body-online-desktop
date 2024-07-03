"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from "next/navigation";
import { ExtendedUser } from '@/next-auth';
import { signOut } from 'next-auth/react';
import Image from "next/image";
import Link from 'next/link';

import { enterDropdown, navigationItems } from '@/lib/constants';
import { CloseIcon, FarmIcon, LogoutIcon, MenuIcon, UserIcon } from './icons';

import Divider from './divider';
import ThemeSwitch from './theme-switch';


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
    // const handleClickListener = (event: MouseEvent) => {
    //     let clickedInside;

    //     clickedInside =
    //         wrapperRef?.current && wrapperRef.current.contains(event.target);

    //     if (clickedInside && isOpen || !isOpen) return;
    //     return handleClose();
    // };
    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            return handleClose();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            document.removeEventListener('keydown', handleEsc);
            // document.removeEventListener("mousedown", handleClickListener);
            document.body.style.overflow = "auto";
        } else {
            document.addEventListener('keydown', handleEsc);
            // document.addEventListener("mousedown", handleClickListener);
            document.body.style.overflow = "hidden";
        }
    }, [isOpen])



    return (
        <>
            <div className="bg-cgreen py-3">
                <div className='flex-between px-default'>
                    <div className='flex items-center gap-2'>
                        <ProfileImage url={user?.image} type={user?.type} />
                        <p className='text-white font-semibold'>{user?.name}</p>
                        {/* <p className='text-white text-base font-bold'>
                            Body<span className='text-clime'>Online</span>
                        </p> */}
                    </div>


                    <button onClick={() => setIsOpen(!isOpen)} className='h-6 md:h-7 w-6 md:w-7 overflow-hidden rounded-full focus:ring-0 focus:outline-none bg-csemigreen border-slate-100/50 flex-center'>
                        <AnimatePresence mode='wait'>
                            {isOpen ?
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.1 }}
                                    key='close'
                                >
                                    <CloseIcon sizes='w-5 md:w-6 h-5 md:h-6' fill='fill-clime' />
                                </motion.div>
                                :
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.1 }}
                                    key='open'
                                >
                                    <MenuIcon fill='fill-clime' />
                                </motion.div>
                            }
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* navigation */}
            <div className="w-full bg-csemigreen z-30 sticky top-0">
                <div className="overflow-x-scroll no-scrollbar flex gap-1 items-center px-default border-b custom-border">
                    <div className="flex items-center pr-4">
                        {navigationItems.map((i, index) => {
                            var selected: boolean = i.href == pathname;

                            if (user?.type == 'operator' && i.title == 'Inicio') {
                                var selected: boolean = '/panel' == pathname;
                                return (
                                    <div key={index} className={`${selected ? ' border-b-clime' : 'border-transparent'} h-12 flex items-center border-b-2`}>
                                        <Link href={i.href} onClick={() => setIsOpen(false)}>
                                            <p
                                                className={`font-medium text-sm active:bg-transparent rounded-md px-3 py-1.5 transition-all
                                            ${selected ? 'text-clime dark:text-clime' : 'text-white dark:text-white opacity-50 active:opacity-100 md:hover:opacity-100'}`}
                                            >
                                                Inicio
                                            </p>
                                        </Link>
                                    </div>
                                )
                            }

                            return (
                                <div key={index} className={`${selected ? ' border-b-clime' : 'border-transparent'} h-12 flex items-center border-b-2`}>
                                    <Link href={i.href} onClick={() => setIsOpen(false)}>
                                        <p
                                            className={`font-medium text-sm active:bg-transparent rounded-md px-3 py-1.5 transition-all
                                            ${selected ? 'text-clime dark:text-clime' : 'text-white dark:text-white opacity-50 active:opacity-100 md:hover:opacity-100'}`}
                                        >
                                            {i.title}
                                        </p>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* config modal */}
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
                        className='fixed right-0 md:right-6 bottom-0 md:top-12 z-50
                        w-screen overflow-y-auto h-[calc(100vh-97px)] md:h-max 
                        md:rounded-2xl md:w-full md:max-w-xs
                        custom-gradient custom-border md:border'
                    >
                        <div className="container h-full flex flex-col">

                            <div className="h-full">
                                <p className='text-cblack dark:text-white font-semibold px-6 py-4 text-lg'>Menú</p>
                                <div className='flex-between gap-1 px-6 py-4'>
                                    <p className='font-medium'>{user?.email}</p>
                                    <ProfileImage url={user?.image} type={user?.type} />
                                </div>
                                <div className='flex-between gap-1 px-6 py-4'>
                                    <p className='text-sm text-start font-medium transition-all'>Tema</p>
                                    <ThemeSwitch />
                                </div>
                            </div>

                            <button type='button' className='px-6 py-5 border-t custom-border md:hover:bg-slate-100 dark:md:hover:bg-cblack w-full transition-all group' onClick={() => signOut()}>
                                <div className="flex items-center justify-between">
                                    <p className='text-sm text-start font-medium transition-all'>
                                        Cerrar sesión
                                    </p>
                                    <LogoutIcon fill='fill-black dark:fill-white transition-all rotate-90' />
                                </div>
                            </button>
                        </div>

                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
}


export const ProfileImage = ({ url, type }: { url: ExtendedUser['image']; type?: string }) => {
    return (
        <div
            className="h-6 md:h-7 w-6 md:w-7 overflow-hidden rounded-full focus:ring-0 focus:outline-none"
        >
            {!url ?
                <div className={`bg-gradient-to-tr ${type == 'operator' ? 'from-blue-600 via-blue-400 to-blue-300' : 'from-clime via-emerald-500 to-caqua'} h-full w-full`}>
                </div>
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