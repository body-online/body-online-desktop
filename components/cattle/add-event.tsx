'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { z } from 'zod';

import { CattleProps, eventSchema, NewEventButtonProps } from '@/lib/types';
import { enterModal } from '@/lib/constants';

import BlackOutModal from '../ui/blackout-modal';
import { EventIcon } from '../ui/icons';
import EventForm from '../event-form';

export function AddEventBtn({ defaultCattle, mode }: NewEventButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
        return setIsOpen(false)
    }
    const handleOpen = () => {
        setIsOpen(true)
    }

    const {
        register,
        clearErrors,
        unregister,
        setValue,
        setError,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof eventSchema>>({ resolver: zodResolver(eventSchema), })

    return (
        <>
            <button
                onClick={handleOpen}
                className={`
                    ${mode == 'chip' ? (
                        'chip cgreen dark:bg-csemigreen flex-center gap-2'
                    ) : mode === 'mini' ? (
                        'rounded-full cgreen dark:bg-csemigreen h-6 sm:h-7 w-6 sm:w-7 flex-center'
                    ) : (
                        'primary-btn'
                    )}`
                }
            >
                {mode != 'mini' ? <p>Crear evento</p> : null}
                <EventIcon stroke="stroke-clime" />
            </button>
            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='h-full flex flex-col overflow-auto'
                >
                    <EventForm
                        defaultCattle={defaultCattle}
                        handleSubmit={handleSubmit}
                        clearErrors={clearErrors}
                        isSubmitting={isSubmitting}
                        register={register}
                        unregister={unregister}
                        setValue={setValue}
                        setError={setError}
                        errors={errors}
                        reset={reset}
                        watch={watch}
                        handleCloseEventsModal={handleClose}
                    />
                </motion.div >
            </BlackOutModal>
        </>
    )
}

export default AddEventBtn