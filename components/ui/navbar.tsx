"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from "next/navigation";
import { ExtendedUser } from '@/next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

import { enterDropdown, navigationItems } from '@/lib/constants';
import { CloseIcon, LogoutIcon, MenuIcon } from './icons';

import ThemeSwitch from './theme-switch';


export default function Navbar({ user }: { user?: ExtendedUser }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            return setIsOpen(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = "auto";
        } else {
            window.scrollTo(0, 0)
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = "hidden";
        }
    }, [isOpen])

    if (!user) return null

    return (
        <>
            <div className="py-3 h-[60px] bg-white dark:bg-cblack">
                <div className='flex-between px-default'>
                    <div className='flex items-center gap-2'>
                        <ProfileImage url={user?.image} type={user?.type} />

                        <div>
                            <p className='text-sm dark:text-white font-semibold'>{user?.name}</p>
                            <p className='text-xs dark:text-white opacity-70 font-medium'>{user?.farmName}</p>
                        </div>
                    </div>


                    <button onClick={() => setIsOpen(!isOpen)} className='border custom-border rounded-full h-6 md:h-7 w-6 md:w-7 flex-center block'>
                        <AnimatePresence mode='wait'>
                            {isOpen ?
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.1 }}
                                    key='close'
                                >
                                    <CloseIcon fill="fill-cgray dark:fill-white" sizes='w-5 h-5' />
                                </motion.div>
                                :
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.1 }}
                                    key='open'
                                >
                                    <MenuIcon fill="fill-cgray dark:fill-white" />
                                </motion.div>
                            }
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* navigation */}
            <div className="w-full backdrop-blur-lg z-10 sticky top-0 bg-white dark:bg-transparent">
                <div className="overflow-x-scroll no-scrollbar flex gap-1 items-center px-default border-b custom-border">
                    <div className="flex items-center pr-4">
                        {navigationItems.map((i, index) => {
                            var selected: boolean = i.href == pathname;

                            if (user?.type == 'operator' && i.title == 'Inicio') {
                                var selected: boolean = '/panel' == pathname;
                                return (
                                    <div key={index} className={`${selected ? ' border-caqua dark:border-b-clime' : 'border-transparent'} h-12 flex items-center border-b-2`}>
                                        <Link href={i.href} onClick={() => setIsOpen(false)}>
                                            <p
                                                className={`font-medium text-sm active:bg-transparent rounded-md px-3 py-1.5 transition-all
                                            ${selected ? 'dark:text-clime text-cblack' : 'text-cgray dark:text-white opacity-50 active:opacity-100 md:hover:opacity-100'}`}
                                            >
                                                Inicio
                                            </p>
                                        </Link>
                                    </div>
                                )
                            }

                            return (
                                <div key={index} className={`${selected ? ' border-caqua dark:border-b-clime' : 'border-transparent'} h-12 flex items-center border-b-2`}>
                                    <Link href={i.href} onClick={() => setIsOpen(false)}>
                                        <p
                                            className={`font-medium text-sm active:bg-transparent rounded-md px-3 py-1.5 transition-all
                                            ${selected ? 'dark:text-clime text-cblack' : 'text-cgray dark:text-white opacity-50 active:opacity-100 md:hover:opacity-100'}`}
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
                        className='fixed right-0 md:right-8 bottom-0 md:top-12 z-20
                        w-screen overflow-y-auto h-[calc(100vh-60px)] md:h-max 
                        md:rounded-2xl md:w-full md:max-w-xs
                        bg-white dark:bg-cblack custom-border md:border border-t'
                    >
                        <div className="container h-full flex flex-col">

                            <div className="h-full py-4">
                                <div
                                    className='flex flex-col items-center gap-2 px-3 border custom-border bg-slate-50 dark:bg-cgray rounded-xl py-4 mx-4'
                                >
                                    <ProfileImage width='w-10' height='h-10' url={user?.image} type={user?.type} />
                                    <div className='text-center'>
                                        <p className='font-medium'>{user?.name}</p>
                                        <p className='opacity-40'>{user?.email}</p>
                                    </div>
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
                                    <LogoutIcon fill='fill-cgray dark:fill-white transition-all rotate-90' />
                                </div>
                            </button>
                        </div>

                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
}


export const ProfileImage = ({ url, type, width, height }: { url: ExtendedUser['image']; type?: string; width?: string; height?: string }) => {
    return (
        <div
            className={`
                overflow-hidden rounded-full focus:ring-0 focus:outline-none
                ${height ?? 'h-6 md:h-7'} ${width ?? 'w-6 md:w-7'}`
            }
        >
            <div className={`bg-gradient-to-tr ${type == 'operator' ? 'from-blue-600 via-blue-400 to-blue-300' : 'from-clime via-emerald-500 to-caqua'} h-full w-full`}>
            </div>
            {/* {!url ?
                :
                <Image
                    height={height ?? 100}
                    width={width ?? 100}
                    src={url}
                    alt="profile"
                />
            } */}
        </div>
    );
};