'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useState } from 'react';
import * as z from "zod";

import { registerUser } from '@/actions/register';
import { RegisterSchema } from '@/schemas';
import { login } from '@/actions/login';

import { CreateAccountIcon, LoadingIcon } from '../ui/icons';
import Card from '../ui/card'
import Link from 'next/link';


const RegisterForm = () => {
    const [isLogginIn, setisLogginIn] = useState<boolean>(false)

    const {
        register, handleSubmit, reset, formState: { errors, isSubmitting }
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema), defaultValues: { email: '', password: '' }
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {

        const { error } = await registerUser({ ...values, type: 'owner' });

        if (error)
            return toast.error(error ?? 'Ha ocurrido un error')

        setisLogginIn(true)
        reset()
        return await login({ email: values.email, password: values.password })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            className="max-w-sm w-full my-auto"
            key='register-form'
        >
            <Card headerLabel="Registrarme">
                {isLogginIn ? (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-[30vh] w-full max-w-lg px-4 flex-center"
                        key='loading-session'
                    >
                        <div className="flex flex-col items-center gap-2">
                            <LoadingIcon />
                            <p className='text-center'>Iniciando sesión</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3 } }}
                        onSubmit={handleSubmit((onSubmit))}
                        key='register-form'
                    >
                        <div className='flex flex-col w-full space-y-4 mt-3'>
                            <label htmlFor='name'>
                                <input
                                    {...register("name")}
                                    disabled={isSubmitting}
                                    placeholder='Nombre completo'
                                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                                    type="text"
                                    name='name'
                                />
                                <div className="input_error">
                                    {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                </div>
                            </label>

                            <label htmlFor='email'>
                                <input
                                    {...register("email")}
                                    disabled={isSubmitting}
                                    placeholder='Email'
                                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                                    type="text"
                                    name='email'
                                />
                                <div className="input_error">
                                    {errors.email && (<p>{`${errors.email.message}`}</p>)}
                                </div>
                            </label>

                            <label htmlFor='password'>
                                <p className="input_instructions font-medium mb-1">Contraseña*</p>

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

                        <div className="flex-center py-4">
                            <button disabled={isSubmitting} className='primary-btn' type='submit'>
                                {isSubmitting ? (
                                    <LoadingIcon fill='fill-clime dark:fill-cblack' />
                                ) : (
                                    <>
                                        <p className='text-white'>Crear cuenta</p>
                                        <CreateAccountIcon fill='fill-clime dark:fill-cblack' />
                                    </>
                                )
                                }
                            </button>
                        </div>


                        <div className="flex justify-center py-2">
                            <Link href={'/auth/login'}>
                                <p className="text-center group-hover:underline underline-offset-2">¿Ya tienes una cuenta?</p>
                            </Link>
                        </div>
                    </motion.form>
                )
                }
            </Card>
        </motion.div>
    )
}

export default RegisterForm