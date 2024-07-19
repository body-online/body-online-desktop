'use client'

import { motion } from 'framer-motion';

import { NewEventButtonProps } from '@/lib/types';
import { EventIcon } from '../ui/icons';
import { useState } from 'react';
import { enterModal } from '@/lib/constants';
import EventForm from '../event-form';
import BlackOutModal from '../ui/blackout-modal';

export function AddEventBtn({ defaultCattle, mode }: NewEventButtonProps) {
    const [isOpenCattles, setIsOpenCattles] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
        if (isOpenCattles) return setIsOpenCattles(false)
        return setIsOpen(false)
    }
    const handleOpen = () => {
        setIsOpen(true)
    }
    const buttonClassName = () => {
        return mode == 'chip' ? 'chip cgreen flex-center gap-2' : mode === 'mini' ? 'rounded-full cgreen dark:bg-csemigreen h-6 sm:h-7 w-6 sm:w-7 flex-center' : 'primary-btn md:max-w-max'
    }
    return (
        <>
            <button
                onClick={handleOpen}
                className={buttonClassName()}
            >
                {mode != 'mini' ? <p>Crear evento</p> : null}
                <EventIcon stroke='stroke-clime dark:stroke-cblack' />
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