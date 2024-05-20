"use client";


import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from 'axios';

import { CattleProps, EventProps } from "@/lib/types";
import { enterModal } from "@/lib/constants";
import { EventIcon, ListIcon, SaveIcon } from '../ui/icons';
import Modal from '../ui/modal';
import Card from '../ui/card';
import ResizablePanel from '../ui/resizable-panel';
import InfoMessage from '../ui/info';
import EventItem from './event-item';

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
            <button className="rounded_btn cgreen" onClick={handleOpen}>
                <ListIcon fill="fill-clime" />
            </button>

            <Modal handleClose={handleClose} isOpen={isOpen}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="w-[90vw] sm:min-w-full sm:max-w-sm"
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className='card overflow-hidden relative'>
                        <div className="py-4 md:py-6 px-3 md:px-5">
                            <h3 className='font-bold text-xl sm:text-2xl tracking-tight'>Historial</h3>
                        </div>

                        <div className="max-h-[60vh] sm:max-h-[65vh] pr-2 overflow-y-auto relative pb-4 md:pb-6 px-3 md:px-5">
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
                                                            <EventItem event={event} prevEventDate={prevEvent?.eventDate} />
                                                        </div>
                                                    )
                                                })}

                                            </div> :
                                            <InfoMessage
                                                type='censored'
                                                title='No hemos encontrado eventos'
                                                subtitle='Este individuo no posee eventos registrados'
                                            />
                                }
                            </ResizablePanel>
                        </div>

                    </div>
                </motion.div >
            </Modal >
        </>
    );
}

export default HistoryBtn;

const LoadingHistorySkeleton = () => {
    return (
        <div className="grid gap-9 h-min max-h-[40vh] animate-pulse">
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