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


const RegisterForm = () => {
    const [isLogginIn, setisLogginIn] = useState<boolean>(false)
    const router = useRouter();
    const {
        register, handleSubmit, reset, formState: { errors, isSubmitting }
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema), defaultValues: { email: '', password: '' }
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {

        const { data, error } = await registerUser({ ...values, type: 'owner' });

        if (error)
            return toast.error(error ?? 'Ha ocurrido un error')

        setisLogginIn(true)
        toast.loading('Iniciando sesión');
        reset()
        return await login({ email: values.email, password: values.password })
    }

    return (
        <AnimatePresence>
            <div className="max-w-lg w-full my-auto">
                <Card headerLabel={isLogginIn ? '' : 'Registrarme'}>
                    {isLogginIn ?
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-[30vh] w-full max-w-lg px-4"
                            key='loading-session'
                        >
                            <LoadingIcon />
                        </motion.div> :
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-lg w-full"
                            key='register-form'
                        >

                            <form
                                onSubmit={handleSubmit((onSubmit))}
                                className="mt-6 space-y-8"
                            >
                                {/* classic login */}
                                <div className="flex flex-col space-y-4">
                                    <label htmlFor='name'>
                                        <p className="input_label">Nombre completo*</p>
                                        <input
                                            {...register("name")}
                                            disabled={isSubmitting}
                                            placeholder='Ej. Pablo Rodriguez'
                                            className={`input ${errors.name ? 'border-red-500' : ''}`}
                                            type="text"
                                            name='name'
                                        />
                                        <div className="input_error">
                                            {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                        </div>
                                    </label>


                                    <label htmlFor='email'>
                                        <p className="input_label">Correo*</p>
                                        <input
                                            {...register("email")}
                                            disabled={isSubmitting}
                                            placeholder='Ej. pablorodriguez@gmail.com'
                                            className={`input ${errors.email ? 'border-red-500' : ''}`}
                                            type="text"
                                            name='email'
                                        />
                                        <div className="input_error">
                                            {errors.email && (<p>{`${errors.email.message}`}</p>)}
                                        </div>
                                    </label>

                                    <label htmlFor='password'>
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

                                    <button disabled={isSubmitting} className='primary-btn ml-auto mt-6' type='submit'>
                                        {isSubmitting ? (
                                            <LoadingIcon />
                                        ) :
                                            <>
                                                <p className='text-white'>Crear cuenta</p>
                                                <CreateAccountIcon fill='fill-clime' />
                                            </>

                                        }
                                    </button>
                                </div>

                                {/* login... */}
                                <div className="flex justify-center py-2">
                                    <button type='button' className='max-w-max group' onClick={() => router.replace('/auth/login')}>
                                        <p className="text-center group-hover:underline underline-offset-2">¿Ya tienes una cuenta?</p>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    }
                </Card>
            </div>
        </AnimatePresence>
    )
}

export default RegisterForm