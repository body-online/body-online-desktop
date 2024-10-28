'use client';

import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { z } from 'zod';

import { CattleProps, EventSchema, eventSchema, TaskProps } from '@/lib/types'
import { createEvent } from '@/actions/event';
import { zodResolver } from '@hookform/resolvers/zod';

import CaliperMeasure from '../event/caliper-measure';
import { EventIcon, LoadingIcon } from '../ui/icons';
import CheckButton from '../ui/check-button';
import CloseBtn from '../ui/close-btn';
import Modal from '../ui/modal'
import { useSession } from 'next-auth/react';
import ChipState from '../cattles/chip-state';
import ChipBodyCondition from '../cattles/chip-body-condition';

const UpdateTaskButton = (
    { task, setTask, defaultValues }: { task: TaskProps; setTask: Dispatch<SetStateAction<TaskProps>>; defaultValues: DefaultValues<EventSchema> }
) => {
    const { data: session } = useSession()
    const [pendingMeasures, setPendingMeasures] = useState<CattleProps[]>([...task?.cattleIds])
    const [step, setStep] = useState<number>(1)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedCattle, setSelectedCattle] = useState<any>()

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

            // update the task state if everything was ok
            if (event) toast.success(`Medida ${formValues.measure} asignada a ${selectedCattle.caravan} `)
            setTask({
                ...task,
                caravan: leftCaravans, //list of caravans
                measuredCattles: [...task.measuredCattles, measuredCattle?.caravan],
                completed: !leftCaravans.length
            })
            setPendingMeasures(leftMeasures)

            if (!leftCaravans?.length) {
                return handleClose()
            } else {
                reset()
                setSelectedCattle(leftCaravans[0])
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
                <div className='card'>
                    <div className="header_container">
                        <h2 className="semititle">
                            {step == 1 ? 'Individuos pendientes de medición' : (step === 2 && selectedCattle) ? `Individuo ${selectedCattle.caravan}` : null}
                        </h2>

                        <CloseBtn handleClose={handleClose} />
                    </div>

                    <div className="h-full overflow-auto flex flex-col">
                        {step == 1 ? (
                            <>
                                <p className="input_instructions mb-3 px-4">
                                    Seleccione la caravana a medir
                                </p>

                                <div
                                    className="custom_list"
                                >
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
                                                <div className=" overflow-auto w-full ">
                                                    <div className="flex gap-3">
                                                        <div className="sticky left-0 backdrop-blur flex-center w-max">
                                                            <p className={`text-base md:text-lg px-2 font-medium text-gray-600 dark:text-gray-300 ${selected ? 'text-opacity-100' : 'dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100'}`}>
                                                                {cattle.caravan}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <ChipState state={cattle.state} />
                                                        </div>
                                                        <div>
                                                            <ChipBodyCondition
                                                                bodyRanges={cattle?.geneticId?.bodyRanges}
                                                                measure={Number(cattle?.bodyCondition ?? 0)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CheckButton>
                                        )
                                    })}
                                </div>
                            </>
                        ) : (step == 2 && selectedCattle && selectedCattle?.geneticId) ? (
                            <div className='px-4 flex flex-col'>
                                <p className="input_instructions mb-3">
                                    Ingrese la medida de la caravana {selectedCattle.caravan}.
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
                    </div>

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