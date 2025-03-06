"use client";

import { useEffect, useState } from "react";

import { getHistoricalEvents } from "@/data/events";
import { EventInterface } from "@/lib/types";

import { BodyMeasureIcon, CalendarIcon, CattleBirthIcon, ClockMiniIcon, CloseIcon, DeathIcon, ListIcon, LoadingIcon, NotPregnantIcon, PregnantIcon } from "../ui/icons";
import { LayoutBody, LayoutHeader } from "../ui/default-layout";
import BlackOutModal from "../ui/blackout-modal";
import InfoMessage from "../ui/info";
import Card from '../ui/card';


export function HistoricalBtn({ cattleId, cattleCaravan }: { cattleId: string; cattleCaravan: string; }) {
    const [historical, setHistorical] = useState<EventInterface[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string>();


    async function fetchHistorical() {
        setIsLoading(true)
        setError(undefined)

        try {
            const { data, error } = await getHistoricalEvents({ cattleId })
            if (error) return setError(error)
            if (data && Array.isArray(data)) return setHistorical(data)
        } catch (error: any) {
            setError(error?.data?.response?.message ?? 'Error al obtener el hist')
        } finally {
            setIsLoading(false)
        }
    }

    function handleOpen() { setIsOpen(true); fetchHistorical() }


    useEffect(() => { // esc handler and disable background overflow
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.body.style.overflowY = "hidden";
            document.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflowY = "auto";
            document.removeEventListener('keydown', handleEsc);
        }

        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    return (
        <>
            <BlackOutModal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
                <LayoutHeader>
                    <div className="flex-between w-full container">
                        <h2 className='semititle'>Histórico de {cattleCaravan}</h2>
                        <button
                            type='button'
                            onClick={() => setIsOpen(false)}
                            className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30'
                        >
                            <CloseIcon fill='fill-cgray dark:fill-white' />
                        </button>
                    </div>
                </LayoutHeader>

                <LayoutBody>
                    {isLoading ? (
                        <div className="flex-center h-full gap-2">
                            <LoadingIcon />
                            <p className='text-base'>Buscando eventos...</p>
                        </div>
                    ) : error ? (
                        <InfoMessage type='warning'
                            title='Ha ocurrido un error al obtener los eventos'
                            subtitle={`Hemos experimentado un contratiempo al obtener el Histórico de la caravana ${cattleCaravan}`}
                        />
                    ) : historical && historical?.length > 0 ? (
                        <div className='space-y-4 py-default px-default'>
                            {
                                historical?.map((event, index) => {
                                    const formattedDate = new Date(event.eventDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' });

                                    const hideRepeatedEventDate = new Date(historical?.[index - 1]?.eventDate)?.getDate() === new Date(event.eventDate)?.getDate()

                                    return (
                                        <>
                                            {!hideRepeatedEventDate &&
                                                <div className="bg-csemigreen dark:bg-clightgray rounded-full py-4 border custom-border mb-3 sticky top-3 sm:top-6">
                                                    <div className="flex-center gap-2 h-full w-full">
                                                        <CalendarIcon fill='fill-slate-200 dark:fill-slate-500' />
                                                        <p className='text-sm text-white'>
                                                            {formattedDate}
                                                        </p>
                                                    </div>
                                                </div>
                                            }

                                            <Card paddings=''>
                                                <div className="flex-between gap-3 items-center p-4">

                                                    {event.eventType == 'pregnant' ? (
                                                        <div className="flex items-center gap-1">
                                                            <PregnantIcon fill='fill-caqua dark:fill-clime' />
                                                            <p className='text-base font-medium'>Servicio</p>
                                                        </div>
                                                    ) : event.eventType == 'not_pregnant' ? (
                                                        <div className="flex items-center gap-1">
                                                            <NotPregnantIcon stroke='stroke-caqua dark:stroke-clime' />
                                                            <p className='text-base font-medium'>No preñez</p>
                                                        </div>
                                                    ) : event.eventType == 'body_measure' ? (
                                                        <div className="flex items-center gap-1">
                                                            <BodyMeasureIcon fill='fill-caqua dark:fill-clime' />
                                                            <p className='text-base font-medium'>Medición Corporal</p>
                                                        </div>
                                                    ) : event.eventType == 'cattle_birth' ? (
                                                        <div className="flex items-center gap-1">
                                                            <CattleBirthIcon stroke='stroke-caqua dark:stroke-clime' />
                                                            <p className='text-base font-medium'>Parto</p>
                                                        </div>
                                                    ) : event.eventType == 'death' ? (
                                                        <div className="flex items-center gap-1">
                                                            <DeathIcon fill='fill-caqua dark:fill-clime' />
                                                            <p className='text-base font-medium'>Muerte</p>
                                                        </div>
                                                    ) : null
                                                    }

                                                    <div className="flex max-w-max gap-1 items-center px-1 py-1 rounded-full bg-slate-200    dark:bg-clightgray dark:border custom-border">
                                                        <ClockMiniIcon fill='fill-slate-500 dark:fill-slate-500' />
                                                        <p className="text-xs font-medium dark:text-white pr-1">
                                                            {String(new Date(event.eventDate)?.getHours()).padStart(2, '0')}:
                                                            {String(new Date(event.eventDate)?.getMinutes()).padStart(2, '0')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {(event?.measure || event?.eventDetail || event?.observations) &&
                                                    <div className="border-t custom-border divide-y custom-divide">
                                                        {event?.measure ?
                                                            <div className='p-4'>
                                                                <p className="input_label">Medida</p>
                                                                <div className='w-full'>
                                                                    <p className='text-lg text-slate-600 leading-6 font-normal'>{event?.measure}</p>
                                                                </div>
                                                            </div> : null
                                                        }
                                                        {event?.eventDetail ?
                                                            <div className='p-4'>
                                                                <p className="input_label">
                                                                    {event?.eventType == 'cattle_birth' ? 'Número de crías' : event?.eventType == 'death' ? 'Motivo de muerte' : 'Detalle'}
                                                                </p>
                                                                <div className='w-full'>
                                                                    <p className='text-lg text-slate-600 leading-6 font-normal'>
                                                                        {event?.eventDetail}
                                                                    </p>
                                                                </div>
                                                            </div> : null
                                                        }
                                                        {event?.observations ?
                                                            <div className='p-4'>
                                                                <p className="input_label">Observaciones</p>
                                                                <div className='w-full'>
                                                                    <p className='text-lg text-slate-600 leading-6 font-normal'>{event?.observations}</p>
                                                                </div>
                                                            </div> : null
                                                        }
                                                    </div>
                                                }
                                            </Card>
                                        </>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <div className="flex-center h-full gap-2">
                            <InfoMessage
                                type='censored'
                                title='No hemos encontrado eventos'
                                subtitle={`El individuo ${cattleCaravan} no posee eventos registrados`}
                            />
                        </div>
                    )}
                </LayoutBody>
            </BlackOutModal >

            <button
                onClick={handleOpen}
                className='h-max w-max rounded_btn bg-csemigreen dark:bg-clime flex-center px-3 gap-1'
            >
                <p className={`text-white dark:text-cblack font-medium`}>Histórico</p>
                <ListIcon fill='fill-clime dark:fill-cblack' />

            </button>
        </ >
    );
}

export default HistoricalBtn;


const LoadingHistoricalSkeleton = () => {
    return (
        <div className="grid gap-9 h-full animate-pulse">
            <div className="w-full space-y-2">

                <div className="w-full h-10 rounded-lg bg-slate-200 dark:bg-clightgray"></div>
                <div className="flex-between gap-3 pb-6 border-b custom-border">
                    <div className="flex-between gap-2">
                        <div className="min-w-10 min-h-10 rounded-full bg-slate-200 dark:bg-clightgray mr-4"></div>
                        <div className="w-1/3 h-6 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    </div>
                    <div className="w-32 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                </div>

            </div>
            <div className="w-full space-y-2">

                <div className="w-full h-10 rounded-lg bg-slate-200 dark:bg-clightgray"></div>
                <div className="flex-between gap-3 pb-6 border-b custom-border">
                    <div className="flex-between gap-2">
                        <div className="min-w-10 min-h-10 rounded-full bg-slate-200 dark:bg-clightgray mr-4"></div>
                        <div className="w-1/3 h-6 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    </div>
                    <div className="w-32 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                </div>

            </div>
            <div className="w-full space-y-2">

                <div className="w-full h-10 rounded-lg bg-slate-200 dark:bg-clightgray"></div>
                <div className="flex-between gap-3 pb-6 border-b custom-border">
                    <div className="flex-between gap-2">
                        <div className="min-w-10 min-h-10 rounded-full bg-slate-200 dark:bg-clightgray mr-4"></div>
                        <div className="w-1/3 h-6 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    </div>
                    <div className="w-32 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                </div>

            </div>

        </div>
    )
}