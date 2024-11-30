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
import CloseBtn from '../ui/close-btn';
import Modal from '../ui/modal';
import { useSession } from 'next-auth/react';

export function AddUserBtn({ customText, handleRefresh }: { customText?: string; handleRefresh?: () => void }) {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const isNotAdmin = Boolean(session?.user.type != 'owner')

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: { type: 'operator' }
    })

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
        <div>
            <Modal isOpen={isOpen} handleClose={handleClose}>
                <div className='card_modal w-full max-w-sm mx-auto'>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className='header_container'>
                            <p className="text-base font-medium">
                                Nuevo usuario
                            </p>

                            <CloseBtn handleClose={handleClose} />
                        </div>

                        <div className='px-4 my-2'>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <div className='w-full min-w-[200px]'>
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
                                </div>

                                <div className="max-w-max">
                                    <HorizontalSelector
                                        options={[
                                            { label: 'Operario', value: 'operator' },
                                            { label: 'Administrador', value: 'owner' }
                                        ]}
                                        selected={watch('type') ?? 'operator'}
                                        onChange={(value) => setValue('type', value as 'operator' | 'owner')}
                                    />
                                </div>
                            </div>



                            <div className="input_error">
                                {errors.type && (<p>{`${errors.type.message}`}</p>)}
                            </div>
                        </div>

                        <div className='px-4 my-2'>
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

                        <div className='px-4 my-2'>
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

                        <div className="buttons_container">
                            <button
                                disabled={isSubmitting || !watch('name')}
                                className='order-2 rounded_btn bg-cgreen dark:bg-clime'
                                type='button'
                                onClick={handleSubmit(onSubmit)}
                            >
                                {isSubmitting && <LoadingIcon fill='fill-clime dark:fill-cblack' />}
                                <p className='text-white dark:text-cblack'>
                                    {isSubmitting ? 'Creando' : 'Crear'}
                                </p>
                            </button>
                            <button
                                disabled={isSubmitting}
                                className='rounded_btn bg-slate-100 dark:bg-clightgray'
                                type='button'
                                onClick={handleClose}
                            >
                                <p className='dark:text-slate-400 text-slate-500'>
                                    Cancelar
                                </p>
                            </button>
                        </div>
                    </form >
                </div>
            </Modal >

            <button
                type='button'
                disabled={isNotAdmin}
                onClick={handleOpen}
                className='rounded_btn bg-cgreen  dark:bg-clime'
            >
                <p className={`text-white dark:text-cblack`}>
                    {customText ?? "Crear usuario"}
                </p>
                <MiniAddIcon fill='fill-clime dark:fill-cblack' />
            </button>

        </div >
    )
}

export default AddUserBtn

