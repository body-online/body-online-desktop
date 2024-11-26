'use client';

import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { CattleProps, EventSchema, eventSchema, TaskProps } from '@/lib/types'
import { createEvent } from '@/actions/event';

import { ArrowsIcon, EventIcon, LoadingIcon } from '../ui/icons';
import ChipBodyCondition from '../cattles/chip-body-condition';
import CaliperMeasure from '../event/caliper-measure';
import CattleResume from '../ui/cattle-resume';
import CheckButton from '../ui/check-button';
import CloseBtn from '../ui/close-btn';
import Modal from '../ui/modal'
import { useSync } from '@/context/SyncContext';

const UpdateTaskButton = (
    { task, setTask, defaultValues }: { task: TaskProps; setTask: Dispatch<SetStateAction<TaskProps>>; defaultValues: DefaultValues<EventSchema> }
) => {
    const { data: session } = useSession()
    const { refreshPendingMeasures } = useSync()
    const [pendingMeasures, setPendingMeasures] = useState<CattleProps[]>([...task?.cattleIds])
    const [selectedCattle, setSelectedCattle] = useState<CattleProps | any>()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [step, setStep] = useState<number>(1)

    function handleOpen() {
        setSelectedCattle(task?.cattleIds?.[0]);
        return setIsOpen(true)
    }
    function handleClose() {
        reset();
        setSelectedCattle(undefined);
        return setIsOpen(false)
    }

    const {
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
        resetField,
    } = useForm<z.infer<typeof eventSchema>>({
        defaultValues: defaultValues,
        resolver: zodResolver(eventSchema),
    })

    const onSubmit: SubmitHandler<EventSchema> = async (formValues: EventSchema) => {
        try {
            if (!selectedCattle) return null

            const measuredCattle = pendingMeasures.find((cattle) => cattle._id === formValues.cattleId)
            const leftMeasures: CattleProps[] = pendingMeasures?.filter((cattle) => cattle._id != formValues.cattleId)
            const leftCaravans: string[] = leftMeasures?.map((cattle) => cattle.caravan)
            if (!measuredCattle) return toast.error('No hemos encontrado la caravana seleccionada')


            const { error, data: event } = await createEvent({ ...formValues, caravan: selectedCattle.caravan });
            if (error) return toast.error(error)
            await refreshPendingMeasures()

            // update the task state if everything was ok
            if (event) toast.success(`Medida ${formValues.measure} asignada a ${selectedCattle.caravan} `)
            setTask({
                ...task,
                caravan: leftCaravans, //list of caravans
                measuredCattles: [...task.measuredCattles, measuredCattle?.caravan],
                completed: !leftCaravans.length
            })


            if (!leftCaravans?.length) {
                return handleClose()
            } else {
                reset()
                setSelectedCattle(leftCaravans?.[0])
                return setStep(1)
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message ?? 'Ha ocurrido un error al crear la tarea.')
        }
    }

    useEffect(() => {
        resetField('measure');
        if (selectedCattle?._id) {
            setValue('cattleId', selectedCattle._id)
            setValue('eventDate', new Date().toISOString() as any)
        }
    }, [selectedCattle])

    var assignedToMe = task.assignedTo.find((user) => user.email == session?.user.email)


    var expirationDate = new Date(task.expirationDate)

    const expirationHour = expirationDate ? new Date(expirationDate)
        .toLocaleTimeString("es-AR", { hour: 'numeric', minute: 'numeric' }) : undefined

    const expiration = expirationDate ?
        new Date(expirationDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'short', year: 'numeric' }) : undefined

    return (
        <>
            <button
                className="rounded_btn bg-cgreen dark:bg-clime"
                type='button'
                disabled={task.completed || !pendingMeasures?.length || !session?.user || !assignedToMe}
                onClick={handleOpen}
            >
                <p className='text-white dark:text-cgray'>
                    Medir
                </p>
                <EventIcon stroke='stroke-clime dark:stroke-cgray' />
            </button>

            <Modal isOpen={isOpen} handleClose={handleClose}>
                <div className='card_modal max-w-2xl mx-auto w-full'>
                    <div className="header_container">
                        <div className="overflow-x-auto w-full">
                            <div className="flex items-center gap-1 w-max py-1 px-2">
                                <div>
                                    <p className="text-base font-medium">
                                        Nueva medición
                                    </p>
                                </div>

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

                                {selectedCattle?.caravan &&
                                    <>
                                        <ArrowsIcon direction='-rotate-90' />
                                        <p className=''>
                                            {selectedCattle?.caravan}
                                        </p>
                                    </>
                                }


                                {watch('measure') && selectedCattle?.geneticId?.bodyRanges.length == 2 &&
                                    <>
                                        <ArrowsIcon direction='-rotate-90' />

                                        <ChipBodyCondition bodyRanges={selectedCattle.geneticId.bodyRanges} measure={watch('measure')} />
                                    </>
                                }
                            </div>
                        </div>

                        {handleClose &&
                            <CloseBtn handleClose={handleClose} />
                        }
                    </div>

                    <>
                        {
                            step == 1 ? (
                                <>
                                    <div className="px-4 mb-2">
                                        <p className="dark:text-gray-300 text-lg font-medium">
                                            Individuo a medir
                                        </p>
                                    </div>

                                    <div className="custom_list">
                                        {pendingMeasures.map((cattle, index) => {

                                            const selected = cattle._id === selectedCattle?._id;
                                            return (
                                                <CheckButton
                                                    key={index}
                                                    value={cattle._id}
                                                    label={cattle.caravan}
                                                    onClick={() => setSelectedCattle(cattle)}
                                                    selected={selected}
                                                    disabled={isSubmitting}
                                                >
                                                    <CattleResume withoutHeader={true} cattle={{ ...cattle, bodyRanges: cattle.geneticId.bodyRanges }} withoutClasses={true} />
                                                </CheckButton>
                                            )
                                        })}
                                    </div>
                                </>
                            ) : step == 2 && selectedCattle && selectedCattle?.geneticId ? (
                                <div className='px-4 flex flex-col gap-2'>
                                    <p className="dark:text-gray-300 text-lg font-medium">
                                        Indique la medida del caliper
                                    </p>

                                    <CaliperMeasure
                                        min={Number(selectedCattle?.geneticId?.bodyRanges?.[0])}
                                        max={Number(selectedCattle?.geneticId?.bodyRanges?.[1])}
                                        disabled={isSubmitting}
                                        measure={watch('measure')}
                                        setMeasure={({ measure, eventDetail }) => {
                                            setValue('eventDetail', eventDetail);
                                            setValue('measure', measure);
                                        }}
                                    />
                                </div>
                            ) : null}
                    </>

                    <div className="buttons_container">
                        <button
                            disabled={isSubmitting || !watch('cattleId') || step == 1}
                            className='rounded_btn bg-white dark:bg-clightgray'
                            type='button'
                            onClick={() => setStep(step - 1)}
                        >
                            <p>Anterior</p>
                        </button>

                        <p className='input_instructions text-sm font-medium'>{step} de 2</p>

                        <button
                            className='rounded_btn bg-cgreen dark:bg-clime'
                            disabled={(step == 2 && !watch('measure')) || isSubmitting || !watch('cattleId')}
                            type={step === 2 ? 'submit' : 'button'}
                            onClick={step == 2 ? handleSubmit(onSubmit) : () => setStep(step + 1)}
                        >
                            {isSubmitting ? <LoadingIcon fill='fill-clime dark:fill-cgray' /> : null}
                            <p className='text-white dark:text-cgray'>
                                {isSubmitting ? 'Completando' : step == 2 ? 'Completar' : 'Continuar'}
                            </p>
                            {/* <EventIcon stroke='stroke-clime dark:stroke-cgray' /> */}
                        </button>
                    </div>
                </div>
            </Modal >
        </ >
    )
}

export default UpdateTaskButton;