'use client';

import { useEffect, useState } from 'react';
import { PendingMeasureProps } from '@/lib/types';
import { db, OfflineEvent } from '@/lib/utils';
import { ArrowsIcon } from '@/components/ui/icons';
import Modal from '@/components/ui/modal';
import toast from 'react-hot-toast';
import InfoMessage from './ui/info';
import { format } from 'date-fns';
import CaliperMeasure from './event/caliper-measure';

const OfflinePage = () => {
    const [pendingMeasures, setPendingMeasures] = useState<PendingMeasureProps[]>([]);
    const [uniqueDates, setUniqueDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>();

    const [selectedPendingMeasure, setSelectedPendingMeasure] = useState<PendingMeasureProps>();
    const [caliperMeasure, setCaliperMeasure] = useState<number>();
    const [caliperDetail, setCaliperDetail] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Cargar mediciones pendientes desde IndexedDB
    useEffect(() => {
        const loadOfflineData = async () => {
            const indexDBPendingMeasures = await db.pendingMeasures.toArray();
            setPendingMeasures(indexDBPendingMeasures);

            // Calcula fechas únicas
            const dates = Array.from(
                new Set(indexDBPendingMeasures.map((measure) => format(measure.expirationDate, 'yyyy-MM-dd')))
            );

            setUniqueDates(dates)


            // Selecciona la primera fecha única como predeterminada
            if (dates.length > 0) {
                setSelectedDate(dates[0]);
            }
        };

        loadOfflineData();
    }, []);

    // Manejar la selección de fecha
    const handleDateChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSelectedDate(event.currentTarget.value);
    };

    // Guardar la medida y actualizar el estado
    const handleComplete = async () => {
        if (!selectedPendingMeasure || caliperMeasure === null || !caliperDetail) return;

        try {
            setIsLoading(true);

            const newEvent: OfflineEvent = {
                _id: selectedPendingMeasure._id,
                cattleId: selectedPendingMeasure.cattle._id,
                eventDate: selectedPendingMeasure.expirationDate,
                eventType: 'body_measure',
                eventDetail: caliperDetail,
                measure: caliperMeasure,
                taskId: selectedPendingMeasure.taskId,
            };

            await db.events.put(newEvent);
            await db.pendingMeasures.delete(selectedPendingMeasure._id);

            setPendingMeasures((prev) => prev.filter((i) => i._id !== selectedPendingMeasure._id));
            toast.success(`Medida registrada para ${selectedPendingMeasure.cattle.caravan}: ${caliperMeasure}`);
            handleClose();
        } catch (error) {
            toast.error(`Error al registrar la medida: ${selectedPendingMeasure.cattle.caravan}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setCaliperDetail(undefined);
        setCaliperMeasure(undefined);
        setSelectedPendingMeasure(undefined);
    };

    let filteredResults = pendingMeasures?.filter((measure) => format(measure.expirationDate, 'yyyy-MM-dd') === selectedDate)
    return (
        <div className="py-default max-w-lg w-full mx-auto">
            <div className="flex-between mb-4 px-default">
                <h1 className="text-xl md:text-2xl font-semibold">
                    Mediciones pendientes
                </h1>
            </div>


            <h1 className="font-medium input_instructions px-default">Fecha de vencimiento</h1>
            <div className="px-default flex mb-6 overflow-x-auto pb-2 mt-2">
                {uniqueDates.map((date) => (
                    <button
                        key={date}
                        value={date}
                        onClick={handleDateChange}
                        className={`flex-center rounded-xl py-2 px-4 ${selectedDate === date ? 'bg-cgreen dark:bg-clime' : ''
                            }`}
                    >
                        <p
                            className={`font-medium text-lg ${selectedDate === date ? 'text-clime dark:text-cblack' : 'input_instructions  opacity-50'
                                }`}
                        >
                            {format(new Date(date), 'dd/MM/yyyy')}
                        </p>
                    </button>
                ))}
            </div>


            <ul className="flex flex-col gap-2">
                {selectedDate ?
                    <div className="gradient_card max-w-max w-full p-4">
                        <p className='opacity-50'>Las mediciónes se crearán con fecha <b>{format(new Date(selectedDate), 'dd/MM/yyyy')}</b></p>
                    </div>
                    : null
                }

                {filteredResults.length > 0 ?
                    filteredResults.map((measure) => (
                        <li key={measure._id} className="list-none">
                            <div className="card p-3 md:px-4 !-rounded-r-full">
                                <div className="flex-between">
                                    <div>
                                        <p className="font-bold text-2xl">{measure.cattle.caravan}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="flex-center bg-cgreen dark:bg-clime rounded-full px-6 py-3"
                                        onClick={() => setSelectedPendingMeasure(measure)}
                                    >
                                        <p className="text-xs uppercase tracking-widest font-semibold text-white dark:text-cblack">
                                            Medir
                                        </p>
                                        <ArrowsIcon direction="!w-6 !h-6 -rotate-90" fill="dark:fill-cblack fill-clime" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    )) :
                    <li className="px-4">
                        <InfoMessage
                            type="censored"
                            title="Sin resultados"
                            subtitle="No tienes mediciones pendientes en esta fecha."
                        />
                    </li>
                }
            </ul>


            <Modal isOpen={Boolean(selectedPendingMeasure)} handleClose={handleClose}>
                <div className='card_modal flex flex-col max-w-sm mx-auto w-full'>
                    <div className="header_container">
                        <p className="dark:text-gray-300 text-2xl font-medium">
                            {selectedPendingMeasure?.cattle.caravan}
                        </p>
                        <p className="input_instructions text-base mb-1">
                            Indique la medida del caliper
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
