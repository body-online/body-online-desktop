'use client'

import { motion } from 'framer-motion';

import { CattleProps, NewEventButtonProps } from '@/lib/types';
import { EventIcon } from '../ui/icons';
import Modal from '../ui/modal';
import { useEffect, useState } from 'react';
import Card from '../ui/card';
import { enterModal } from '@/lib/constants';
import EventForm from '../event-form';
import BlackOutModal from '../ui/blackout-modal';

type NewMeasureButtonProps = {
    cattleId: string;
    dueDate: Date;
    cattleCaravan: string;
}
export function TakeMeasure({ cattleId, dueDate, cattleCaravan }: NewMeasureButtonProps) {
    // export function AddEventBtn({ defaultCattle, customButtom }: NewEventButtonProps) {

    // state of quick event action
    const [isOpen, setIsOpen] = useState(false)
    // state of select input search of cattle list
    const [isOpenCattles, setIsOpenCattles] = useState<boolean>(false)

    const handleClose = () => {
        if (isOpenCattles) return setIsOpenCattles(false)
        return setIsOpen(false)
    }
    const handleOpen = () => {
        setIsOpen(true)
    }

    useEffect(() => {
        if (isOpenCattles) {
            console.log('hidden')
            document.body.style.overflow = "hidden";
        }
        else document.body.style.overflow = "auto";
    }, [isOpenCattles, isOpen]);

    return (
        <>

            <button className="chip cgreen flex-center gap-1" onClick={handleOpen}>
                <p>Carga rapida</p>
                <EventIcon stroke="stroke-clime" />
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
                        // defaultCattle={defaultCattle}
                        isOpenCattles={isOpenCattles}
                        setIsOpenCattles={setIsOpenCattles}
                        handleClose={handleClose}
                    />
                </motion.div >
            </BlackOutModal>
        </>
    )
}

export default TakeMeasure