'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { z } from 'zod';

import { CattleProps, eventSchema, NewEventButtonProps } from '@/lib/types';
import { enterModal } from '@/lib/constants';

import BlackOutModal from '../ui/blackout-modal';
import { CloseIcon, EventIcon } from '../ui/icons';
import EventForm from '../event-form';
import { LayoutBody, LayoutHeader } from '../ui/default-layout';

export function AddEventBtn({ defaultCattle }: NewEventButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
        reset();
        return setIsOpen(false)
    }
    const handleOpen = () => {
        reset();
        setIsOpen(true);
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
            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <LayoutHeader>
                    <div className="flex-between w-full container">
                        <h2 className='semititle'>Crear evento</h2>
                        <button
                            type='button'
                            disabled={isSubmitting}
                            onClick={() => setIsOpen(false)}
                            className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30'
                        >
                            <CloseIcon fill='fill-cgray dark:fill-white' />
                        </button>
                    </div>
                </LayoutHeader>

                <EventForm
                    defaultCattle={defaultCattle}
                    handleSubmit={handleSubmit}
                    // clearErrors={clearErrors}
                    isSubmitting={isSubmitting}
                    register={register}
                    unregister={unregister}
                    setValue={setValue}
                    // setError={setError}
                    errors={errors}
                    reset={reset}
                    watch={watch}
                    handleCloseEventsModal={handleClose}
                />
            </BlackOutModal>


            <button
                onClick={handleOpen}
                className='h-max w-max rounded_btn bg-csemigreen dark:bg-clime flex-center px-3 gap-1'
            >
                <div className='flex-center gap-1'>
                    <p className={`text-white dark:text-cblack font-medium`}>Crear evento</p>
                    <EventIcon stroke='stroke-clime dark:stroke-cblack' />
                </div>
            </button>

        </>
    )
}

export default AddEventBtn