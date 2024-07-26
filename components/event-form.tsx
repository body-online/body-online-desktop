import { FieldErrors, SubmitHandler, UseFormClearErrors, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormSetError, UseFormSetValue, UseFormUnregister, UseFormWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import React, { useEffect, useState } from 'react'

import { CattleProps, EventSchema } from '@/lib/types'

import { BodyMeasureIcon, CattleBirthIcon, DeathIcon, InfoIcon, LoadingIcon, MiniAddIcon, NotPregnantIcon, PregnantIcon } from './ui/icons'
import { LayoutBottom } from './ui/default-layout'
import { createEvent } from '@/actions/event'
import SelectCattle from './cattle/select-cattle'
import { detailsByEvent, eventTypesList } from '@/lib/constants'
import SelectEventType from './events/select-type'
import SelectEventDetail from './events/select-details'
import StepIndicator from './ui/step-indicator'

type EventFormProps = {
    handleSubmit: UseFormHandleSubmit<EventSchema>;
    register: UseFormRegister<EventSchema>;
    unregister: UseFormUnregister<EventSchema>;
    isSubmitting?: boolean;
    errors: FieldErrors<EventSchema>;
    reset: UseFormReset<EventSchema>;
    watch: UseFormWatch<EventSchema>;
    setValue: UseFormSetValue<EventSchema>;
    handleCloseEventsModal: () => void;
    defaultCattle?: CattleProps;
    defaultDate?: string | Date;
    setError: UseFormSetError<EventSchema>;
    clearErrors: UseFormClearErrors<EventSchema>;
};

const EventForm = ({ defaultCattle, defaultDate, handleSubmit, register, unregister, isSubmitting, errors, reset, watch, setValue, setError, handleCloseEventsModal, clearErrors }: EventFormProps) => {
    const [step, setStep] = useState<number>(defaultCattle ? 1 : 0)
    const [selectedCattle, setSelectedCattle] = useState<CattleProps | undefined>(defaultCattle)
    const router = useRouter();

    const onSubmit: SubmitHandler<EventSchema> = async (data: EventSchema) => {
        console.log(data)
        try {
            const { error } = await createEvent(data);
            if (error) return toast.error(error);

            reset();
            handleCloseEventsModal();
            router.refresh();
            toast.success('Evento creado')
        } catch (error) {
            toast.error("Ha ocurrido un error al crear el evento");
        }
    };

    const eventType = watch('eventType');
    const measure = watch('measure');
    const eventDetail = watch('eventDetail');

    const lastStateDate = selectedCattle?.stateDate ? new Date(selectedCattle?.stateDate) : undefined;
    const lastBodyCondDate = selectedCattle?.bodyConditionDate ? new Date(selectedCattle?.bodyConditionDate) : undefined;
    const lastEventDate = lastStateDate && lastBodyCondDate ?
        (lastBodyCondDate > lastStateDate ? lastBodyCondDate : lastStateDate) :
        (lastBodyCondDate ?? lastStateDate ?? undefined);


    useEffect(() => { // set empty fields on change cattle
        unregister('measure');
        unregister('eventDetail');
        unregister('eventType');
        unregister('eventDate');
    }, [selectedCattle])

    useEffect(() => { // set empty fields on change event type
        unregister('measure');
        unregister('eventDetail');
        unregister('eventDate');
    }, [eventType])

    useEffect(() => { // set cattle id equal to default cattle value
        if (defaultCattle)
            setValue('cattleId', defaultCattle?._id)
    }, [defaultCattle])


    return (
        <>
            {/* resume */}
            {/* <div className="sticky top-0 z-50 px-default border-b custom-border">
                <div className="flex divide-x divide-slate-200 dark:divide-clightgray items-center w-max h-max">
                    <StepIndicator
                        label='Caravana'
                        value={selectedCattle?.caravan}
                        active={step == 0}
                    />
                    <StepIndicator
                        label='Tipo de evento'
                        value={watch('eventType') ? eventTypesList.find((i) => { return i.value === eventType })?.label : undefined}
                        active={step == 1}
                    />
                    <StepIndicator
                        label='Detalle / Motivo'
                        value={eventDetail ?? measure}
                        active={step == 2}
                    />
                    <StepIndicator
                        label='Detalle / Motivo'
                        value={watch('eventDate') ? new Date(watch('eventDate')).toLocaleDateString() : undefined}
                        active={step == 3}
                    />
                    <StepIndicator
                        label='Evento'
                        value={}
                        active={}
                    />
                    <StepIndicator
                        label='Detalle'
                        value={}
                        active={}
                    />
                    <StepIndicator
                        label='Fecha'
                        value={}
                        active={}
                    />
                    <div>
                        <p className={`text-xs ${step == 0 ? 'text-caqua dark:text-clime' : 'opacity-50'}`}></p>
                        <p>{}</p>
                    </div>
                    <div>
                        <p className={`text-xs ${step == 1 ? 'text-caqua dark:text-clime' : 'opacity-50'}`}></p>
                        <p>{watch('eventType') ? eventTypesList.find((i) => { return i.value === eventType })?.label : "-"}</p>
                    </div>
                    <div>
                        <p className={`text-xs ${step == 2 ? 'text-caqua dark:text-clime' : 'opacity-50'}`}></p>
                        <p></p>
                    </div>
                    <div>
                        <p className={`text-xs ${step == 3 ? 'text-caqua dark:text-clime' : 'opacity-50'}`}></p>
                        <p>{watch('eventDate') ? `${new Date(watch('eventDate')).toLocaleDateString()}` : '-'}</p>
                    </div>
                    <div>
                        <p className='text-caqua dark:text-clime text-sm truncate'>
                        </p>
                    </div>
                </div>
            </div> */}

            {/* form */}
            {isSubmitting ? (
                <div className="flex-center gap-2 py-default">
                    <LoadingIcon />
                    <p>Creando evento...</p>
                </div>
            ) : (
                <div className='h-full flex flex-col gap-y-3 overflow-auto w-full'>
                    <form onSubmit={(e) => { return e.preventDefault() }} className="py-default mx-auto max-w-2xl w-full px-default">
                        {
                            step == 0 ? (
                                <SelectCattle selectedCattle={selectedCattle} setSelectedCattle={setSelectedCattle} />
                            ) : step == 1 && selectedCattle ? (
                                <SelectEventType
                                    watch={watch}
                                    setValue={setValue}
                                    unregister={unregister}
                                    isSubmitting={isSubmitting}
                                    selectedCattle={selectedCattle}
                                />
                            ) : step == 2 && selectedCattle ? (
                                <SelectEventDetail
                                    eventType={eventType}
                                    eventDetail={eventDetail}
                                    selectedMeasure={measure}
                                    setValue={setValue}
                                    isSubmitting={isSubmitting}
                                    selectedCattle={selectedCattle}
                                />
                            ) : step == 3 ? (
                                <div className='h-full flex flex-col justify-between gap-y-3'>
                                    {/* <h3 className='semititle'>Detalles</h3> */}
                                    {lastEventDate &&
                                        <div className='py-4 rounded-lg border custom-border px-3'>
                                            <div className="flex items-center gap-2">
                                                <InfoIcon fill='fill-caqua dark:fill-clime' />
                                                <p>
                                                    La fecha de tu evento debe ser posterior a
                                                    <b className='text-caqua dark:text-clime'>
                                                        {' '}{new Date(lastEventDate).getDate()}/{new Date(lastEventDate)?.getMonth() + 1}/{new Date(lastEventDate)?.getFullYear()}
                                                    </b>
                                                </p>
                                            </div>
                                            <p className='ml-7 text-sm mt-2'>
                                                Último evento registrado del individuo {selectedCattle?.caravan}
                                            </p>
                                        </div>
                                    }
                                    <div>
                                        <label htmlFor="eventDate">
                                            <p className="input_label">Fecha del evento*</p>
                                            <input
                                                disabled={isSubmitting}
                                                className='input min-w-[50%] w-full'
                                                value={watch('eventDate') as any ?? ''}
                                                {...register('eventDate')}
                                                type='datetime-local'
                                            />
                                            <div className="input_error">
                                                {errors.eventDate && (<p>{`${errors.eventDate.message}`}</p>)}
                                            </div>
                                        </label>
                                    </div>
                                    <div className='mt-auto'>
                                        <label htmlFor="eventObservations">
                                            <p className="input_label">Observaciones*</p>
                                            <textarea
                                                disabled={isSubmitting}
                                                {...register('observations')}
                                                className='textarea'
                                                placeholder='Observaciones...'
                                            >
                                            </textarea>
                                        </label>
                                    </div>
                                </div>
                            ) : null
                        }
                    </form>
                </div>
            )
            }

            {/* send and control buttons */}
            <LayoutBottom>
                <div className='w-full max-w-2xl mx-auto'>

                    <div className='flex-between gap-4  items-stretch justify-between w-full'>
                        {/* prev */}
                        <button
                            disabled={step != 0 && !watch('cattleId') || isSubmitting}
                            onClick={() => {
                                if (step == 0) return handleCloseEventsModal()
                                setStep(step - 1)
                            }}
                            className='rounded_btn bg-csemigreen dark:bg-clightgray md:max-w-max px-3'
                        >
                            <p className='text-white py-1'>{step == 0 ? 'Cancelar' : 'Anterior'}</p>
                        </button>

                        {/* next and submit */}
                        {step < 3 ?
                            <button
                                disabled={
                                    isSubmitting ||
                                    (step == 0 && !watch('cattleId')) ||
                                    (step === 1 && !watch('eventType')) ||
                                    (step === 2 && eventType != 'pregnant' && ((eventType != 'body_measure' && !eventDetail) || (eventType == 'body_measure' && !measure)))
                                }
                                onClick={() => { setStep(step + 1) }}
                                className='rounded_btn bg-csemigreen dark:bg-clightgray md:max-w-max px-3'
                            >
                                <p className='text-white py-1'>Siguiente</p>
                            </button>
                            :
                            <button
                                disabled={isSubmitting || !watch('eventDate') || (lastEventDate && lastEventDate > new Date(watch('eventDate')))}
                                className='rounded_btn bg-csemigreen dark:bg-clime md:max-w-max px-3'
                                type='button'
                                onClick={handleSubmit(onSubmit)}
                            >
                                {isSubmitting ? (
                                    <LoadingIcon fill='fill-clime dark:fill-cblack' />
                                ) : (
                                    <div className='flex-center gap-1'>
                                        <p className='text-white py-1 dark:text-cblack'>Crear evento</p>
                                        <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                                    </div>
                                )}
                            </button>
                        }
                    </div>
                </div>
            </LayoutBottom >
        </>
    )
}

export default EventForm;
