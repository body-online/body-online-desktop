"use client";

import { useEffect, useState } from "react";
import BlackOutModal from "../ui/blackout-modal";
import { LayoutHeader } from "../ui/default-layout";
import { CloseIcon, ListIcon, MiniAddIcon } from "../ui/icons";
import { getHistoricalEvents } from "@/data/events";
import { EventProps } from "@/lib/types";
import InfoMessage from "../ui/info";
import EventItem from "./event-item";


export function HistoricalBtn({ cattleId, cattleCaravan, mode }: { cattleId: string; cattleCaravan: string; mode: 'chip' | 'mini' }) {
    const [historical, setHistorical] = useState<EventProps[]>();
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
        <div>
            <BlackOutModal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
                <LayoutHeader>
                    <div className='w-full space-y-2'>
                        {/* title */}
                        <div className="flex-between w-full">
                            <h2 className='semititle'>Histórico de {cattleCaravan}</h2>
                            <button
                                type='button'
                                onClick={() => setIsOpen(false)}
                                className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30'
                            >
                                <CloseIcon fill='fill-cgray dark:fill-white' />
                            </button>
                        </div>
                    </div>
                </LayoutHeader>

                <div className='py-default px-default h-full w-full bg-gradient-to-b dark:from-cgray/50'>
                    <div className="flex flex-col gap-y-4 max-w-2xl mx-auto">
                        {isLoading ?
                            <LoadingHistoricalSkeleton /> :
                            error ?
                                <InfoMessage type='warning'
                                    title='Ha ocurrido un error al obtener los eventos'
                                    subtitle={`Hemos experimentado un contratiempo al obtener el Histórico de la caravana ${cattleCaravan}`}
                                /> :
                                historical && historical?.length > 0 ?
                                    <>
                                        {historical?.map((event, index) => {
                                            const prevEvent = historical?.[index - 1] ?? undefined

                                            return <EventItem event={event} prevEventDate={new Date(prevEvent?.eventDate)} key={index} />
                                        })}

                                    </>
                                    :
                                    <InfoMessage
                                        type='censored'
                                        title='No hemos encontrado eventos'
                                        subtitle={`El individuo ${cattleCaravan} no posee eventos registrados`}
                                    />
                        }
                    </div>
                </div>
            </BlackOutModal>

            <button
                onClick={() => { setIsOpen(true); fetchHistorical() }}
                className={`chip bg-cgray dark:bg-clightgray gap-2`}
            >
                <p className={`text-white`}>Histórico</p>
                <ListIcon fill='fill-clime' />
            </button>
        </div >
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