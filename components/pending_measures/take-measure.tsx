'use client'

import { motion } from 'framer-motion';

import { CattleProps, NewEventButtonProps } from '@/lib/types';
import { EventIcon } from '../ui/icons';
import Modal from '../ui/modal';
import { useState } from 'react';
import Card from '../ui/card';
import { enterModal } from '@/lib/constants';
import EventForm from '../event-form';

type NewMeasureButtonProps = {
    cattleId: string;
    dueDate: Date;
    cattleCaravan: string;
}
export function TakeMeasure({ cattleId, dueDate, cattleCaravan }: NewMeasureButtonProps) {
    const todayDate = new Date()
    const parsedDate = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}T${String(todayDate.getHours()).padStart(2, '0')}:${String(todayDate.getMinutes()).padStart(2, '0')}`

    // event modal
    const [isOpen, setIsOpen] = useState(false)
    const handleClose = () => {
        return setIsOpen(false)
    }
    const handleOpen = () => {
        setIsOpen(true)
    }
    return (
        <>
            <button
                className='rounded_btn cgreen max-w-max focus:outline-none disabled:opacity-50'
                onClick={handleOpen}
            >

                <EventIcon fill='fill-clime' />
                <p>Carga rápida</p>

            </button>

            <Modal handleClose={handleClose} isOpen={isOpen}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Card headerLabel={`Cargar medicion para ${cattleCaravan}`}>
                        <div className="mt-6"></div>
                        <EventForm
                            cattles={[{
                                _id: cattleId, caravan: cattleCaravan, state: 'pregnant'
                            }]}
                            defaultValues={{
                                cattleId: cattleId,
                                eventDate: parsedDate,
                                eventType: 'body_measure'
                            }} />
                    </Card>
                </motion.div >
            </Modal >
        </>
    )
}

export default TakeMeasure