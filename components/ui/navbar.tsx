"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from "next/navigation";
import { ExtendedUser } from '@/next-auth';
import { signOut } from 'next-auth/react';
import Image from "next/image";
import Link from 'next/link';

import { enterDropdown, navigationItems } from '@/lib/constants';
import { FarmIcon, LogoutIcon } from './icons';

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
            <div className="bg-cgreen py-3">
                <div className='flex-between px-default'>
                    <div>
                        <div className='flex items-center gap-5'>
                            <p className='text-white text-base font-bold hidden md:block'>
                                Body<span className='text-clime'>Online</span>
                            </p>

                            <div className="flex-center gap-1">
                                <p className='text-white text-sm font-bold w-max'>{user?.name}</p>
                                <div className="flex-center gap-1 rounded-full bg-white/5 px-3 h-7">
                                    <FarmIcon />
                                    <p className='text-white font-medium text-sm'>
                                        San Fernando
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="relative h-7" ref={wrapperRef}>
                        <ProfileImage url={user?.image} onClick={() => handleOpen()} />

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
                                    className='dropdown top-8 right-0'
                                >
                                    <div className='w-full px-2 md:px-3 pt-3 md:pt-4 flex-between'>
                                        <p className="text-start text-sm font-medium text-slate-700">{user?.email}</p>
                                    </div>

                                    {/* <NavigationItem title='Inicio' href='/' selected={pathname === '/'} /> */}

                                    <div className="px-6">
                                        <Divider />
                                    </div>

                                    <button type='button' className='px-4 py-3 hover:bg-slate-100 w-full transition-all group' onClick={() => signOut()}>
                                        <div className="flex items-center justify-between">
                                            <p className='text-sm text-start font-medium transition-all text-slate-500 group-hover:text-black'>
                                                Cerrar sesión
                                            </p>
                                            <LogoutIcon fill='fill-slate-500 group-hover:fill-black transition-all rotate-90' />
                                        </div>
                                    </button>

                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                    </div>
                </div>
            </div>


            <div className="w-full h-full bg-csemigreen border-b border-cgreen z-30 sticky top-0 py-2">
                <div className="overflow-x-scroll no-scrollbar flex gap-1 items-center h-full">
                    <div className="flex-center sticky left-0 bg-gradient-to-r from-csemigreen/90 via-csemigreen/70 to-csemigreen/5 h-full z-20 px-default backdrop-blur-sm">
                        <p className="font-semibold text-sm text-slate-200 py-2">Navegación</p>
                    </div>
                    <div className="flex items-center gap-2 pr-4 snap-x">
                        {navigationItems.map((i, index) => {
                            var selected: boolean = i.href == pathname;

                            return (
                                <div className='snap-center' key={index}>
                                    <Link href={i.href}>
                                        <p
                                            className={`font-medium text-sm text-white active:bg-transparent md:hover:bg-white/5 rounded-md px-3 py-1.5 transition-all
                                            ${selected ? 'bg-white/10' : 'opacity-50 active:opacity-100 md:hover:opacity-100'}`}
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
        </>
    );
}


const ProfileImage = ({ url, onClick }: { url: ExtendedUser['image']; onClick: MouseEventHandler<HTMLButtonElement> }) => {
    return (
        <button
            className="h-7 w-7 overflow-hidden rounded-full focus:ring-0 focus:outline-none"
            onClick={onClick}
        >
            {!url ?
                <div className="bg-gradient-to-tr from-clime via-emerald-500 to-caqua h-full w-full">
                </div>
                :
                <Image
                    height={100}
                    width={100}
                    src={url}
                    alt="profile"
                />
            }
        </button>
    );
};