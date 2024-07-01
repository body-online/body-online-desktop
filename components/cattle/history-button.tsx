"use client";


import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from 'axios';

import { CattleProps, EventProps } from "@/lib/types";
import { enterModal } from "@/lib/constants";
import ResizablePanel from '../ui/resizable-panel';
import InfoMessage from '../ui/info';
import EventItem from './event-item';
import BlackOutModal from '../ui/blackout-modal';
import { ListIcon } from '../ui/icons';

export function HistoryBtn({ cattle }: { cattle: CattleProps; }) {
    const [eventsHistory, setEventsHistory] = useState<EventProps[]>([])
    const [eventsError, setEventsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const controller = new AbortController();

    const handleClose = () => {
        controller.abort()
        setIsOpen(false);
        document.body.style.overflow = "auto";
        return setEventsHistory([])
    };
    const handleOpen = () => {
        document.body.style.overflow = "hidden";
        setIsOpen(true);
        return fetchHistory();
    };
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isOpen]);

    async function fetchHistory() {
        setEventsError(false)
        setIsLoading(true)
        try {
            const { data } = await axios.get(`/api/cattle/history?id=${cattle._id}`, { signal: controller.signal })
            if (data && Array.isArray(data)) {
                setEventsHistory(data)
            }
            
        } catch (error) {
            setEventsError(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button className="chip cgreen flex-center gap-1" onClick={handleOpen}>
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

                >
                    <div className='w-[90vw] h-[80vh] overflow-auto pr-1 max-w-md'>
                        {/* header */}
                        <div
                            className="w-full sticky top-0 z-10 mb-3 h-12
                            bg-gradient-to-b custom-gradient"
                        >
                            <div className="flex-between gap-3 mb-2">
                                <h1 className="semititle">Historial de caravana {cattle?.caravan}</h1>
                            </div>
                        </div>

                        <div className="w-full">
                            <ResizablePanel>
                                {isLoading ?
                                    <LoadingHistorySkeleton /> :
                                    eventsError ?
                                        <InfoMessage type='warning'
                                            title='Ha ocurrido un error al obtener los eventos'
                                            subtitle={`Hemos experimentado un contratiempo al obtener el historial de la caravana ${cattle.caravan}`}
                                        /> :
                                        eventsHistory.length > 0 ?
                                            <div className='grid'>
                                                {/* events list */}
                                                {eventsHistory.map((event, index) => {
                                                    const prevEvent = eventsHistory?.[index - 1] ?? undefined

                                                    return (
                                                        <div key={index}>
                                                            <EventItem event={event} prevEventDate={new Date(prevEvent?.eventDate)} />
                                                        </div>
                                                    )
                                                })}

                                            </div> :
                                            <InfoMessage
                                                type='censored'
                                                title='No hemos encontrado eventos'
                                                subtitle={`El individuo ${cattle.caravan} no posee eventos registrados`}
                                            />
                                }
                            </ResizablePanel>
                        </div>

                    </div>
                </motion.div >
            </BlackOutModal >
        </>
    );
}

export default HistoryBtn;

const LoadingHistorySkeleton = () => {
    return (
        <div className="grid gap-9 h-full animate-pulse">
            <div className="w-full space-y-2">
                <div className="w-32 h-6 rounded-full bg-slate-100"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                    <div className="w-12 h-8 rounded-full bg-slate-100"></div>
                    <div className="w-32 h-10 rounded-full bg-slate-100"></div>
                </div>
            </div>
            <div className="w-full space-y-2">
                <div className="w-32 h-6 rounded-full bg-slate-100"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                    <div className="w-12 h-8 rounded-full bg-slate-100"></div>
                    <div className="w-32 h-10 rounded-full bg-slate-100"></div>
                </div>
            </div>
            <div className="w-full space-y-2">
                <div className="w-32 h-6 rounded-full bg-slate-100"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                    <div className="w-12 h-8 rounded-full bg-slate-100"></div>
                    <div className="w-32 h-10 rounded-full bg-slate-100"></div>
                </div>
            </div>
            <div className="w-full space-y-2">
                <div className="w-32 h-6 rounded-full bg-slate-100"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                    <div className="w-12 h-8 rounded-full bg-slate-100"></div>
                    <div className="w-32 h-10 rounded-full bg-slate-100"></div>
                </div>
            </div>

        </div>
    )
}