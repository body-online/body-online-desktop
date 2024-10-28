"use client";

import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { number, z } from 'zod';

import { CattleProps, CattleState, EventSchema, eventSchema } from '@/lib/types';
import { createEvent } from '@/actions/event';

import { AxiosError } from 'axios';
import { ArrowsIcon, LoadingIcon } from './ui/icons';
import CaravansList from './task/caravans-list';
import FilterInput from './ui/filter-input';
import CheckButton from './ui/check-button';
import CaliperMeasure from './event/caliper-measure';
import CattleResume from './ui/cattle-resume';
import ChipState from './cattles/chip-state';
import { eventTypesList } from '@/lib/constants';
import CloseBtn from './ui/close-btn';

const CreateEventForm = (
    { handleRefresh, handleByCattle, handleClose }: {
        handleByCattle?: CattleProps;
        handleRefresh?: () => void;
        handleClose?: () => void;
    }
) => {
    const { register, resetField, setValue, unregister, handleSubmit, watch, setError, clearErrors, formState: { errors, isSubmitting }, reset } =
        useForm<z.infer<typeof eventSchema>>({
            resolver: zodResolver(eventSchema),
            defaultValues: {
                cattleId: handleByCattle?._id,
            }
        })

    const [step, setStep] = useState<number>(handleByCattle ? 2 : 1)
    // step 1 states: cattle list (is an array but only uses 1 value)
    const [selectedCattles, setSelectedCattles] =
        useState<CattleProps[]>(handleByCattle ? [handleByCattle] : [])
    const [searchCattles, setSearchCattles] = useState<string>('')

    // functions
    const onSubmit: SubmitHandler<EventSchema> = async (data: EventSchema) => {
        try {
            console.log(data)
            const { error } = await createEvent(data);
            if (error) return toast.error(error)
            setStep(1)
            reset();
        } catch (error: AxiosError | any) {
            console.log(error)
            toast.error(error?.response?.data?.message ?? 'Ha ocurrido un error al crear el evento.')
        } finally {
            if (handleRefresh) handleRefresh()
        }
    }

    const selectedCattleId = watch('cattleId');
    const selectedEventType = watch('eventType');
    const selectedEventDate = watch('eventDate');
    const selectedEventDetail = watch('eventDetail');
    var selectedCattleState = selectedCattles?.[0]?.state?.toLowerCase();
    const selectedCattleCaravan = selectedCattles?.[0]?.caravan;
    const selectedCattleLastBodyDate = selectedCattles?.[0]?.bodyConditionDate;
    const selectedCattleLastBodyCondition = selectedCattles?.[0]?.bodyCondition;
    const selectedCattleLastStateDate = selectedCattles?.[0]?.stateDate;
    const bodyRanges: any = selectedCattles?.[0]?.bodyRanges;

    // step 1: update the form values after any list changes
    useEffect(() => {
        if (selectedCattles?.length) {
            // set the real value for the event  
            setValue('cattleId', selectedCattles?.[0]._id);
            unregister('eventType');
            unregister('eventDate');
            unregister('measure');
            unregister('eventDetail');
        }
    }, [selectedCattles])

    useEffect(() => {
        unregister('measure');
        unregister('eventDetail');
    }, [selectedEventType])

    // step 1: event date validation
    useEffect(() => {
        let eventDate = new Date(selectedEventDate)
        if (selectedCattleLastBodyCondition && eventDate) {
            if (
                (eventDate < new Date(selectedCattleLastBodyDate as string)) ||
                (eventDate < new Date(selectedCattleLastStateDate as string))
            ) {
                return setError('eventDate', { type: 'custom', message: 'La fecha debe ser posterior a la del último evento creado.' })
            }
            clearErrors('eventDate')
        }

    }, [selectedEventDate])

    useEffect(() => {
        if (handleByCattle)
            setSelectedCattles([handleByCattle])
    }, [])


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col overflow-hidden h-full'
        >
            <div className="header_container">
                <p className="semititle">
                    Crear evento
                </p>
                {handleClose &&
                    <CloseBtn handleClose={handleClose} />
                }
            </div>

            {selectedCattles?.[0] && step > 1 &&
                <div className='flex flex-col h-full px-4 gap-4 mb-4'>
                    {/* cattleResume */}
                    <CattleResume cattle={selectedCattles?.[0]} />
                </div>
            }
            {isSubmitting ? (
                <div className="flex-center h-[30vh] gap-2 py-default ">
                    <LoadingIcon />
                    <p className='text-lg font-medium'>Creando evento...</p>
                </div>
            ) : step == 1 ? (
                // STEP 1
                // cattle list for the new event
                // PS: this will be disabled if handleByCattle is passed by props
                <>
                    <div className='px-4 mb-2'>
                        <FilterInput
                            placeholder={'Buscar por caravana...'}
                            disabled={isSubmitting}
                            onChange={(e: any) => {
                                setSearchCattles(e);
                            }}
                        />
                    </div>

                    <CaravansList
                        onlyOne={true}
                        selectedCattles={selectedCattles}
                        setSelectedCattles={setSelectedCattles}
                        search={searchCattles}
                        disabled={isSubmitting || Boolean(handleByCattle)}
                    />
                </>
            ) : step == 2 ? (
                // STEP 2
                // eventType list for the new event
                // PS: this will be render the allowed options by the selectedCattleState
                <>
                    <div className='flex flex-col h-full px-4 gap-4 mb-4'>
                        <label htmlFor="eventDate">
                            <p className="input_instructions mb-2">
                                Fecha del evento
                            </p>
                            <input
                                disabled={isSubmitting}
                                className='input min-w-[50%] w-full'
                                {...register('eventDate')}
                                type='datetime-local'
                            />

                            <div className="input_error">
                                {errors.eventDate && (<p>{`${errors.eventDate.message}`}</p>)}
                            </div>
                        </label>

                        <p className="input_instructions">Tipo de evento</p>
                    </div>
                    <div className="custom_list">
                        {eventTypesList?.map((event, index) => {
                            const selected = event.value === selectedEventType;
                            // The cattle will be PREGNANT, EMPTY, MATERNITY
                            if (event.value === 'weaning' && !selectedCattleLastBodyDate) return null
                            if (!event.disabledStates.includes(selectedCattleState)) {
                                // if the event is allowed to the selected cattle state show it
                                return (
                                    <CheckButton
                                        key={index}
                                        value={event.value}
                                        label={event.label}
                                        onClick={() => setValue('eventType', event.value)}
                                        selected={selected}
                                        disabled={isSubmitting}
                                    >
                                        <p
                                            className={`font-medium text-xl text-gray-600 dark:text-gray-300 
                                        ${selected ? 'text-opacity-100' : 'dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100'}`}>
                                            {event.label}
                                        </p>
                                    </CheckButton>
                                )
                            }
                        })}
                    </div>

                </>
            ) : step == 3 ? (
                // STEP 3
                // eventDetail by each event type
                // PS: this will be render the allowed options by the selectedCattleState
                <>
                    {/* event details */}
                    {selectedEventType == "body_measure" ? (

                        <div className='px-4 space-y-3'>
                            <p className='input_instructions mb-2'>
                                Se modificará el estado corporal de <b>{selectedCattleCaravan}</b>.
                            </p>

                            <CaliperMeasure
                                measure={watch('measure')}
                                disabled={isSubmitting}
                                min={Number(bodyRanges?.[0])}
                                max={Number(bodyRanges?.[1])}
                                setMeasure={({ measure, eventDetail }) => {
                                    setValue('eventDetail', eventDetail);
                                    setValue('measure', measure ?? 0);
                                }}
                            />
                        </div>
                    ) : ["pregnant", "death", "cattle_birth", "not_pregnant", "weaning"].includes(selectedEventType) ? (
                        <>
                            <p className="input_instructions mb-2 px-4">
                                {selectedEventType == 'death' ? "Motivo de la muerte" :
                                    selectedEventType == 'not_pregnant' ? "Motivo del aborto" :
                                        selectedEventType == 'weaning' ? "Cantidad de destetados" :
                                            selectedEventType == 'cattle_birth' ? "Cantidad de nacidos" : null
                                }
                            </p>

                            {selectedEventType === 'pregnant' ? (
                                <div className='px-4 space-y-3 mb-12'>
                                    <p className='input_instructions mb-2'>
                                        Se modificará el estado del individuo <b>{selectedCattleCaravan}</b>.
                                    </p>
                                    <div className='flex-center max-w-max gap-3'>
                                        <ChipState state={selectedCattleState as CattleState} />
                                        <ArrowsIcon direction='-rotate-90 flex-center' />
                                        <ArrowsIcon direction='-rotate-90 flex-center' />
                                        <ArrowsIcon direction='-rotate-90 flex-center' />
                                        <ChipState state={'PREGNANT' as CattleState} />
                                    </div>

                                </div>
                            ) : selectedEventType === 'cattle_birth' ? (
                                <div className='px-4 mb-2'>
                                    <div className="grid grid-cols-4 gap-y-2 gap-x-2 place-items-center">
                                        {eventTypesList?.[2]?.eventDetails?.map((i, index) => {
                                            const selected = i.value === selectedEventDetail

                                            return (
                                                <button
                                                    disabled={isSubmitting}
                                                    className={`option_button flex-center ${selected ? `ring-2 dark:ring-clime` : `opacity-70 hover:opacity-100`}`}
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
                                </div>
                            ) : selectedEventType === 'weaning' ? (
                                <div className='px-4 mb-2'>
                                    <div className="grid grid-cols-4 gap-y-2 gap-x-2 place-items-center">
                                        {eventTypesList?.[2]?.eventDetails?.map((i, index) => {
                                            const selected = i.value === selectedEventDetail

                                            return (
                                                <button
                                                    disabled={isSubmitting}
                                                    className={`option_button flex-center ${selected ? `ring-2 dark:ring-clime` : `opacity-70 hover:opacity-100`}`}
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
                                </div>
                            ) : (
                                <div className="custom_list">
                                    {eventTypesList?.[selectedEventType == 'death' ? 4 : selectedEventType == 'not_pregnant' ? 3 : selectedEventType == 'cattle_birth' ? 2 : 0]?.eventDetails?.map((i, index) => {
                                        const selected = i.value === selectedEventDetail

                                        return (
                                            <CheckButton
                                                key={index}
                                                value={i.value}
                                                label={i.label}
                                                onClick={() => setValue('eventDetail', i.value)}
                                                selected={selected}
                                                disabled={isSubmitting}
                                            >
                                                <p
                                                    className={`font-medium text-xl text-gray-600 dark:text-gray-300 
                                            ${selected ? 'text-opacity-100' : 'dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100'}`}>
                                                    {i.label}
                                                </p>
                                            </CheckButton>
                                        )

                                    })}
                                </div>
                            )}
                        </>
                    ) : null
                    }
                </>
            ) : step === 4 ? (
                <div className='px-4'>
                    {/* <p className="input_label">
                        Detalle del evento
                    </p> */}
                    {/* <p className="input_instructions mb-3">

                    </p> */}
                    <div className="label w-full">
                        <textarea
                            placeholder='Ingrese detalle de ser necesario...'
                            {...register('observations')}
                            name="description"
                            className="textarea"
                        />
                    </div>
                </div>
            ) : null
            }

            {/* send and control buttons */}
            <div className="buttons_container">
                <button
                    disabled={step == 1 || isSubmitting}
                    className='rounded_btn bg-white dark:bg-clightgray'
                    type='button'
                    onClick={() => setStep(step - 1)}
                >
                    <p className='dark:text-slate-400 text-slate-500'>Anterior</p>
                </button>

                {/* <p className='input_instructions text-sm font-medium'><b className='text-base'>{step}</b> de 4</p> */}

                {step == 4 ? (
                    <button
                        className='rounded_btn bg-cgreen dark:bg-clime'
                        disabled={!selectedEventType || isSubmitting}
                        type='button'
                        onClick={handleSubmit(onSubmit)}
                    >
                        <p className='text-white dark:text-cgray'>
                            Crear evento
                        </p>
                    </button>
                ) : (
                    <button
                        className='rounded_btn bg-cgreen dark:bg-clime'
                        disabled={
                            Boolean(step === 1 && !selectedCattleId)
                            || Boolean(step === 2 && (errors?.eventDate || !selectedEventType || !selectedEventDate))
                            || Boolean(step === 3 && (!selectedEventDetail && selectedEventType != 'pregnant'))

                        }
                        type={'button'}
                        onClick={() => setStep(step + 1)}
                    >
                        <p className='text-white dark:text-cgray'>
                            Continuar
                        </p>
                    </button>
                )}
            </div>
        </form >
    );
}

export default CreateEventForm;