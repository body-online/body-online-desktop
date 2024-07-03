"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from 'axios';

import { CattleProps, EventProps } from "@/lib/types";
import { enterModal } from "@/lib/constants";
import InfoMessage from '../ui/info';
import EventItem from './event-item';
import BlackOutModal from '../ui/blackout-modal';
import { ListIcon } from '../ui/icons';
import Card from '../ui/card';
import { getHistoricalEvents } from '@/data/events';

export function HistoricalBtn({ cattle }: { cattle: CattleProps; }) {
    const [eventsHistorical, setEventsHistorical] = useState<EventProps[]>([])
    const [eventsError, setEventsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const controller = new AbortController();

    const handleClose = () => {
        controller.abort()
        setIsOpen(false);
        document.body.style.overflow = "auto";
        return setEventsHistorical([])
    };
    const handleOpen = () => {
        document.body.style.overflow = "hidden";
        setIsOpen(true);
        return fetchHistorical();
    };
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isOpen]);

    async function fetchHistorical() {
        setEventsError(false)
        setIsLoading(true)
        try {
            const { data } = await getHistoricalEvents({ cattleId: cattle._id })
            if (data && Array.isArray(data)) {
                setEventsHistorical(data)
            }
        } catch (error) {
            setEventsError(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button className="chip cgreen dark:bg-csemigreen flex-center gap-2" onClick={handleOpen}>
                <p>Historial de Eventos</p>
                <ListIcon fill="fill-clime" />
            </button>

            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='m-auto max-w-xl'
                >
                    <Card headerLabel={`Histórico de ${cattle.caravan}`}>
                        <div className="relative max-h-[74vh] flex flex-col overflow-auto pr-1 mt-3">
                            {isLoading ?
                                <LoadingHistoricalSkeleton /> :
                                eventsError ?
                                    <InfoMessage type='warning'
                                        title='Ha ocurrido un error al obtener los eventos'
                                        subtitle={`Hemos experimentado un contratiempo al obtener el historial de la caravana ${cattle.caravan}`}
                                    /> :
                                    eventsHistorical.length > 0 ?
                                        <>

                                            {eventsHistorical.map((event, index) => {
                                                const prevEvent = eventsHistorical?.[index - 1] ?? undefined

                                                return <EventItem event={event} prevEventDate={new Date(prevEvent?.eventDate)} key={index} />
                                            })}

                                        </> :
                                        <InfoMessage
                                            type='censored'
                                            title='No hemos encontrado eventos'
                                            subtitle={`El individuo ${cattle.caravan} no posee eventos registrados`}
                                        />
                            }
                        </div>
                    </Card>
                </motion.div >
            </BlackOutModal >
        </>
    );
}

export default HistoricalBtn;

const LoadingHistoricalSkeleton = () => {
    return (
        <div className="grid gap-9 h-full animate-pulse">
            <div className="w-full space-y-2">
                <div className="w-32 h-6 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    <div className="w-12 h-8 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    <div className="w-32 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                </div>
            </div>
            <div className="w-full space-y-2">
                <div className="w-32 h-6 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    <div className="w-12 h-8 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    <div className="w-32 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                </div>
            </div>
            <div className="w-full space-y-2">
                <div className="w-32 h-6 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    <div className="w-12 h-8 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    <div className="w-32 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                </div>
            </div>
            <div className="w-full space-y-2">
                <div className="w-32 h-6 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    <div className="w-12 h-8 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                    <div className="w-32 h-10 rounded-full bg-slate-200 dark:bg-clightgray"></div>
                </div>
            </div>

        </div>
    )
}