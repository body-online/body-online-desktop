"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import { z } from 'zod';


import { CattleProps, eventSchema } from '@/lib/types';

import { CloseIcon, EventIcon, MiniAddIcon } from '../ui/icons';
import { LayoutHeader } from '../ui/default-layout';
import BlackOutModal from '../ui/blackout-modal';
import EventForm from '../event-form';

export function CreateEventButton({ mode, defaultCattle }: { mode?: 'chip' | 'mini'; defaultCattle?: CattleProps }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => { // esc handler and disable background overflow
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = "auto";
            document.removeEventListener('keydown', handleEsc);
        }

        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    const {
        register,
        unregister,
        setValue,
        setError,
        clearErrors,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof eventSchema>>({ resolver: zodResolver(eventSchema), })


    return (
        <>
            <BlackOutModal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
                <LayoutHeader>
                    <div className='w-full space-y-2'>
                        {/* title */}
                        <div className="flex-between w-full">
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
                    </div>
                </LayoutHeader>

                <EventForm
                    defaultCattle={defaultCattle}
                    register={register}
                    unregister={unregister}
                    setValue={setValue}
                    setError={setError}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    errors={errors}
                    reset={reset}
                    watch={watch}
                    clearErrors={clearErrors}
                    handleCloseEventsModal={() => setIsOpen(false)}
                />
            </BlackOutModal>

            <button
                onClick={() => { setIsOpen(true); }}
                className={`chip bg-csemigreen dark:bg-clime gap-2`}
            >
                <p className={`text-white dark:text-cblack font-medium`}>Crear evento</p>
                <EventIcon stroke='stroke-clime dark:stroke-cblack' />
            </button>
        </ >
    );
}

export default CreateEventButton;