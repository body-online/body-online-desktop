"use client";

import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

import { PendingMeasureProps } from '@/lib/types';
import { detailsByEvent } from '@/lib/constants';
import { createEvent } from '@/actions/event';

import { CloseIcon, EventIcon, LoadingIcon, MiniAddIcon } from '../ui/icons';
import { LayoutBottom, LayoutHeader } from '../ui/default-layout';
import BlackOutModal from '../ui/blackout-modal';
import StepIndicator from '../ui/step-indicator';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function CreateMeasureButton({ notification }: { notification: PendingMeasureProps }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [measure, setMeasure] = useState<string>();
    const [observations, setObservations] = useState<string>();

    function changePage(newPage: number) {
        if ('pageNotifications') {
            const params = new URLSearchParams(searchParams);
            const currentPage = params.get('pageNotifications');
            params.set('pageNotifications', `${newPage}`);

            return router.replace(`${pathname}?${params.toString()}`);
        }
    };
    //     const measureDate = new Date(notification.expiresAt)?.toLocaleDateString("es-AR", { day: 'numeric', month: 'long' })

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
            if (error) return toast.error(error)
            setIsOpen(false);
            setMeasure(undefined);
            setObservations(undefined);
            // changePage(1)
            router.refresh()
            toast.success(`Medición creada`)

        } catch (error) {
            toast.error('Error al cargar la medición')
        } finally {
            setIsSubmitting(false);
        }
    }
    function reset() {
        setMeasure(undefined)
        setObservations(undefined)
        setMeasure(undefined)
    }
    const handleClose = () => {
        reset();
        return setIsOpen(false)
    }
    const handleOpen = () => {
        reset();
        setIsOpen(true);
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
            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <LayoutHeader>
                    <div className="flex-between w-full container">
                        <h2 className='semititle'>Medición corporal</h2>
                        <button
                            type='button'
                            disabled={isSubmitting}
                            onClick={handleClose}
                            className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30'
                        >
                            <CloseIcon fill='fill-cgray dark:fill-white' />
                        </button>
                    </div>
                </LayoutHeader>

                <div className='h-full flex flex-col overflow-auto'>
                    <div className="sticky top-0 z-50 w-full custom-gradient border-b custom-border">
                        <div className="overflow-auto  container">
                            <div className="flex divide-x divide-slate-200 dark:divide-clightgray items-center w-max h-max">
                                <StepIndicator
                                    label='Caravana'
                                    value={notification.caravan}
                                    active={true}
                                    step={'1'}
                                />
                                <StepIndicator
                                    label='Fecha'
                                    value={notification.expiresAt ? new Date(notification.expiresAt).toLocaleDateString() : undefined}
                                    active={true}
                                    step={'4'}
                                />
                                <StepIndicator
                                    label='Medida'
                                    value={measure}
                                    active={true}
                                    step={'1'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto w-full py-default px-default max-w-2xl">
                        {isSubmitting ? (
                            <div className="flex-center h-full gap-2 py-default">
                                <LoadingIcon />
                                <p>Creando medición...</p>
                            </div>
                        ) : (
                            <div className='h-full flex flex-col gap-y-3 overflow-auto w-full'>
                                <div className="py-default mx-auto max-w-2xl w-full px-default">
                                    <label htmlFor="measure">
                                        <div className="grid grid-cols-4 gap-y-2 gap-x-2 place-items-center">
                                            {detailsByEvent['body_measure'].map((measureObj, index) => {
                                                const measureValue = measureObj.value;
                                                const selected = measureValue === Number(measure)
                                                const minRange = Number(notification.minRange)
                                                const maxRange = Number(notification.maxRange)

                                                const skinny = measureValue < minRange
                                                const ideal = measureValue >= minRange && measureValue <= maxRange
                                                return (
                                                    <button
                                                        disabled={isSubmitting}
                                                        className={`px-2 md:px-4 py-1 min-h-14 flex items-center rounded-xl disabled:opacity-50 w-full transition-all
                                        ${skinny ? `bg-yellow-400 dark:bg-yellow-400` : ideal ? `bg-green-300 dark:bg-green-400` : `bg-orange-500 dark:bg-orange-400`}
                                        ${selected ? `ring-2 ring-csemigreen dark:ring-clime` : `opacity-60 active:opacity-100 md:hover:opacity-100`}
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

                                            {/* {detailsByEvent['body_measure'].map((measureObj, index) => {
                                                const measureValue = measureObj.value;
                                                const selected = measureValue === Number(measure)
                                                const minRange = Number(notification.minRange)
                                                const maxRange = Number(notification.maxRange)

                                                const skinny = measureValue < minRange
                                                const ideal = measureValue >= minRange && measureValue <= maxRange
                                                return (
                                                    <button
                                                        disabled={isSubmitting}
                                                        className={`option_button flex-center
                                        ${selected ? `ring-2 dark:ring-clime` : `opacity-70 hover:opacity-100`}
                                `}
                                                        // ${skinny ? `bg-yellow-500 dark:bg-yellow-400` : ideal ? `bg-green-300 dark:bg-green-400` : `bg-orange-500 dark:bg-orange-400`}
                                                        key={index}
                                                        type='button'
                                                        onClick={() => setMeasure(measureObj.label)}
                                                    >
                                                        <p className='text-2xl font-semibold dark:text-white'>
                                                            {measureObj.label}
                                                        </p>
                                                    </button>
                                                )
                                            })} */}
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

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
                                        <p className='text-white py-1 dark:text-cblack'>Crear medición</p>
                                        <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </LayoutBottom >
            </BlackOutModal>

            <div className="ml-auto">
                <button
                    onClick={handleOpen}
                    className='h-max w-max rounded_btn bg-csemigreen dark:bg-clime flex-center px-3 gap-1'
                >
                    <p className={`text-white dark:text-cblack font-medium`}>Medir</p>
                    <EventIcon stroke='stroke-clime dark:stroke-cblack' />
                </button>
            </div>
        </>
    );
}

export default CreateMeasureButton;

const CalendarIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/5000/svg" viewBox="0 0 20 20" className="opacity-50 fill-clightgray dark:fill-white w-4 h-4">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
            </svg>
        </div>
    )
}