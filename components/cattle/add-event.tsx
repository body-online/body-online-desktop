'use client'

import { motion } from 'framer-motion';

import { NewEventButtonProps } from '@/lib/types';
import { EventIcon } from '../ui/icons';
import { useState } from 'react';
import { enterModal } from '@/lib/constants';
import EventForm from '../event-form';
import BlackOutModal from '../ui/blackout-modal';

export function AddEventBtn({ defaultCattle, customButtom, children }: NewEventButtonProps) {
    const [isOpenCattles, setIsOpenCattles] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
        if (isOpenCattles) return setIsOpenCattles(false)
        return setIsOpen(false)
    }
    const handleOpen = () => {
        setIsOpen(true)
    }

    return (
        <>
            <button onClick={handleOpen}>
                {children ??
                    <div className={`chip cgreen flex-center gap-1'`}>
                        <p>Crear evento</p>
                        <EventIcon fill="fill-clime" />
                    </div>
                }
            </button>

            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"

                >
                    <EventForm
                        defaultCattle={defaultCattle}
                        isOpenCattles={isOpenCattles}
                        setIsOpenCattles={setIsOpenCattles}
                        handleClose={handleClose}
                    />
                </motion.div >
            </BlackOutModal>
        </>
    )
}

export default AddEventBtn