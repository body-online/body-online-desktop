'use client'

import { useEffect, useState } from 'react';

import { PendingMeasureProps } from '@/lib/types';
import { db, OfflineEvent } from '@/lib/utils';
import { ArrowsIcon } from '@/components/ui/icons';
import CaliperMeasure from '@/components/event/caliper-measure';
import Modal from '@/components/ui/modal';
import toast from 'react-hot-toast';
import InfoMessage from './ui/info';

const OfflinePage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [pendingMeasures, setPendingMeasures] = useState<PendingMeasureProps[]>([]);
    const [selectedPendingMeasure, setSelectedPendingMeasure] = useState<PendingMeasureProps>()

    const [caliperMeasure, setCaliperMeasure] = useState<number>();
    const [caliperDetail, setCaliperDetail] = useState<string>();

    async function handleComplete() {
        if (!selectedPendingMeasure) return null

        try {
            setIsLoading(true)

            const newEvent: OfflineEvent = {
                _id: selectedPendingMeasure._id,
                cattleId: selectedPendingMeasure.cattle._id,
                eventDate: selectedPendingMeasure.expirationDate,
                eventType: 'body_measure',
                eventDetail: caliperDetail,
                measure: caliperMeasure,
                taskId: selectedPendingMeasure.taskId
            }

            // save the event
            await db.events.put(newEvent);
            // delete the pending measure
            await db.pendingMeasures.delete(selectedPendingMeasure._id);


            setPendingMeasures(pendingMeasures.filter((i) => i._id != selectedPendingMeasure._id))

            toast.success(`${selectedPendingMeasure?.cattle.caravan} medida registrada: ${caliperMeasure}`, { id: 'event-presave-offline', position: 'top-left' })

            handleClose()
        } catch (error) {
            console.log(error)
            return toast.error(`Error al registrar medida: ${selectedPendingMeasure?.cattle.caravan}`, { id: 'event-err-offline', position: 'top-left' })
        } finally {
            setIsLoading(true)
        }
    }

    function handleClose() {
        setCaliperDetail(undefined)
        setCaliperMeasure(undefined)
        return setSelectedPendingMeasure(undefined)
    }

    // load pending events from IndexDB
    useEffect(() => {
        const loadOfflineData = async () => {
            const indexDBPendingMeasures = await db.pendingMeasures.toArray();
            setPendingMeasures(indexDBPendingMeasures);
        };
        loadOfflineData();
    }, []);

    return (
        <div className='py-default max-w-md w-full mx-auto'>
            <div className="flex-between mb-3 px-default">
                <h1 className="text-xl md:text-2xl font-semibold mb-[20px]">
                    Mediciones
                </h1>
                <p className='font-medium opacity-50'>{pendingMeasures.length ?? 0} pendientes</p>
            </div>

            {pendingMeasures ? (
                <ul className='flex flex-col gap-2 px-default'>
                    {pendingMeasures?.map((pendingMeasure) => {
                        const { _id, cattle, expirationDate } = pendingMeasure

                        return (
                            <li key={`${_id}`} className='list-none'>
                                <div className="card p-3 md:px-4 !-rounded-r-full">
                                    <div className="flex-between">
                                        <div>
                                            <p className='font-bold text-2xl'>
                                                {cattle?.caravan}
                                            </p>
                                            <p>
                                                {new Date(expirationDate).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <button
                                            type='button'
                                            className='flex-center bg-cgreen dark:bg-clime flex-center rounded-full px-6 py-3'
                                            onClick={() => setSelectedPendingMeasure(pendingMeasure)}
                                        >
                                            <p className='text-xs uppercase tracking-widest font-semibold text-white dark:text-cblack'>Medir</p>
                                            <ArrowsIcon direction='!w-6 !h-6 -rotate-90' fill='dark:fill-cblack fill-clime' />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-end w-full mt-1">
                                    <p className="input_instructions text-xs">{_id}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="px-4">
                    <InfoMessage
                        type='censored'
                        title='Sin resultados'
                        subtitle="Al parecer no tienes mediciones por realizar, ya estas al día!"
                    />
                </div>
            )
            }


            <Modal isOpen={Boolean(selectedPendingMeasure)} handleClose={handleClose}>
                <div className='card_modal flex flex-col max-w-sm mx-auto w-full'>
                    <div className="header_container">
                        <p className="dark:text-gray-300 text-2xl font-medium">
                            {selectedPendingMeasure?.cattle.caravan}
                        </p>
                    </div>

                    <div className='flex flex-col overflow-auto px-3'>
                        {selectedPendingMeasure &&
                            <CaliperMeasure
                                setMeasure={({ measure: measureValue, eventDetail }) => {
                                    setCaliperDetail(eventDetail)
                                    setCaliperMeasure(measureValue)
                                }}
                                measure={caliperMeasure}
                                disabled={isLoading}
                                min={Number(selectedPendingMeasure.cattle?.geneticId.bodyRanges?.[0])}
                                max={Number(selectedPendingMeasure.cattle?.geneticId.bodyRanges?.[1])}
                            />
                        }
                    </div>

                    <div className="buttons_container">
                        <button
                            className='rounded_btn bg-white dark:bg-clightgray'
                            type='button'
                            disabled={isLoading}
                            onClick={() => handleClose()}
                        >
                            <p>Cancelar</p>
                        </button>

                        <button
                            className='rounded_btn bg-cgreen dark:bg-clime'
                            disabled={isLoading || !caliperMeasure || !selectedPendingMeasure || !caliperDetail}
                            type={'button'}
                            onClick={() => {
                                if (!selectedPendingMeasure) return null
                                handleComplete().then(() => setIsLoading(false))
                            }}
                        >
                            <p className='text-white dark:text-cgray'>
                                Guardar
                            </p>
                        </button>
                    </div>
                </div>
            </Modal >
        </div>
    );
};

export default OfflinePage;
