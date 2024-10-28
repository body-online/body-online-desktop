"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


import { enterDropdown } from '@/lib/constants';

import { CloseIcon } from '../ui/icons';
import Card from '../ui/card';
import CloseBtn from './close-btn';

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
            document.body.style.overflowY = "hidden";
        } else {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflowY = "auto";
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen]);

    return (
        <div className='-inset-0'>
            <AnimatePresence mode='wait'>
                {isOpen ?
                    <motion.div
                        variants={enterDropdown}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key='modal'
                        className='fixed h-[100vh] w-[100vw] top-0 left-0 z-40 backdrop-blur-sm flex'
                    >
                        <div className="max-w-md mx-auto w-full mt-auto sm:my-auto flex flex-col overflow-hidden">
                            <Card rounded='rounded-t-3xl sm:rounded-2xl overflow-hidden' paddings={''}>
                                <div className="flex-between px-4 pt-4">
                                    <h2 className='semititle'>{cardLabel}</h2>

                                    <CloseBtn
                                        handleClose={() => setIsOpen(false)}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {children}
                            </Card>
                        </div>
                    </motion.div>
                    : <div key='null' />
                }
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(true)}
                className={`rounded_btn ${buttonBg} flex-center md:px-3`}
            >
                {buttonLabel}
                {buttonIcon}
            </button>
        </div >
    );
}

export default CardModal;
