'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { z } from 'zod';

import { registerUser } from '@/actions/register';
import { RegisterSchema } from '@/schemas';

import HorizontalSelector from '../ui/horizontal-selector';
import { LoadingIcon, MiniAddIcon } from '../ui/icons';

export function AddUserBtn({ customText, handleRefresh }: { customText?: string; handleRefresh?: () => void }) {
    const [isOpen, setIsOpen] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof RegisterSchema>>({ resolver: zodResolver(RegisterSchema), defaultValues: { type: 'operator' } })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        try {
            const { data, error } = await registerUser({ ...values });
            if (error) return toast.error(error ?? 'Ha ocurrido un error')

            reset();
            handleClose()
            if (handleRefresh) handleRefresh()
        } catch (error) {
            console.log(error)
            toast.error("Ha ocurrido un error al crear el operario");
        }
    };

    const handleClose = () => {
        setIsOpen(false)
    }
    const handleOpen = () => {
        setIsOpen(true)
    }

    return (
        <>
            {isOpen ? (
                <div className='flex flex-col w-full dark:bg-clightgray/50 border custom-border p-2 md:p-3 rounded-lg'>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor='type' className='w-full'>
                                {/* <p className="input_label">Tipo de usuario*</p> */}
                                <div className="flex gap-2 mt-2">
                                    <HorizontalSelector
                                        options={[
                                            { label: 'Operario', value: 'operator' },
                                            { label: 'Administrador', value: 'owner' }
                                        ]}
                                        selected={watch('type') ?? 'operator'}
                                        onChange={(value) => setValue('type', value as 'operator' | 'owner')}
                                    />
                                </div>
                                <div className="input_error">
                                    {errors.type && (<p>{`${errors.type.message}`}</p>)}
                                </div>
                            </label>
                        </div>

                        <div>
                            <label htmlFor='name' className='w-full'>
                                {/* <p className="input_label">Nombre completo*</p> */}
                                <input
                                    {...register("name")}
                                    placeholder='Nombre completo'
                                    disabled={isSubmitting}
                                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                                    type="text"
                                    name='name'
                                />
                                <div className="input_error">
                                    {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                </div>
                            </label>
                        </div>

                        <div>
                            <label htmlFor='email' className='w-full'>
                                {/* <p className="input_label">Email*</p> */}
                                <input
                                    {...register("email")}
                                    placeholder='Email'
                                    disabled={isSubmitting}
                                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                                    type="email"
                                    name='email'
                                />
                                <div className="input_error">
                                    {errors.email && (<p>{`${errors.email.message}`}</p>)}
                                </div>
                            </label>
                        </div>

                        <div>
                            <label htmlFor='password' className='w-full'>
                                <p className="input_label">Contraseña*</p>
                                <input
                                    {...register("password")}
                                    disabled={isSubmitting}
                                    placeholder='••••••••'
                                    className={`input ${errors.password ? 'border-red-500' : ''}`}
                                    type="password"
                                    name='password'
                                />
                                <div className="input_error">
                                    {errors.password && (<p>{`${errors.password.message}`}</p>)}
                                </div>
                            </label>
                        </div>

                        <div className="flex-between gap-2">
                            <button
                                disabled={isSubmitting}
                                className='rounded_btn bg-gray-100 dark:bg-clightgray md:max-w-max px-3'
                                type='button'
                                onClick={handleClose}
                            >
                                <p className='dark:text-slate-400 text-slate-500'>
                                    Cancelar
                                </p>
                            </button>
                            <button
                                disabled={isSubmitting || !watch('name')}
                                className='rounded_btn bg-cgreen dark:bg-clightgray md:max-w-max px-3'
                                type='button'
                                onClick={handleSubmit(onSubmit)}
                            >
                                {isSubmitting ?
                                    <LoadingIcon fill='fill-clime dark:fill-' /> :
                                    <>
                                        <p className='text-white'>Crear</p>
                                        <MiniAddIcon fill='fill-clime' />
                                    </>
                                }
                            </button>
                        </div>
                    </form >
                </div >
            ) : (
                <button
                    type='button'
                    onClick={handleOpen}
                    className='rounded_btn bg-cgreen  dark:bg-clightgray/50'
                >
                    <p className={`text-white dark:`}>
                        {customText ?? "Crear usuario"}
                    </p>
                    <MiniAddIcon fill='dark:fill-clime fill-clime' />
                </button>
            )
            }
        </ >
    )
}

export default AddUserBtn

