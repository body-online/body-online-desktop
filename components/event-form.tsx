'use client'

import toast from 'react-hot-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CattleProps, EventSchema, eventSchema } from '@/lib/types';
import { BodyMeasureIcon, CattleBirthIcon, DeathIcon, EventIcon, LoadingIcon, NotPregnantIcon, PregnantIcon } from './ui/icons';
import { detailsByEvent, eventTypesList } from '@/lib/constants';
import { createEvent } from '@/actions/event';
import { useRouter } from 'next/navigation';
import SelectInputSearch from './ui/select-input-search';
import { SelectOptionProps } from './ui/select-input';
import { useEffect, useState } from 'react';
import ResizablePanel from './ui/resizable-panel';
import { useSession } from 'next-auth/react';

type CustomCattleProps = Pick<
    CattleProps,
    "_id" | "caravan" | "state"
>;


export function EventForm({ cattles, defaultValues }: { cattles: CustomCattleProps[]; defaultValues?: any }) {
    const router = useRouter()
    const [cattlesList, setCattlesList] = useState<SelectOptionProps[]>([])
    const {
        register,
        handleSubmit,
        unregister,
        watch,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<EventSchema>({
        defaultValues,
        resolver: zodResolver(eventSchema)
    })
    const { data: session } = useSession()

    const onSubmit: SubmitHandler<EventSchema> = async (data: EventSchema) => {
        const toastSavingEvent = toast.loading('Creando evento...');
        try {
            const { error, data: createdEvent } = await createEvent(data);
            if (error) return toast.error(error)
            toast.success(`Evento creado exitosamente!`);
            reset();
            router.refresh();
        } catch (error) {
            toast.error('Ha ocurrido un error al crear el evento')
        } finally {
            toast.dismiss(toastSavingEvent)
        }
    }

    // event steps states
    const cattleId = watch('cattleId')
    const cattleSelected = cattles.find((c) => c?._id == watch('cattleId')) ?? undefined
    const eventDate = watch('eventDate')
    const eventType = watch('eventType')
    const measure = watch('measure')


    useEffect(() => { // this useEffect creates the list of caravans to search/select
        const cattleOptList: SelectOptionProps[] = []
        cattles.map((c) => cattleOptList.push({ label: c.caravan, value: c._id }))

        if (cattles.length > 0) {
            setCattlesList(cattleOptList ?? [])

        }
    }, [cattles])


    // useEffect(() => {
    //     const paramEventDate = searchParams.get('measureDate')
    //     const paramCattleId = searchParams.get('cattleId')

    //     if (paramCattleId) {
    //         setValue('cattleId', paramCattleId)
    //     }
    //     if (paramEventDate) {
    //         setValue('eventDate', paramEventDate as any)
    //     }
    //     if (paramCattleId || paramEventDate) {
    //         setValue('eventType', 'body_measure')
    //         return router.push(pathname)
    //     }


    // }, [searchParams])

    if (!cattles) return <p>No hemos encontrado individuos para asignar eventos</p>

    return (
        <form className="space-y-4 w-full max-w-max" onSubmit={handleSubmit(onSubmit)}>

            <div className="flex w-full gap-3 h-max">
                <SelectInputSearch
                    label='Caravana*'
                    placeholder='Seleccione una opción'
                    options={cattlesList}
                    value={cattleSelected ? { value: cattleSelected._id, label: cattleSelected?.caravan } : undefined}
                    isDisabled={cattlesList?.length <= 0 || isSubmitting}
                    handleChange={(objSelected: SelectOptionProps) => {
                        unregister('eventType')
                        return setValue('cattleId', objSelected.value);
                    }}
                    error={errors?.cattleId?.message}
                />

                <label htmlFor="eventDate">
                    <p className="input_label">Fecha del evento*</p>
                    <input
                        type='datetime-local'
                        className='input min-w-[50%] max-w-sm w-full'
                        {...register('eventDate')}
                        value={eventDate as any ?? ''}
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
                                const isDisabled = !cattleSelected || !event.allowedStates.includes(cattleSelected?.state) || isSubmitting
                                const selected = Boolean(eventType == event.value);
                                const buttonColor = selected ? `bg-cgreen cursor-pointer` : `bg-slate-100 active:bg-slate-200 md:hover:bg-slate-200`
                                const fillIcon = selected ? `fill-clime` : `fill-slate-600`
                                const strokeIcon = selected ? `stroke-clime` : `stroke-slate-600`

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
                    <div className="input_error">
                        {errors.eventType && (<p>{`${errors.eventType.message}`}</p>)}
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
                                const minIdeal = Number(session?.user?.minIdeal) ?? 15
                                const maxIdeal = Number(session?.user?.maxIdeal) ?? 20
                                const ideal = measureObj.value >= minIdeal && measureObj.value <= maxIdeal
                                return (
                                    <button
                                        className={`${selected ? `` : `opacity-65 hover:opacity-100`} 
                                                ${measureObj.value < minIdeal ? `bg-yellow-200` :
                                                ideal ? `bg-green-200` : `bg-orange-200`} 
                                                rounded-xl w-11 sm:w-12 h-11 sm:h-12 flex-center transition-all`}
                                        key={index}
                                        type='button'
                                        onClick={() => setValue('measure', measureObj.label)}
                                    >
                                        <p className={`${selected ? `` : `opacity-65 hover:opacity-100`} 
                                            ${measureObj.value < minIdeal ? `text-yellow-600` :
                                                ideal ? `text-green-600` : `text-orange-600`}
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
            <div className="mt-4">
                <label htmlFor="eventObservations">
                    <p className="input_label">Observaciones*</p>
                    <textarea {...register('observations')} className='textarea' placeholder='Observaciones...'></textarea>
                </label>
            </div>

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
        </form>
    )
}

export default EventForm