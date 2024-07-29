import { FieldErrors, SubmitHandler, UseFormClearErrors, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormSetError, UseFormSetValue, UseFormUnregister, UseFormWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import React, { useEffect, useState } from 'react'

import { CattleProps, EventSchema } from '@/lib/types'

import { BodyMeasureIcon, CattleBirthIcon, DeathIcon, InfoIcon, LoadingIcon, MiniAddIcon, NotPregnantIcon, PregnantIcon } from './ui/icons'
import { LayoutBody, LayoutBottom } from './ui/default-layout'
import { createEvent } from '@/actions/event'
import SelectCattle from './cattle/select-cattle'
import { detailsByEvent, eventTypesList } from '@/lib/constants'
import SelectEventType from './events/select-type'
import SelectEventDetail from './events/select-details'
import StepIndicator from './ui/step-indicator'
import Card from './ui/card'
import StepsContainer from './ui/steps-container'

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
    // defaultDate?: string | Date;
    // setError: UseFormSetError<EventSchema>;
    // clearErrors: UseFormClearErrors<EventSchema>;
};

const EventForm = ({ defaultCattle, handleSubmit, register, unregister, isSubmitting, errors, reset, watch, setValue, handleCloseEventsModal }: EventFormProps) => {
    const [step, setStep] = useState<number>(defaultCattle ? 1 : 0)
    const [selectedCattle, setSelectedCattle] = useState<CattleProps | undefined>(defaultCattle)
    const router = useRouter();

    const onSubmit: SubmitHandler<EventSchema> = async (data: EventSchema) => {
        try {
            const { error } = await createEvent(data);
            if (error) return toast.error(error);

            reset();
            handleCloseEventsModal();
            toast.success('Evento creado')
            return router.refresh();
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
        unregister('observations');
    }, [selectedCattle])

    useEffect(() => { // set empty fields on change event type
        unregister('measure');
        unregister('eventDetail');
        unregister('eventDate');
        unregister('observations');
    }, [eventType])

    useEffect(() => { // set cattle id equal to default cattle value
        if (defaultCattle)
            setValue('cattleId', defaultCattle?._id)
    }, [defaultCattle])


    return (
        <>
            {/* resume */}
            <StepsContainer>
                <StepIndicator
                    label='Individuo'
                    value={selectedCattle?.caravan}
                    active={step == 0}
                    step={'1'}
                />
                <StepIndicator
                    label='Tipo de evento'
                    value={watch('eventType') ? eventTypesList.find((i) => { return i.value === eventType })?.label : undefined}
                    active={step == 1}
                    step={'2'}
                />
                <StepIndicator
                    label='Detalle / Motivo'
                    value={eventType === 'pregnant' ? 'No requiere' : (eventDetail ?? measure)}
                    active={step == 2}
                    step={'3'}
                />
                <StepIndicator
                    label='Fecha'
                    value={(lastEventDate && lastEventDate < new Date(watch('eventDate'))) ? new Date(watch('eventDate')).toLocaleDateString() : undefined}
                    active={step == 3}
                    step={'4'}
                />
            </StepsContainer>

            <LayoutBody>
                {isSubmitting ? (
                    <div className="flex-center h-full gap-2">
                        <LoadingIcon />
                        <p className='text-base'>Creando evento...</p>
                    </div>
                ) : (

                    <form onSubmit={(e) => { return e.preventDefault() }} className=' px-default py-default'>
                        {step == 0 ? (
                            <SelectCattle
                                selectedCattle={selectedCattle}
                                setSelectedCattle={(e) => {
                                    setSelectedCattle(e)
                                    return setValue('cattleId', e._id)
                                }}
                            />
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
                                {lastEventDate &&
                                    <div className="mb-2">
                                        <Card>
                                            <div className="flex-center w-max gap-2 mb-3">
                                                <InfoIcon />
                                                <h2 className='uppercase text-sm font-medium tracking-wide'>Importante</h2>
                                            </div>
                                            <p>
                                                La fecha del evento debe ser posterior a
                                                <b>
                                                    {' '}{new Date(lastEventDate).getDate()}/{new Date(lastEventDate)?.getMonth() + 1}/{new Date(lastEventDate)?.getFullYear()}
                                                </b>
                                            </p>
                                            <p className='text-sm opacity-50 mt-1'>
                                                (Último evento registrado del individuo {selectedCattle?.caravan})
                                            </p>
                                        </Card>
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
                                <div>
                                    <label htmlFor="eventObservations">
                                        <p className="input_label">Observaciones*</p>
                                        <textarea
                                            disabled={isSubmitting}
                                            {...register('observations')}
                                            className='h-32 md:h-60 textarea'
                                            placeholder='Observaciones...'
                                        >
                                        </textarea>
                                    </label>
                                </div>
                            </div>
                        ) : null}
                    </form>
                )
                }
            </LayoutBody>

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
