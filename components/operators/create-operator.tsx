"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterSchema } from '@/schemas';
import toast from "react-hot-toast";
import { z } from 'zod';

import { registerUser } from '@/actions/register';

import { CloseIcon, CreateAccountIcon, LoadingIcon } from '../ui/icons';
import { enterDropdown } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import Card from '../ui/card';

export function CreateOperator({ mode }: { mode?: 'chip' | 'mini' }) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof RegisterSchema>>({ resolver: zodResolver(RegisterSchema), })


    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = "hidden";
        } else {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen]);

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        try {
            const { data, error } = await registerUser({ ...values, type: isAdmin ? 'owner' : 'operator' });
            if (error) return toast.error(error ?? 'Ha ocurrido un error')

            reset();
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.log(error)
            toast.error("Ha ocurrido un error al crear el operario");
        }
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className={`
                    ${mode == 'chip' ? 'chip cgreen flex-center gap-2' :
                        mode === 'mini' ? 'rounded-full bg-cgreen dark:bg-clime h-6 sm:h-7 w-6 sm:w-7 flex-center' :
                            'primary-btn'
                    }`
                }
            >
                {!mode ? <p>Nuevo usuario</p> : mode === 'mini' ? <CreateAccountIcon fill='fill-clime dark:fill-cblack' /> : null}
            </button>

            <AnimatePresence mode='wait'>
                {isOpen ?
                    <motion.div
                        variants={enterDropdown}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key='modal'
                        className='fixed h-screen w-screen top-0 left-0 z-40 backdrop-blur-sm flex'
                    >
                        <div className="max-w-md mx-auto w-full mt-auto sm:my-auto">
                            <Card rounded='rounded-t-3xl sm:rounded-2xl'>
                                <div className="flex-between">
                                    <h2 className='semititle'>Crear usuario</h2>

                                    <button
                                        disabled={isSubmitting}
                                        type='button' onClick={() => setIsOpen(false)}
                                        className='md:hover:opacity-100 md:opacity-50 disabled:opacity-30 transition-all'
                                    >
                                        <CloseIcon fill='fill-cgray dark:fill-white' />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">

                                    <label htmlFor='type' className='w-full'>
                                        <p className="input_label">Tipo de usuario*</p>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                type='button'
                                                disabled={isSubmitting}
                                                className={`chip cursor-pointer disabled:opacity-50 md:hover:bg-opacity-60 active:bg-opacity-60 ${isAdmin ? `chip_gray` : `chip_blue`}`}
                                                onClick={() => setIsAdmin(false)}
                                            >
                                                Operario
                                            </button>
                                            <button
                                                type='button'
                                                disabled={isSubmitting}
                                                className={`chip cursor-pointer disabled:opacity-50 md:hover:bg-opacity-60 active:bg-opacity-60 ${isAdmin ? `chip_red` : `chip_gray`}`}
                                                onClick={() => setIsAdmin(true)}
                                            >
                                                Administrador
                                            </button>
                                        </div>
                                        <div className="input_error">
                                            {errors.type && (<p>{`${errors.type.message}`}</p>)}
                                        </div>
                                    </label>

                                    <label htmlFor='name' className='w-full'>
                                        <p className="input_label">Nombre completo*</p>
                                        <input
                                            {...register("name")}
                                            placeholder='Ej. Juan Perez'
                                            disabled={isSubmitting}
                                            className={`input ${errors.name ? 'border-red-500' : ''}`}
                                            type="text"
                                            name='name'
                                        />
                                        <div className="input_error">
                                            {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                        </div>
                                    </label>

                                    <label htmlFor='email' className='w-full'>
                                        <p className="input_label">Email*</p>
                                        <input
                                            {...register("email")}
                                            placeholder='Ej. juanperez@bodyonline.com'
                                            disabled={isSubmitting}
                                            className={`input ${errors.email ? 'border-red-500' : ''}`}
                                            type="email"
                                            name='email'
                                        />
                                        <div className="input_error">
                                            {errors.email && (<p>{`${errors.email.message}`}</p>)}
                                        </div>
                                    </label>

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

                                    <button
                                        disabled={isSubmitting}
                                        className='primary-btn'
                                        type='submit'
                                    >
                                        {isSubmitting ?
                                            <LoadingIcon fill='fill-slate-100 dark:fill-cblack' />
                                            :
                                            <>
                                                <p>Crear usuario</p>
                                                <CreateAccountIcon fill='fill-clime dark:fill-cblack' />
                                            </>
                                        }
                                    </button>
                                </form >
                            </Card>
                        </div>
                    </motion.div>
                    : <div key='null' />
                }
            </AnimatePresence>
        </div >
    );
}

export default CreateOperator;
