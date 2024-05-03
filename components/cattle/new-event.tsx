

'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { EventType, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { EventSchema, NewEventButtonProps, eventSchema } from '@/lib/types';
import { MiniAddIcon, LoadingIcon, EventIcon } from '../ui/icons';
// import { createEvent } from '@/actions/event';
import Modal from '../ui/modal';
import { useEffect, useState } from 'react';
import Card from '../ui/card';
import { detailsByEvent, enterModal, eventTypesList } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/actions/event';
import ResizablePanel from '../ui/resizable-panel';
import SelectInputSearch from '../ui/select-input-search';
import { SelectOptionProps } from '../ui/select-input';
import ChipState from './chip-state';
import ChipBodyCondition from './chip-body-condition';

export function AddEventButton({ cattle }: NewEventButtonProps) {
    const router = useRouter()
    const {
        register,
        unregister,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<EventSchema>({
        resolver: zodResolver(eventSchema)
    })
    const onSubmit: SubmitHandler<EventSchema> = async (data: EventSchema) => {
        const toastSavingEvent = toast.loading('Creando evento...');
        try {
            const { error, data: createdEvent } = await createEvent(data);
            if (error) return toast.error(error)
            toast.success(`Evento creado exitosamente!`);
            reset();
            handleClose()
            router.refresh()
        } catch (error) {
            toast.error('Ha ocurrido un error al crear el evento')
        } finally {
            toast.dismiss(toastSavingEvent)
        }
    }

    // event modal
    const [isOpen, setIsOpen] = useState(false)
    const handleClose = () => {
        reset();
        return setIsOpen(false)
    }
    const handleOpen = () => {
        return setIsOpen(true)
    }
    // event steps states
    const eventType = watch('eventType')
    const measure = watch('measure')
    // const eventDetail = watch('eventDetail')
    // const eventDate = watch('eventDate')

    useEffect(() => {
        unregister('measure')
        unregister('eventDetail')
    }, [eventType])

    // set the default states of the form
    useEffect(() => {
        if (cattle?._id) {
            setValue('cattleId', cattle._id)
        }
    })

    return (
        <>
            <button
                disabled={cattle?.state == "death"}
                className='rounded_btn cgreen'
                onClick={handleOpen}
            >
                <EventIcon fill='fill-clime' />
            </button>

            <Modal handleClose={handleClose} isOpen={isOpen}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-3xl relative"
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Card headerLabel='Crear evento'>
                        <form className="mt-2 space-y-4" onSubmit={handleSubmit(onSubmit)}>


                            <div className="max-h-[75vh] sm:max-h-[100vh] pr-2 overflow-y-auto sm:overflow-visible relative">

                                {/* cattle details */}
                                <div className="select-none flex-center max-w-max bg-slate-50 border rounded-xl gap-2 mb-3">
                                    <p className='text-base text-black font-semibold px-4'>
                                        {cattle?.caravan}
                                    </p>
                                    <div className='overflow-x-auto w-full py-2 pr-4'>
                                        <div className="flex items-center gap-6 w-max">
                                            <ChipState state={cattle?.state} />
                                            <ChipBodyCondition type={cattle?.bodyCondition} />
                                            <p className='text-sm'>{cattle?.geneticName}</p>
                                            <p className='text-sm'>{cattle?.locationName}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:grid md:grid-flow-col md:auto-cols-max w-full gap-3 h-max">
                                    {/* event date */}
                                    <label htmlFor="eventDate">
                                        <p className="input_label bg-white sticky top-0 w-full">Fecha del evento*</p>
                                        <input type='date' className='input min-w-[50%] max-w-max' {...register('eventDate')} />
                                        <div className="input_error">
                                            {errors.eventDate && (<p>{`${errors.eventDate.message}`}</p>)}
                                        </div>
                                    </label>

                                    {/* event type */}
                                    <div className='w-full space-y-4'>
                                        <label htmlFor="eventType">
                                            <p className="input_label bg-white sticky -top-1 w-full">Tipo de evento*</p>
                                            <div className="overflow-x-auto w-full">
                                                <div className="grid grid-flow-col auto-cols-max gap-2 pb-1 w-max h-full">
                                                    {eventTypesList.map((event, index) => {
                                                        const selected = Boolean(eventType == event.value);
                                                        const cattleState = (cattle?.state && cattle?.state != '') ? cattle.state : 'not_pregnant'

                                                        return (
                                                            <button
                                                                disabled={event.allowedStates.includes(cattleState) ? false : true}
                                                                key={index}
                                                                type='button'
                                                                className={`${selected ? `cgreen border border-cgreen` : `slate`} disabled:opacity-40 transition-all h-11 sm:h-12 px-4 rounded-full `}
                                                                onClick={() => { setValue('eventType', event.value) }}>
                                                                <p className={`leading-3 font-medium text-sm ${selected ? `text-black` : ``}`}>{event?.label}</p>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className="input_error">
                                                {errors.eventType && (<p>{`${errors.eventType.message}`}</p>)}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <ResizablePanel
                                    changeIndicator={eventType ?? `default`}
                                    disableOverflow={eventType == "death" || eventType == "not_pregnant"}
                                >
                                    <div className='min-h-1'>
                                        {/* event detail */}
                                        {eventType === "pregnant" ? ( // == service
                                            <div className='w-full bg-caqua/20 p-3 rounded-lg max-w-max'>
                                                <p className='text-cgreen text-sm md:text-base'>Se le notificará a los <b className='text-cgreen'>30</b>, <b className='text-cgreen'>60</b> y <b className='text-cgreen'>90</b> días de este evento para tomar las mediciones correspondientes</p>
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
                                                <div className="grid grid-cols-6 md:grid-cols-12 gap-x-2 gap-y-5 pt-1 w-full relative">
                                                    {detailsByEvent[eventType].map((measureObj, index) => {
                                                        const selected = measure === measureObj.label;
                                                        return (
                                                            <button
                                                                key={index}
                                                                type='button'
                                                                className={`${selected ? `cgreen border-cgreen` : `slate`} rounded-xl w-11 sm:w-12 h-11 sm:h-12`}
                                                                onClick={() => setValue('measure', measureObj.label)}>
                                                                <p>{measureObj.label}</p>
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
                                                <p className="input_label bg-white sticky top-0 w-full">Cantidad de individuos</p>
                                                <input type='text' className='input max-w-[120px]' placeholder='Ej. 1' {...register('eventDetail')} />
                                                <div className="input_error">
                                                    {errors.eventDetail && (<p>{`${errors.eventDetail.message}`}</p>)}
                                                </div>
                                            </label>
                                        ) : null}
                                    </div>
                                </ResizablePanel>

                                {/* event observations */}
                                <div className="mt-4">
                                    <label htmlFor="eventObservations">
                                        <p className="input_label bg-white sticky top-0 w-full">Observaciones*</p>
                                        <textarea {...register('observations')} className='textarea' placeholder='Observaciones...'></textarea>
                                    </label>
                                </div>
                            </div>

                            <div className="flex-end gap-3">
                                <button
                                    type='button'
                                    onClick={handleClose}
                                    className='btn slate'
                                    disabled={isSubmitting}
                                >
                                    <p>Cancelar</p>
                                </button>
                                <button
                                    type="submit"
                                    className="btn black"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <LoadingIcon /> : <p>Crear</p>}
                                </button>
                            </div>
                        </form>
                    </Card>
                </motion.div >
            </Modal >
        </>
    )
}

export default AddEventButton


{/* cattle general state */ }
{/* <div className="overflow-auto w-full">
                                <Divider />
                                <div className="grid grid-cols-3 w-max pb-2">
                                    <p className='text-sm text-slate-500 font-medium mb-2'>Caravana</p>
                                    <p className='text-sm text-slate-500 font-medium mb-2'>Estado</p>
                                    <p className='text-sm text-slate-500 font-medium mb-2'>Condicion Corporal</p>
                                    <div className='flex items-center'>
                                        <p className='chip chip_gray'>{cattle?.caravan}</p>
                                    </div>
                                    <ChipStatus
                                        state={"pregnant"}
                                    />
                                    <ChipBodyCondition
                                        type={"skinny"}
                                    />
                                </div>
                                <Divider />
                            </div> */}