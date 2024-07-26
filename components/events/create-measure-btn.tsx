"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import { z } from 'zod';


import { PendingMeasureProps } from '@/lib/types';

import { CloseIcon, EventIcon, LoadingIcon, MiniAddIcon } from '../ui/icons';
import { LayoutBottom, LayoutHeader } from '../ui/default-layout';
import BlackOutModal from '../ui/blackout-modal';
import { detailsByEvent } from '@/lib/constants';
import { createEvent } from '@/actions/event';
import toast from 'react-hot-toast';

export function CreateMeasureButton({ notification }: { notification: PendingMeasureProps }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [measure, setMeasure] = useState<string>();
    const [observations, setObservations] = useState<string>();
    const measureDate = new Date(notification.expiresAt)?.toLocaleDateString("es-AR", { day: 'numeric', month: 'long' })

    async function handleCreateMeasure() {
        try {
            setIsSubmitting(true);
            const { data, error } = await createEvent({
                cattleId: notification.cattleId,
                eventDate: new Date(notification.expiresAt),
                eventType: 'body_measure',
                observations: observations,
                measure: measure,
                notificationId: notification._id
            })
            console.log({
                cattleId: notification.cattleId,
                eventDate: new Date(notification.expiresAt),
                eventType: 'body_measure',
                observations: observations,
                measure: measure,
                notificationId: notification._id
            })
            if (error) return toast.error(error)
            setIsOpen(false);
            setMeasure(undefined);
            setObservations(undefined);

        } catch (error) {
            toast.error('Error al cargar la medida')
        } finally {
            setIsSubmitting(false);
        }
    }

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


    return (
        <>
            <BlackOutModal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
                <LayoutHeader>
                    <div className='w-full space-y-2'>
                        {/* title */}
                        <div className="flex-between w-full">
                            <h2 className='semititle'>Crear medición</h2>
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
                {isSubmitting ? (
                    <div className="flex-center gap-2 py-default">
                        <LoadingIcon />
                        <p>Creando medición...</p>
                    </div>
                ) : (
                    <div className='h-full flex flex-col gap-y-3 overflow-auto w-full'>
                        <div className="py-default mx-auto max-w-2xl w-full px-default">
                            <div className="flex-between">
                                <h1 className='title'>{notification.caravan}</h1>
                                <div className="flex-center gap-1">
                                    <CalendarIcon />
                                    <p>{measureDate}</p>
                                </div>
                            </div>
                            <label htmlFor="measure">
                                <h3 className='semititle mb-3'>Indique el valor del caliper*</h3>
                                <div className="grid grid-cols-4 gap-y-2 gap-x-2 place-items-center">
                                    {detailsByEvent['body_measure'].map((measureObj, index) => {
                                        const measureValue = measureObj.value;
                                        const selected = measureValue === Number(measure)
                                        const minRange = Number(notification.minRange ?? 10)
                                        const maxRange = Number(notification.maxRange ?? 15)

                                        const skinny = measureValue < minRange
                                        const ideal = measureValue >= minRange && measureValue <= maxRange
                                        return (
                                            <button
                                                disabled={isSubmitting}
                                                className={`option_button flex-center
                                        ${skinny ? `bg-yellow-500 dark:bg-yellow-400` : ideal ? `bg-green-300 dark:bg-green-400` : `bg-orange-500 dark:bg-orange-400`}
                                        ${selected ? `ring-2 dark:ring-clime` : `opacity-70 hover:opacity-100`}
                                `}
                                                key={index}
                                                type='button'
                                                onClick={() => setMeasure(measureObj.label)}
                                            >
                                                <p className='text-2xl font-semibold dark:text-cblack'>
                                                    {measureObj.label}
                                                </p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </label>
                        </div>
                    </div>
                )}
                <LayoutBottom>
                    <div className='w-full max-w-2xl mx-auto'>
                        <div className='flex-between gap-4  items-stretch justify-between w-full'>
                            {/* prev */}
                            <button
                                disabled={isSubmitting}
                                onClick={() => { return setIsOpen(false) }}
                                className='rounded_btn bg-csemigreen dark:bg-clightgray md:max-w-max px-3'
                            >
                                <p className='text-white py-1'>Cancelar</p>
                            </button>

                            {/* next and submit */}

                            <button
                                disabled={isSubmitting || !measure}
                                className='rounded_btn bg-csemigreen dark:bg-clime md:max-w-max px-3'
                                type='button'
                                onClick={() => handleCreateMeasure()}
                            >
                                {isSubmitting ? (
                                    <LoadingIcon fill='fill-clime dark:fill-cblack' />
                                ) : (
                                    <div className='flex-center gap-1'>
                                        <p className='text-white py-1 dark:text-cblack'>Crear evento</p>
                                        <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </LayoutBottom >
            </BlackOutModal>

            <button
                onClick={() => { setIsOpen(true); }}
                className={`chip bg-csemigreen dark:bg-clime gap-2`}
            >
                <p className={`text-white dark:text-cblack font-medium`}>Crear medición</p>
                <EventIcon stroke='stroke-clime dark:stroke-cblack' />
            </button>
        </ >
    );
}

export default CreateMeasureButton;

const CalendarIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/5000/svg" viewBox="0 0 20 20" className="fill-cauqa dark:fill-clime w-4 h-4">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
            </svg>
        </div>
    )
}