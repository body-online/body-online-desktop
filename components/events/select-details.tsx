import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import React from 'react'

import { CattleProps, EventSchema } from '@/lib/types';
import { detailsByEvent } from '@/lib/constants';

import OptionSelector from '../ui/option-selector';
import InfoMessage from '../ui/info';

const SelectEventDetail = ({ eventType, eventDetail, selectedMeasure, setValue, isSubmitting, selectedCattle }: {
    eventType?: string;
    eventDetail?: string;
    selectedMeasure?: string;
    setValue: UseFormSetValue<EventSchema>;
    isSubmitting?: boolean;
    selectedCattle: CattleProps;
}) => {

    return (
        <>
            {eventType === "body_measure" ? (
                <label htmlFor="measure">
                    <h3 className='semititle mb-3'>Indique el valor del caliper*</h3>
                    <div className="grid grid-cols-4 gap-y-2 gap-x-2 place-items-center">
                        {detailsByEvent[eventType].map((measureObj, index) => {
                            const measureValue = measureObj.value;
                            const selected = measureValue === Number(selectedMeasure)
                            const minRange = Number(selectedCattle.bodyRanges[0])
                            const maxRange = Number(selectedCattle.bodyRanges[1])

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
                                    onClick={() => setValue('measure', measureObj.label)}
                                >
                                    <p className='text-2xl font-semibold dark:text-cblack'>
                                        {measureObj.label}
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </label>
            ) : eventType === "pregnant" ? (
                <div>
                    <InfoMessage type='info' title='Evento Servicio' subtitle='Este evento crea 3 notificaciones para que no olvides realizar las mediciones correspondientes a los 30, 60 y 90 días' />
                </div>
            ) : eventType === "cattle_birth" ? (
                <label htmlFor="eventDetail">
                    <h3 className="semititle mb-3">Número de crías</h3>
                    <div className="grid grid-cols-4 gap-y-2 gap-x-2 place-items-center">
                        {detailsByEvent[eventType].map((i, index) => {
                            const selected = i.value === eventDetail

                            return (
                                <button
                                    disabled={isSubmitting}
                                    className={`option_button flex-center
                                        ${selected ? `ring-2 dark:ring-clime` : `opacity-70 hover:opacity-100`}
                                `}
                                    key={index}
                                    type='button'
                                    onClick={() => setValue('eventDetail', i.label)}
                                >
                                    <p className='text-2xl font-semibold'>
                                        {i.label}
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </label>
            ) : eventType === "death" || eventType === "not_pregnant" ? (
                <label htmlFor="eventDetail">
                    <h3 className="semititle mb-3">Motivo*</h3>
                    <OptionSelector
                        value={eventDetail}
                        options={detailsByEvent[eventType]}
                        setValue={(e: EventSchema['eventType']) => { setValue('eventDetail', e); }}
                    />
                </label>
            ) : null
            }
        </>
    )
}

export default SelectEventDetail