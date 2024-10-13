"use client";

function getInitials(name?: string) {
    if (!name) return "";
    return name.match(/(\b\S)?/g)?.join("");
}

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExtendedUser } from '@/next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

import { modalBackground, navigationItems } from '@/lib/constants';
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
            document.body.style.overflowY = "auto";
        } else {
            window.scrollTo(0, 0)
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflowY = "hidden";
        }
    }, [isOpen])

    if (!user) return null

    return (
        <>
            <div className="py-3 h-[60px] bg-white dark:bg-cgray border-b custom-border">
                <div className='flex-between px-default'>
                    <div className='flex items-center gap-2 h-8 overflow-hidden'>
                        <ProfileImage user={user} height='h-8' width='w-8' />

                        <div>
                            <p className='text-sm dark:text-white font-semibold'>{user?.name}</p>
                            <p className='text-xs dark:text-white opacity-70 font-medium'>{user?.farmName}</p>
                        </div>
                    </div>


                    <div className="flex gap-2">
                        <ThemeSwitch />
                        <button onClick={() => setIsOpen(!isOpen)} className='border custom-border rounded-full flex-center block p-2 w-8 h-8'>
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
            </div>

            {user.farmId && (
                <>
                    {/* navigation */}
                    {(pathname?.match(/\//g) || []).length <= 1 && (
                        <div className="w-full backdrop-blur-lg z-30 sticky top-0 bg-white/90 dark:bg-cgray/90 border-b custom-border">
                            <div className="overflow-x-scroll no-scrollbar flex gap-1 items-center">
                                <div className="flex items-center px-default first:-ml-3">
                                    {navigationItems.map((i, index) => {
                                        if (user?.type == 'operator' && i.href != '/tareas') return null
                                        var selected: boolean = Boolean((i.title === 'Inicio' && pathname === '/') || (i.title != 'Inicio' && pathname.includes(i.href)));

                                        return (
                                            <div key={index} className={`${selected ? ' border-caqua dark:border-clime' : 'border-transparent'} h-12 flex items-center border-b-2`}>
                                                <Link href={i.href} onClick={() => setIsOpen(false)}>
                                                    <p
                                                        className={`font-semibold text-sm rounded-md px-3 py-1.5 transition-all
                                            ${selected ? 'dark:text-clime text-cblack' : 'text-cgray dark:text-white opacity-50 active:opacity-80 md:hover:opacity-100'}`}
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
                    )}
                </>
            )}

            {/* config modal */}
            <AnimatePresence
                initial={false}
                onExitComplete={() => null}
            >
                {isOpen ? (
                    <motion.div onClick={(e) => e.stopPropagation()}
                        variants={modalBackground}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className='fixed right-2 md:right-8 top-14 z-30 overflow-y-auto h-max 
                        rounded-2xl w-full max-w-xs
                        bg-white dark:bg-cgray custom-border border'
                    >
                        <div className="container h-full flex flex-col">

                            <div className="h-full py-3">
                                <div className="flex items-center justify-between mb-2 mx-3">
                                    <p className="text-lg font-semibold">Menú</p>
                                </div>

                                <div
                                    className='flex flex-col items-center gap-2 px-3 border custom-border dark:bg-clightgray rounded-xl py-4 mx-3 md:mx-4'
                                >
                                    <ProfileImage user={user} width='w-8' height='h-8' />
                                    <div className='text-center'>
                                        <p className='font-semibold'>{user?.name}</p>
                                        <p className='opacity-40 font-medium'>{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <button type='button' className='px-6 py-5 border-t custom-border md:hover:bg-slate-80 dark:md:hover:bg-cblack w-full transition-all group' onClick={() => signOut()}>
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


export const ProfileImage = ({ user, width, height }: { user: ExtendedUser; width?: string; height?: string }) => {
    const type = user?.type ?? "operator"

    return (
        <div
            className={`
                overflow-hidden rounded-full focus:ring-0 focus:outline-none
                ${type == 'operator' ? 'from-blue-600 via-blue-400 to-blue-300' : 'from-clime via-emerald-500 to-caqua'} 
                ${height ?? 'h-7 md:h-8'} ${width ?? 'w-7 md:w-8'}`
            }
        >
            <div className={`bg-gradient-to-tr h-full w-full flex-center`}>
                <p className='font-bold text-white text-xs md:text-sm tracking-tight'>
                    {getInitials(user?.name)}
                </p>
            </div>
        </div>
    );
};