"use client";

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { number, z } from 'zod';

import { CattleProps, CattleState, EventSchema, eventSchema } from '@/lib/types';
import { createEvent } from '@/actions/event';

import { AxiosError } from 'axios';
import { ArrowsIcon, LoadingIcon } from '../ui/icons';
import CaravansList from '../task/caravans-list';
import FilterInput from '../ui/filter-input';
import CheckButton from '../ui/check-button';
import CaliperMeasure from './caliper-measure';
import CattleResume from '../ui/cattle-resume';
import { eventTypesList } from '@/lib/constants';
import CloseBtn from '../ui/close-btn';
import ChipBodyCondition from '../cattles/chip-body-condition';
import { useSync } from '@/context/SyncContext';
import CaravansResume from '../task/caravans-resume';

const CreateEventForm = (
    { handleRefresh, handleByCattle, handleClose }: {
        handleByCattle?: CattleProps;
        handleRefresh?: () => void;
        handleClose?: () => void;
    }
) => {
    const { refreshPendingMeasures } = useSync()
    const { register, setValue, unregister, handleSubmit, watch, setError, clearErrors, formState: { errors, isSubmitting }, reset } =
        useForm<z.infer<typeof eventSchema>>({
            resolver: zodResolver(eventSchema),
            defaultValues: {
                cattleId: handleByCattle?._id,
            }
        })

    const [step, setStep] = useState<number>(handleByCattle ? 2 : 1)
    // step 1 states: cattle list (is an array but only uses 1 value)
    const [selectedCattles, setSelectedCattles] = useState<CattleProps[]>(handleByCattle ? [handleByCattle] : [])
    const [searchCattles, setSearchCattles] = useState<string>('')

    // functions
    const onSubmit: SubmitHandler<EventSchema> = async (data: EventSchema) => {
        try {
            const { error } = await createEvent(data);
            await refreshPendingMeasures();

            if (error) return toast.error(error);
            setStep(1)
            reset();
        } catch (error: AxiosError | any) {
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
    var expirationDate = watch('eventDate') ? new Date(watch('eventDate')) : undefined
    const expirationHour = selectedEventDate ? new Date(selectedEventDate)
        .toLocaleTimeString("es-AR", { hour: 'numeric', minute: 'numeric' }) : undefined

    const expiration = selectedEventDate ?
        new Date(selectedEventDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'short', year: 'numeric' }) : undefined


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
                return setError('eventDate', {
                    type: 'custom', message: `La fecha debe ser posterior a ${new Date(selectedCattleLastStateDate as string) < new Date(selectedCattleLastBodyDate as string) ? new Date(selectedCattleLastBodyDate as string).toLocaleDateString() : new Date(selectedCattleLastStateDate as string).toLocaleDateString()}`
                })
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
                <div className="overflow-x-auto w-full">
                    <div className="flex items-center gap-1 w-max py-1 px-2">
                        <div>
                            <p className="text-base font-medium">
                                Nuevo evento
                            </p>
                        </div>

                        {selectedEventType &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />
                                <p className=''>
                                    {eventTypesList.find((i) => i.value === selectedEventType)?.label}
                                </p>
                            </>
                        }
                        {selectedEventDetail &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />

                                {selectedEventType != 'body_measure' ?
                                    <p className=''>
                                        {selectedEventDetail}
                                    </p>
                                    :
                                    <ChipBodyCondition bodyRanges={bodyRanges} measure={watch('measure')} />
                                }
                            </>
                        }
                        {Boolean(expiration && expirationHour) &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />
                                <div className='-space-y-1.5'>
                                    <p className="input_instructions text-start text-sm">
                                        {expiration}
                                    </p>
                                    <p className="input_instructions text-start text-xs">
                                        {expirationHour}
                                    </p>
                                </div>
                            </>
                        }
                        {selectedCattleCaravan &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />
                                <CaravansResume cattles={selectedCattles} />
                            </>
                        }
                    </div>
                </div>

                {handleClose && <CloseBtn handleClose={handleClose} />}
            </div>

            {selectedCattles?.[0] && step == 2 && (
                <div className="my-2 border-b custom-border pb-3">
                    <CattleResume withoutHeader={true} cattle={selectedCattles?.[0]} withoutClasses={true} />
                </div>
            )}

            {isSubmitting ? (
                <div className="flex-center gap-2 h-[40vh]">
                    <LoadingIcon />
                    <p className='input_instructions text-base font-medium'>
                        Creando evento...
                    </p>
                </div>
            ) : step == 1 ? (
                // STEP 1
                // cattle list for the new event
                // PS: this will be disabled if handleByCattle is passed by props
                <>
                    <div className="px-4 my-2">
                        <p className="dark:text-gray-300 text-lg font-medium mb-2">
                            Seleccionar caravana
                        </p>

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


                    <p className="w-max dark:text-gray-300 text-lg font-medium">Fecha del evento</p>

                    <div className="px-4 my-2">
                        <div className="w-full max-w-xs">
                            <input
                                disabled={isSubmitting}
                                className='input w-full'
                                {...register('eventDate')}
                                type='datetime-local'
                            />
                        </div>

                        <div className="input_error">
                            {errors.eventDate && (<p>{`${errors.eventDate.message}`}</p>)}
                        </div>
                    </div>

                    <div className="custom_list">
                        {eventTypesList?.filter((i) => !i.disabledStates.includes(selectedCattleState)).map((event, index) => {
                            const selected = event.value === selectedEventType;
                            // The cattle will be PREGNANT, EMPTY, MATERNITY
                            // if (event.value === 'weaning' && !selectedCattleLastBodyDate) return null

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
                                        className={`font-medium text-xl text-gray-600 dark:text-gray-300 text-start
                                        ${selected ? 'text-opacity-100' : 'dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100'}`}>
                                        {event.label}
                                    </p>
                                </CheckButton>
                            )
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
                        <div className='px-4 my-2 w-full overflow-auto max-w-xs mx-auto'>
                            <p className="dark:text-gray-300 text-lg font-medium">
                                Ingrese la medida de {selectedCattleCaravan}
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
                            {selectedEventType === 'pregnant' ? (
                                <CattleResume
                                    withoutHeader={true}
                                    withoutClasses={true}
                                    cattle={{
                                        ...selectedCattles?.[0],
                                        state: 'PREGNANT' as CattleState,
                                        stateDate: new Date(selectedEventDate).toISOString()
                                    }}
                                />
                            ) : selectedEventType === 'cattle_birth' ? (
                                <div className='px-4 my-2 w-full overflow-auto max-w-xs mx-auto'>
                                    <p className="dark:text-gray-300 text-lg font-medium">
                                        Cantidad de nacidos en el parto
                                    </p>

                                    <div className="grid_buttons">
                                        {eventTypesList?.[2]?.eventDetails?.map((i, index) => {
                                            const selected = i.value === selectedEventDetail

                                            return (
                                                <button
                                                    disabled={isSubmitting}
                                                    className={`option_button bg-slate-100 dark:bg-clightgray flex-center ${selected ? `ring-2 dark:ring-clime` : `opacity-40 hover:opacity-100`}`}
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
                                <div className='flex-center gap-2 px-4'>
                                    <div className="w-max">
                                        <p className="dark:text-gray-300 text-lg font-medium">
                                            Cantidad de destetados
                                        </p>

                                        <div className="grid_buttons">
                                            {eventTypesList?.[1]?.eventDetails?.map((i, index) => {
                                                const selected = i.value === selectedEventDetail

                                                return (
                                                    <button
                                                        disabled={isSubmitting}
                                                        className={`option_button flex-center bg-slate-100 dark:bg-clightgray ${selected ? `ring-2 dark:ring-clime` : `opacity-70 hover:opacity-100`}`}
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
                                </div>
                            ) : (
                                <>
                                    <div className='px-4 my-2'>
                                        <p className="dark:text-gray-300 text-lg font-medium">
                                            Motivo de la {selectedEventType == 'death' ? 'muerte' : 'no preñez'}
                                        </p>
                                    </div>
                                    <div className="custom_list">
                                        {eventTypesList?.[selectedEventType == 'death' ? 5 : selectedEventType == 'not_pregnant' ? 4 : selectedEventType == 'cattle_birth' ? 3 : 0]?.eventDetails?.map((i, index) => {
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
                                                        className={`font-medium text-xl text-gray-600 dark:text-gray-300 text-start
                                            ${selected ? 'text-opacity-100' : 'dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100'}`}>
                                                        {i.label}
                                                    </p>
                                                </CheckButton>
                                            )

                                        })}
                                    </div>
                                </>
                            )}
                        </>
                    ) : null
                    }
                </>
            ) : step === 4 ? (
                <div className='px-4 my-2 w-full overflow-auto'>
                    <p className="dark:text-gray-300 text-lg font-medium mb-2">
                        Detalle del evento
                    </p>
                    <div className="label w-full">
                        <textarea
                            placeholder='Ingrese un detalle de ser necesario...'
                            {...register('observations')}
                            name="description"
                            className="textarea placeholder:text-base !min-h-48"
                        />
                    </div>
                </div>
            ) : null
            }

            {/* send and control buttons */}
            <div className="buttons_container mt-auto">
                <button
                    disabled={step == 1 || isSubmitting || (handleByCattle && step == 2)}
                    className='rounded_btn bg-slate-100 dark:bg-clightgray'
                    type='button'
                    onClick={() => setStep(step - 1)}
                >
                    <p className='dark:text-slate-400 text-slate-500'>Anterior</p>
                </button>

                <p className='input_instructions text-sm font-medium'><b>{step}</b> de 4</p>

                {step == 4 ? (
                    <button
                        className='rounded_btn bg-cgreen dark:bg-clime'
                        disabled={!selectedEventType || isSubmitting}
                        type='button'
                        onClick={handleSubmit(onSubmit)}
                    >
                        <p className='text-white dark:text-cgray'>
                            Finalizar
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