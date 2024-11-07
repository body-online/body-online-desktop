'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { CattleProps, createTaskSchema, CreateTaskSchema } from '@/lib/types';

import UsersList from './users-list'
import { CloseIcon, LoadingIcon, } from '../ui/icons';
import { ExtendedUser } from '@/next-auth';
import CleanButton from '../ui/clean-button';
import { createTask } from '@/actions/task';
import FilterInput from '../ui/filter-input';
import { ProfileImage } from '../ui/navbar';
import CaravansList from './caravans-list';
import { AxiosError } from 'axios';
import Resume from '../ui/resume';

const stepInstructions = [
    {
        instructions: (
            <p className="input_instructions text-lg px-4 mb-2">
                Seleccione los <b>responsables</b> de realizar las mediciones de la tarea.
            </p>
        )
    }
]
const CreateTaskForm = ({ handleRefresh }: { handleRefresh?: () => void }) => {
    // step of create task form
    const [step, setStep] = useState<number>(1)

    // step 2 states: users list
    const [selectedUsers, setSelectedUsers] = useState<ExtendedUser[]>([])
    const [searchUsers, setSearchUsers] = useState<string>('')

    // step 3 states: cattles list
    const [selectedCattles, setSelectedCattles] = useState<CattleProps[]>([])
    const [searchCattles, setSearchCattles] = useState<string>('')

    const { register, setValue, handleSubmit, watch, reset, formState: { errors, isSubmitting } } =
        useForm<z.infer<typeof createTaskSchema>>({ resolver: zodResolver(createTaskSchema), })

    function handleClose() {
        setSelectedCattles([])
        setSelectedUsers([])
        setStep(1)
        reset();
    }

    const onSubmit: SubmitHandler<CreateTaskSchema> = async (data: CreateTaskSchema) => {
        try {
            const { error } = await createTask(data);
            if (error) return toast.error(error)

            toast.success('Tarea registrada')
            handleClose()
        } catch (error: AxiosError | any) {
            console.log(error)
            toast.error(error?.response?.data?.message ?? 'Ha ocurrido un error al crear la tarea.')
        } finally {
            if (handleRefresh) handleRefresh()
        }
    }

    // update the form values after any list changes
    useEffect(() => { setValue('assignedTo', selectedUsers?.map(i => i.id as string) ?? []) }, [selectedUsers])
    useEffect(() => {
        setValue('caravan', selectedCattles?.map(i => i.caravan as string) ?? [])
        setValue('cattleIds', selectedCattles?.map(i => i._id as string) ?? [])
    }, [selectedCattles])

    return (
        <>
            {/* className='h-full w-full flex flex-col max-w-2xl mx-auto overflow-hidden' */}
            {/* <div className="mx-4 chip chip_gray mb-2">
                <p className='input_instructions text-sm font-medium'><b className='text-base'>{step}</b> de 3</p>
                {stepInstructions[step].instructions}
            </div> */}
            {step === 1 ? (
                <div className='px-4'>
                    <label htmlFor="expirationDate">
                        <p className="input_instructions mb-3">
                            Ingrese la fecha de vencimiento de la tarea.
                        </p>

                        <input
                            disabled={isSubmitting}
                            className='input w-full max-w-xs'
                            value={watch('expirationDate') as any ?? ''}
                            {...register('expirationDate')}
                            type='datetime-local'
                        />

                        <div className="input_error">
                            {errors.expirationDate && (<p>{`${errors.expirationDate.message}`}</p>)}
                        </div>
                    </label>
                </div>
            ) : step === 2 ? (
                <>
                    <Resume
                        handleClean={() => setSelectedUsers([])}
                        disabled={!watch('assignedTo')?.length || isSubmitting}
                        amount={watch('assignedTo')?.length}
                    >
                        {selectedUsers.length ? selectedUsers?.toReversed().map((user, index) => (
                            <div key={index} className='resume_chip min-w-max'>
                                <ProfileImage user={user} height='h-6' width='w-6' />
                                <p>
                                    {user.name}
                                </p>
                                <button
                                    type='button'
                                    onClick={() => setSelectedUsers(selectedUsers.filter(i => i.id != user.id))}
                                >
                                    <CloseIcon
                                        sizes='h-4 w-4'
                                        fill='fill-slate-500 dark:fill-slate-400 hover:fill-slate-600 dark:hover:fill-slate-300'
                                    />
                                </button>
                            </div>
                        )) : (
                            <p className='my-auto input_instructions'>Sin selecciones</p>
                        )}
                    </Resume>
                    <div className="px-4 mb-2">
                        <FilterInput
                            placeholder={'Ej. Juan Perez'}
                            disabled={isSubmitting}
                            // value={searchUsers}
                            onChange={(e: any) => {
                                setSearchUsers(e);
                            }}
                        />
                    </div>



                    <UsersList
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                        search={searchUsers}
                        disabled={isSubmitting}
                    />
                </>
            ) : (
                <>
                    <div className='px-4'>

                        {/* resume */}
                        <p className="input_instructions">
                            Seleccione las caravanas que deben ser medidas.
                        </p>
                        <div className='flex gap-2 items-center h-14'>
                            <CleanButton
                                onClick={() => setSelectedCattles([])}
                                disabled={!watch('caravan')?.length || isSubmitting}
                                amount={watch('caravan')?.length}
                            />

                            <div className="w-full overflow-x-auto">
                                <div className='flex gap-2 w-max'>
                                    {selectedCattles?.toReversed().map((cattle, index) => (
                                        <div key={index} className='resume_chip'>
                                            <p className='text-base font-semibold'>{cattle.caravan}</p>
                                            <button
                                                type='button'
                                                onClick={() => setSelectedCattles(selectedCattles.filter(i => i._id != cattle._id))}
                                                disabled={isSubmitting}
                                            >
                                                <CloseIcon sizes='h-4 w-4' fill='fill-slate-500 dark:fill-slate-400 hover:fill-slate-600 dark:hover:fill-slate-300' />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <FilterInput
                            placeholder={'Buscar por caravana...'}
                            disabled={isSubmitting}
                            onChange={(e: any) => {
                                setSearchCattles(e);
                            }}
                        />
                    </div>

                    {/* list of users availables */}
                    <CaravansList
                        selectedCattles={selectedCattles}
                        setSelectedCattles={setSelectedCattles}
                        search={searchCattles}
                        disabled={isSubmitting}
                    />
                </>
            )
            }

            <div className="buttons_container">
                <button
                    disabled={step == 1 || isSubmitting}
                    className='rounded_btn bg-white dark:bg-clightgray'
                    type='button'
                    onClick={() => setStep(step - 1)}
                >
                    <p className='dark:text-slate-400 text-slate-500'>Anterior</p>
                </button>

                {step == 3 ? (
                    <button
                        className='rounded_btn bg-cgreen dark:bg-clime'
                        disabled={
                            isSubmitting ||
                            !(watch('expirationDate') as any) ||
                            !(watch('assignedTo')?.length) ||
                            !watch('caravan')?.length
                        }
                        type='button'
                        onClick={handleSubmit(onSubmit)}
                    >
                        {isSubmitting ? <LoadingIcon fill='fill-clime dark:fill-cgray' /> : null}
                        <p className='text-white dark:text-cgray'>
                            {isSubmitting ? 'Creando...' : "Crear"}
                        </p>
                    </button>
                ) : (
                    <button
                        className='rounded_btn bg-cgreen dark:bg-clime'
                        disabled={
                            isSubmitting ||
                            (step === 1 && !(watch('expirationDate') as any)) ||
                            (step === 2 && !(watch('assignedTo')?.length))
                        }
                        type={'button'}
                        onClick={() => setStep(step + 1)}
                    >
                        <p className='text-white dark:text-cgray'>
                            Continuar
                        </p>
                    </button>
                )}
            </div >
        </>
    )
}

export default CreateTaskForm
