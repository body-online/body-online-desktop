"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


import { enterDropdown } from '@/lib/constants';

import { CloseIcon } from '../ui/icons';
import Card from '../ui/card';

export type CardModalProps = {
    cardLabel: string;
    isSubmitting: boolean;
    children: React.ReactNode;
    buttonLabel?: string | React.ReactNode;
    buttonBg: string;
    buttonIcon: React.ReactNode;
}

export function CardModal({ cardLabel, isSubmitting, children, buttonLabel, buttonIcon, buttonBg }: CardModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = "hidden";
        } else {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen]);

    return (
        <div>
            <AnimatePresence mode='wait'>
                {isOpen ?
                    <motion.div
                        variants={enterDropdown}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key='modal'
                        className='fixed h-screen w-screen top-0 left-0 z-40 backdrop-blur-sm flex'
                    >
                        <div className="max-w-md mx-auto w-full mt-auto sm:my-auto">
                            <Card rounded='rounded-t-3xl sm:rounded-2xl overflow-hidden' paddings={''}>
                                <div className="flex-between p-3 md:p-6">
                                    <h2 className='semititle'>{cardLabel}</h2>

                                    <button
                                        disabled={isSubmitting}
                                        type='button' onClick={() => setIsOpen(false)}
                                        className='md:hover:opacity-100 md:opacity-50 disabled:opacity-30 transition-all'
                                    >
                                        <CloseIcon fill='fill-cgray dark:fill-white' />
                                    </button>
                                </div>

                                <div className="h-max">
                                    {children}
                                </div>

                            </Card>
                        </div>
                    </motion.div>
                    : <div key='null' />
                }
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(true)}
                className={`h-7 md:h-max w-7 md:w-max rounded_btn ${buttonBg} flex-center md:px-3`}
            >
                <div className='flex-center gap-1'>
                    {buttonLabel}
                    {buttonIcon}
                </div>
            </button>
        </div >
    );
}

export default CardModal;
