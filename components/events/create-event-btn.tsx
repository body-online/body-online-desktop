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

export function CreateEventButton({ mode, defaultCattle }: { mode?: 'chip' | 'mini'; defaultCattle: CattleProps }) {
    const [isOpen, setIsOpen] = useState(false);
    const [cattleSelected, setCattleSelected] = useState<CattleProps>()

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
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof eventSchema>>({ resolver: zodResolver(eventSchema), })


    return (
        <div>
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
                    register={register}
                    setValue={setValue}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    errors={errors}
                    reset={reset}
                    watch={watch}
                    handleCloseEventsModal={() => setIsOpen(false)}
                />
            </BlackOutModal>

            <button
                onClick={() => { setIsOpen(true); }}
                className={`chip bg-cgray dark:bg-clightgray gap-2`}
            >
                <p className={`text-white`}>Crear evento</p>
                <EventIcon stroke='stroke-clime' />
            </button>
        </div >
    );
}

export default CreateEventButton;

// 'use client'

// import { motion } from 'framer-motion';

// import { NewEventButtonProps } from '@/lib/types';
// import { EventIcon } from '../ui/icons';
// import { useState } from 'react';
// import { enterModal } from '@/lib/constants';
// import EventForm from '../event-form';
// import BlackOutModal from '../ui/blackout-modal';

// export function AddEventBtn({ defaultCattle, mode }: NewEventButtonProps) {
//     const [isOpenCattles, setIsOpenCattles] = useState<boolean>(false)
//     const [isOpen, setIsOpen] = useState(false)

//     const handleClose = () => {
//         if (isOpenCattles) return setIsOpenCattles(false)
//         return setIsOpen(false)
//     }
//     const handleOpen = () => {
//         setIsOpen(true)
//     }
//     const buttonClassName = () => {
//         return mode == 'chip' ? 'chip cgreen flex-center gap-2' : mode === 'mini' ? 'rounded-full cgreen dark:bg-csemigreen h-6 sm:h-7 w-6 sm:w-7 flex-center' : 'primary-btn md:max-w-max'
//     }
//     return (
//         <>
//             <button
//                 onClick={handleOpen}
//                 className={buttonClassName()}
//             >
//                 {mode != 'mini' ? <p>Crear evento</p> : null}
//                 <EventIcon stroke='stroke-clime dark:stroke-cblack' />
//             </button>

// <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
//     <motion.div
//         onClick={(e) => e.stopPropagation()}
//         variants={enterModal}
//         initial="hidden"
//         animate="visible"
//         exit="exit"

//     >
//         <EventForm
//             defaultCattle={defaultCattle}
//             isOpenCattles={isOpenCattles}
//             setIsOpenCattles={setIsOpenCattles}
//             handleClose={handleClose}
//         />
//     </motion.div >
// </BlackOutModal>
//         </>
//     )
// }

// export default AddEventBtn