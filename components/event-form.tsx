'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { CattleProps, EventSchema, eventSchema } from '@/lib/types';
import { detailsByEvent, eventTypesList } from '@/lib/constants';
import { createEvent } from '@/actions/event';

import { BodyMeasureIcon, CattleBirthIcon, DeathIcon, EventIcon, LoadingIcon, NotPregnantIcon, PregnantIcon } from './ui/icons';
import SelectInputSearchCattle from './cattle/select-input-search-cattle';
import SelectInputSearch from './ui/select-input-search';
import { SelectOptionProps } from './ui/select-input';
import ResizablePanel from './ui/resizable-panel';
import { useRouter } from 'next/navigation';

export function EventForm({ defaultCattle, isOpenCattles, setIsOpenCattles, handleClose }
    : { defaultCattle?: CattleProps; isOpenCattles: boolean; setIsOpenCattles: Function; handleClose?: Function }) {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        unregister,
        watch,
        formState: { errors, isSubmitting },
        reset,
        setError,
        clearErrors,
        setValue,
    } = useForm<EventSchema>({
        // defaultValues,
        resolver: zodResolver(eventSchema)
    })
    // event steps states
    const [selectedCattle, setSelectedCattle] = useState<CattleProps | undefined>(defaultCattle)
    const cattleId = watch('cattleId')
    const eventDate = watch('eventDate')
    const eventType = watch('eventType')
    const measure = watch('measure')

    const onSubmit: SubmitHandler<EventSchema> = async (data: EventSchema) => {
        const toastSavingEvent = toast.loading('Creando evento...');
        try {
            if ((data?.eventType == 'death' || data?.eventType == 'not_pregnant' || data?.eventType == 'cattle_birth') && !data?.eventDetail) {
                return setError('eventDetail', { message: 'El detalle es necesario para este tipo de evento' })
            } else {
                clearErrors('eventDetail')
            }
            if (data?.eventType == 'body_measure' && !data?.measure) {
                return setError('measure', { message: 'El valor del caliper es necesario para este tipo de evento' })
            } else {
                clearErrors('measure')
            }
            const { error } = await createEvent(data);
            if (error) return toast.error(error)

            toast.success(`Evento creado exitosamente!`);
            setSelectedCattle(undefined)
            if (handleClose) handleClose();
            reset();
            router.refresh()
        } catch (error) {
            toast.error('Ha ocurrido un error al crear el evento')
        } finally {
            toast.dismiss(toastSavingEvent)
        }
    }

    const handleSelectCattle = (cattle: CattleProps) => {
        setSelectedCattle(cattle)
        setValue('cattleId', cattle._id)
    }

    useEffect(() => {
        if (!selectedCattle?.state) setSelectedCattle((prevState) => {
            if (prevState && !prevState?.state) {
                let newState = { ...prevState, state: 'not_pregnant' }
                return newState
            }
            return prevState
        })
    }, [selectedCattle])

    useEffect(() => {
        if (defaultCattle) return setValue('cattleId', defaultCattle?._id)
    }, [defaultCattle])


    return (


        <form onSubmit={handleSubmit(onSubmit)}
            className='w-[90vw] h-[80vh] relative pr-1 max-w-xl overflow-auto'
        >
            {/* header */}
            <div
                className="w-full sticky top-0 z-30 mb-3
                    bg-gradient-to-b from-white via-white/90 to-transparent"
            >
                <div className="flex-between gap-3 mb-2">
                    <h1 className="semititle">Crear evento</h1>
                </div>
            </div>

            {/* children */}
            <div className='space-y-6'>
                <div className="grid sm:grid-cols-2 w-full gap-3 h-max">
                    <SelectInputSearchCattle
                        isSubmitting={isSubmitting}
                        selectedCattle={selectedCattle}
                        isOpen={isOpenCattles}
                        setIsOpen={setIsOpenCattles}
                        handleSelectCattle={handleSelectCattle}
                        error={errors?.cattleId?.message}
                    />

                    <label htmlFor="eventDate">
                        <p className="input_label">Fecha del evento*</p>
                        <input
                            className='input min-w-[50%] w-full'
                            value={eventDate as any ?? ''}
                            {...register('eventDate')}
                            type='datetime-local'
                        />
                        <div className="input_error">
                            {errors.eventDate && (<p>{`${errors.eventDate.message}`}</p>)}
                        </div>
                    </label>
                </div>

                {/* event type */}
                <div className='w-full overflow-hidden'>
                    <label htmlFor="eventType">
                        <p className="input_label">Tipo de evento*</p>

                        <div className="overflow-x-auto w-full">
                            <div className="grid grid-flow-col auto-cols-max gap-2 pb-1 w-max h-full">
                                {eventTypesList.map((event, index) => {
                                    const isDisabled = !selectedCattle || !event.allowedStates.includes(selectedCattle?.state ?? 'not_pregnant') || isSubmitting
                                    const selected = Boolean(eventType == event.value);
                                    const buttonColor = selected ? `bg-cgreen cursor-pointer` : `bg-slate-100 active:bg-slate-200 md:hover:bg-slate-200`
                                    const fillIcon = selected ? `fill-clime` : `fill-slate-600`
                                    const strokeIcon = selected ? `stroke-clime` : `stroke-slate-600`
                                    if (isDisabled) return
                                    return (
                                        <button
                                            key={index}
                                            type='button'
                                            disabled={isDisabled}
                                            className={`rounded-full px-4 py-3 transition-all flex gap-1 items-center disabled:opacity-50 ${buttonColor}`}
                                            onClick={() => {
                                                unregister('measure')
                                                unregister('eventDetail')
                                                return setValue('eventType', event.value)
                                            }}
                                        >
                                            {event.value == 'body_measure' ?
                                                <BodyMeasureIcon fill={fillIcon} /> :
                                                event.value == 'pregnant' ?
                                                    <PregnantIcon fill={fillIcon} /> :
                                                    event.value == 'not_pregnant' ?
                                                        <NotPregnantIcon stroke={strokeIcon} /> :
                                                        event.value == 'cattle_birth' ?
                                                            <CattleBirthIcon stroke={strokeIcon} /> :
                                                            event.value == 'death' ?
                                                                <DeathIcon fill={fillIcon} /> :
                                                                event.value == 'death' ?
                                                                    <DeathIcon fill={fillIcon} /> :
                                                                    ''}

                                            <p className={`leading-3 text-sm font-medium ${selected ? `text-white` : `text-slate-600`}`}>
                                                {event?.label}
                                            </p>
                                        </button>
                                    )

                                })}
                            </div>
                        </div>
                    </label>
                </div>

                <ResizablePanel changeIndicator={eventType ?? `default`} disableOverflow={eventType == "death" || eventType == "not_pregnant"}>
                    {eventType === "pregnant" ? (
                        <div className=" py-1">
                            <div className='rounded-xl bg-slate-100 p-3 w-full max-w-max'>
                                <p>Se crearán 3 recordatorios de mediciones con vencimiento dentro de <b>30</b>, <b>90</b> y <b>60</b> días respectivamente.</p> <br />
                                <p>Estos recordatorios podrás verlos en la sección de <b>Mediciones pendientes</b></p>
                            </div>
                        </div>
                    ) : eventType === "not_pregnant" ? (
                        <SelectInputSearch
                            label='Motivo*'
                            placeholder='Seleccione una opción'
                            value={watch('eventDetail') ? detailsByEvent[eventType].find((detail) => detail.value == watch('eventDetail')) : null}
                            options={detailsByEvent[eventType]}
                            isDisabled={isSubmitting}
                            handleChange={(objSelected: SelectOptionProps) => {
                                return setValue("eventDetail", objSelected.value);
                            }}
                            error={errors?.eventDetail?.message}
                        />
                    ) : eventType === "death" ? (
                        <SelectInputSearch
                            label='Motivo*'
                            placeholder='Seleccione una opción'
                            value={watch('eventDetail') ? detailsByEvent[eventType].find((detail) => detail.value == watch('eventDetail')) : null}
                            options={detailsByEvent[eventType]}
                            isDisabled={isSubmitting}
                            handleChange={(objSelected: SelectOptionProps) => {
                                return setValue("eventDetail", objSelected.value);
                            }}
                            error={errors?.eventDetail?.message}
                        />
                    ) : eventType === "body_measure" ? (
                        <label htmlFor="measure">
                            <p className="input_label bg-white sticky -top-1 w-full">Indique el valor del caliper*</p>
                            <div className="flex flex-wrap gap-x-2 gap-y-5 pt-1 w-full relative">
                                {detailsByEvent[eventType].map((measureObj, index) => {
                                    const selected = measureObj.value === Number(measure)
                                    const minRange = Number(selectedCattle?.bodyRanges[0])
                                    const maxRange = Number(selectedCattle?.bodyRanges[1])

                                    const ideal = measureObj.value >= minRange && measureObj.value <= maxRange
                                    return (
                                        <button
                                            className={`${selected ? `ring-[3px] ring-cgreen/80` : `opacity-50 hover:opacity-100`} 
                                                ${measureObj.value < minRange ? `bg-yellow-300` :
                                                    ideal ? `bg-green-300` : `bg-orange-300`} 
                                                rounded-xl w-11 sm:w-12 h-11 sm:h-12 flex-center transition-all`}
                                            key={index}
                                            type='button'
                                            onClick={() => setValue('measure', measureObj.label)}
                                        >
                                            <p className={`${selected ? `` : ``} 
                                            ${measureObj.value < minRange ? `text-yellow-700` :
                                                    ideal ? `text-green-700` : `text-orange-700`}
                                             text-lg font-semibold   `}>{measureObj.label}</p>
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="input_error">
                                {errors.measure && (<p>{`${errors.measure.message}`}</p>)}
                            </div>
                        </label>
                    ) : eventType === "cattle_birth" ? (
                        <label htmlFor="eventDetail">
                            <p className="input_label">Cantidad de individuos</p>
                            <input type='text' className='input max-w-[120px]' placeholder='Ej. 1' {...register('eventDetail')} />
                            <div className="input_error">
                                {errors.eventDetail && (<p>{`${errors.eventDetail.message}`}</p>)}
                            </div>
                        </label>
                    ) : <div className='h-1' />}
                </ResizablePanel>


                {/* event observations */}
                <div>
                    <label htmlFor="eventObservations">
                        <p className="input_label">Observaciones*</p>
                        <textarea {...register('observations')} className='textarea' placeholder='Observaciones...'></textarea>
                    </label>
                </div>
            </div>


            {/* bottom */}
            <div
                className="w-full sticky bottom-0 mt-3 bg-gradient-to-t from-white via-white/90 to-transparent">
                <div className="flex-end gap-3">
                    <button
                        type="submit"
                        className="btn cgreen"
                        disabled={isSubmitting || !eventType || !cattleId || !eventDate}
                    >
                        {isSubmitting ? <LoadingIcon /> : <>
                            <p>Crear evento</p>
                            <EventIcon fill='fill-clime' />
                        </>}
                    </button>
                </div>
            </div>
        </form>


        // <div className='w-[90vw] h-[80vh] overflow-auto pr-1 max-w-lg'>
        //     <div
        //         className="w-full sticky top-0 z-10 mb-3 h-12
        //                     bg-gradient-to-b from-white via-white/90 to-transparent"
        //     >
        //         <div className="flex-between gap-3 mb-2">
        //             <h1 className="semititle">Crear evento</h1>
        //         </div>
        //     </div>

        //     <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>


        //         <div className="flex-end gap-3">
        //             <button
        //                 type="submit"
        //                 className="btn cgreen"
        //                 disabled={isSubmitting || !eventType || !cattleId || !eventDate}
        //             >
        //                 {isSubmitting ? <LoadingIcon /> : <>
        //                     <p>Crear evento</p>
        //                     <EventIcon fill='fill-clime' />
        //                 </>}
        //             </button>
        //         </div>
        //     </form>
        // </div>
    )
}

export default EventForm