'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { CattleProps, createTaskSchema, CreateTaskSchema } from '@/lib/types';

import UsersList from './users-list'
import { ArrowsIcon, CloseIcon, LoadingIcon, } from '../ui/icons';
import { ExtendedUser } from '@/next-auth';
import { createTask } from '@/actions/task';
import FilterInput from '../ui/filter-input';
import { ProfileImage } from '../ui/navbar';
import CaravansList from './caravans-list';
import { AxiosError } from 'axios';
import Resume from '../ui/resume';
import UsersResume from './users-resume';
import CloseBtn from '../ui/close-btn';
import CaravansResume from './caravans-resume';
import { useSync } from '@/context/SyncContext';

const CreateTaskForm = ({ handleRefresh, handleClose }: { handleRefresh?: () => void; handleClose?: () => void }) => {
    const { isOnline, handleSyncOnline } = useSync();
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


    const onSubmit: SubmitHandler<CreateTaskSchema> = async (data: CreateTaskSchema) => {
        try {
            const { error } = await createTask(data);
            if (error) return toast.error(error)
            await handleSyncOnline()

            toast.success('Tarea registrada')
            if (handleClose) {
                setSelectedCattles([])
                setSelectedUsers([])
                setStep(1)
                reset();
                handleClose()
            }
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

    var expirationDate = watch('expirationDate') ? new Date(watch('expirationDate')) : undefined

    if (expirationDate) {

    }
    const expirationHour = expirationDate ? new Date(expirationDate)
        .toLocaleTimeString("es-AR", { hour: 'numeric', minute: 'numeric' }) : undefined

    const expiration = expirationDate ?
        new Date(expirationDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'short', year: 'numeric' }) : undefined

    return (
        <>
            <div className="header_container">
                <div className="overflow-x-auto w-full">
                    <div className="flex items-center gap-1 w-max py-1 px-2">
                        <div>
                            <p className="text-base font-medium">
                                Nueva tarea
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
                        {selectedUsers?.length > 0 &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />
                                <UsersResume
                                    assignedTo={selectedUsers}
                                    maxLong={3}
                                />
                            </>
                        }
                        {selectedCattles?.length > 0 &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />
                                <CaravansResume
                                    cattles={selectedCattles}
                                    truncateAt={3}
                                />
                            </>
                        }

                    </div>
                </div>
                {handleClose &&
                    <CloseBtn handleClose={handleClose} />
                }
            </div>
            {step === 1 ? (
                <div className='px-4'>
                    <label htmlFor="expirationDate">
                        <p className="dark:text-gray-300 text-lg font-medium mb-2">
                            Vencimiento de la tarea
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
                    <div className="px-4">
                        <p className="dark:text-gray-300 text-lg font-medium mb-2">
                            Responsables de la tarea
                        </p>
                    </div>

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
                            <p className='my-auto opacity-50'>Sin selecciones</p>
                        )}
                    </Resume>

                    <div className="px-4 my-2">
                        <FilterInput
                            placeholder={'Buscar por nombre...'}
                            disabled={isSubmitting}
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
                    <div className="px-4">
                        <p className="dark:text-gray-300 text-lg font-medium mb-2">
                            Individuos a medir
                        </p>
                    </div>


                    <Resume
                        handleClean={() => setSelectedCattles([])}
                        disabled={!watch('caravan')?.length || isSubmitting}
                        amount={watch('caravan')?.length}
                    >
                        {selectedCattles.length ? selectedCattles?.toReversed().map((cattle, cattleIndex) => (
                            <div
                                key={`cattle-${cattleIndex}`}
                                className='resume_chip min-w-max'
                            >
                                <p>
                                    {cattle.caravan}
                                </p>
                                <button
                                    type='button'
                                    onClick={() => setSelectedCattles(selectedCattles.filter(i => i._id != cattle._id))}
                                >
                                    <CloseIcon
                                        sizes='h-4 w-4'
                                        fill='fill-slate-500 dark:fill-slate-400 hover:fill-slate-600 dark:hover:fill-slate-300'
                                    />
                                </button>
                            </div>
                        )) : (
                            <p className='my-auto  opacity-50'>Sin selecciones</p>
                        )}
                    </Resume>


                    <div className='px-4 my-2'>
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
                <p className='input_instructions text-sm font-medium'>{step} de 3</p>
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
