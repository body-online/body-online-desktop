'use client'

import { motion } from 'framer-motion';

import { NewEventButtonProps } from '@/lib/types';
import { EventIcon } from '../ui/icons';
import Modal from '../ui/modal';
import { useState } from 'react';
import Card from '../ui/card';
import { enterModal } from '@/lib/constants';
import EventForm from '../event-form';

export function AddEventBtn({ cattle, customButtom }: NewEventButtonProps) {
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
            <button disabled={cattle?.state == "death"}
                className='rounded-full focus:outline-none max-w-max disabled:opacity-50'
                onClick={handleOpen}
            >
                {customButtom ??
                    <div className='rounded_btn cgreen max-w-max'>
                        <EventIcon fill='fill-clime' />
                    </div>}
            </button>

            <Modal handleClose={handleClose} isOpen={isOpen}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Card headerLabel={`Crear evento para ${cattle.caravan}`}>
                        <div className="mt-6"></div>
                        <EventForm
                            cattles={[cattle]}
                            defaultValues={{
                                cattleId: cattle._id,
                                eventDate: parsedDate,
                            }} />
                    </Card>
                </motion.div >
            </Modal >
        </>
    )
}

export default AddEventBtn