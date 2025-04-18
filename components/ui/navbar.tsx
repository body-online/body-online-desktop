"use client";

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExtendedUser } from '@/next-auth';
import { signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';

import { modalBackground, navigationItems } from '@/lib/constants';
import { CloseIcon, LoadingIcon, LogoutIcon, MenuIcon } from './icons';
import { useSync } from '@/context/SyncContext';
import ThemeSwitch from './theme-switch';
import ChipIsOnline from './chip-online';

function eliminarDiacriticos(texto: string) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getInitials(name?: string) {
    if (!name) return "";
    return eliminarDiacriticos(name).match(/(\b\S)?/g)?.join("");
}


export default function Navbar() {
    // const { isSyncing, isOnline, syncAmount } = useSync();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession()
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

    if (!session?.user) return null

    return (
        <>
            <div className="py-3 h-[60px] bg-white dark:bg-cgray">
                <div className='flex-between px-default'>
                    <div className='flex items-center gap-2 max-h-8 h-8'>
                        <ProfileImage user={session.user} height='h-8' width='w-8' />

                        <div>
                            <p className='text-xs text-gray-500 dark:text-gray-500'>
                                {session.user.type === 'owner' ? 'Administrador' : 'Operador'}
                            </p>
                            {/* <ChipIsOnline isOnline={isOnline} /> */}
                            <p className="font-medium text-sm">
                                {session.user.name}
                            </p>
                        </div>
                    </div>


                    <div className="flex gap-2">
                        <ThemeSwitch />

                        <button onClick={() => setIsOpen(!isOpen)} className='action_button'>
                            <AnimatePresence mode='wait' initial={false}>
                                {isOpen ?
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, rotate: 90 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.7, rotate: -90 }}
                                        transition={{ duration: 0.08, ease: 'easeIn' }}
                                        key='close'
                                    >
                                        <CloseIcon fill="fill-cgray dark:fill-white" sizes='w-5 h-5' />
                                    </motion.div>
                                    :
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, rotate: 90 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.7, rotate: -90 }}
                                        transition={{ duration: 0.08, ease: 'easeIn' }}
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

            {session.user.farmId && session.user.type === "owner" ? (
                <div className='bg-white dark:bg-cgray'>
                    {/* navigation */}
                    {(pathname?.match(/\//g) || []).length <= 1 && (
                        <div className="w-full backdrop-blur-lg z-30 sticky top-0 bg-transparent border-b custom-border">
                            <div className="overflow-x-scroll no-scrollbar flex gap-1 items-center">
                                <div className="flex items-center px-default first:-ml-3">
                                    {navigationItems.map((i, index) => {

                                        var selected: boolean = Boolean((i.title === 'Inicio' && pathname === '/') || (i.title != 'Inicio' && pathname.includes(i.href)));

                                        return (
                                            <div key={index} className={`${selected ? ' border-caqua dark:border-clime' : 'border-transparent'} h-12 flex items-center border-b-2`}>
                                                <Link href={i.href} onClick={() => {
                                                    setIsOpen(false)
                                                }}>
                                                    {/* <div>
                                                        {i.icon}
                                                    </div> */}
                                                    <p
                                                        className={`font-normal text-base rounded-md px-3 py-1.5 transition-all
                                            ${selected ? 'dark:text-clime text-cblack' : 'text-cgray dark:text-white opacity-70 active:opacity-80 md:hover:opacity-100'}`}
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
                </div>
            ) : null}

            {/* config modal */}
            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {isOpen ? (
                    <div className="h-screen w-screen fixed top-0 left-0 z-50" onClick={() => setIsOpen(false)}>

                        <motion.div onClick={(e) => e.stopPropagation()}
                            variants={modalBackground}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className='fixed right-2 md:right-8 top-14 z-50 overflow-y-auto h-max 
                        rounded-2xl w-full max-w-xs
                        bg-white dark:bg-cgray custom-border border'
                        >


                            <div className="h-full py-4 space-y-2 mx-4">
                                <div
                                    className='flex flex-col items-start gap-2 px-3 bg-slate-100 dark:bg-clightgray rounded-xl py-4'
                                >
                                    <div className="flex-center w-max gap-3">
                                        <ProfileImage user={session.user} width='w-9' height='h-9' />
                                        <div className='text-start'>
                                            <p className='font-semibold'>{session.user?.name}</p>
                                            <p className='opacity-70 text-xs font-normal'>{session.user?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-end">
                                    <button
                                        type='button'
                                        className="rounded_btn bg-slate-100 dark:bg-clightgray"
                                        onClick={() => {
                                            // if (isOnline)
                                            return signOut()
                                            // else
                                            //     toast('No puedes cerrar sesión estando offline')
                                        }}
                                    >
                                        <p className='text-sm text-start font-medium transition-all py-1'>
                                            Cerrar sesión
                                        </p>
                                        <LogoutIcon fill='fill-cblack dark:fill-white transition-all rotate-90' />
                                    </button>
                                </div>
                            </div>

                            {/* <div className='px-6 py-5 border-t custom-border w-full transition-all'>
                               
                            </div> */}

                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence >
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