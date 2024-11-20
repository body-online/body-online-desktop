'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '@/schemas';
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';
import * as z from "zod";

import { login } from '@/actions/login';

import { LoadingIcon, SendIcon } from '../ui/icons';
import Card from '../ui/card';


const LoginForm = () => {
    const router = useRouter();

    const {
        register, handleSubmit, reset, formState: { errors, isSubmitting }
    } = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema), defaultValues: { email: '', password: '' }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        const response = await login(values);
        if (response?.error) {
            return toast.error(response.error ?? 'Ha ocurrido un error')
        }
        toast.success('Serás redirigido en segundos');
        reset()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            className="max-w-sm w-full mb-auto"
            key='login-form'
        >
            <Card headerLabel="Iniciar sesión">
                <form onSubmit={handleSubmit((onSubmit))}>
                    {/* classic login */}
                    <div className='flex flex-col w-full space-y-4 mt-3'>
                        <label htmlFor='email'>
                            {/* <p className="input_label">Correo*</p> */}
                            <input
                                {...register("email")}
                                placeholder='Email'
                                disabled={isSubmitting}
                                className={`input ${errors.email ? 'border-red-500' : ''}`}
                                type="text"
                                name='email'
                            />
                            <div className="input_error">
                                {errors.email && (<p>{`${errors.email.message}`}</p>)}
                            </div>
                        </label>

                        <label htmlFor='password'>
                            <p className="input_instructions mb-1 font-medium">Contraseña</p>
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
                                    <p>Ingresar</p>
                                    <SendIcon fill='fill-clime dark:fill-cblack' />
                                </>
                            )
                            }
                        </button>
                    </div>

                    {/* register... */}
                    <div className="flex justify-center py-2">
                        <button
                            type='button'
                            className='max-w-max group'
                            onClick={() => router.push('/auth/register')}
                        >
                            <p className="text-center group-hover:underline underline-offset-2">¿Aún no tienes una cuenta?</p>
                        </button>
                    </div>
                </form>
            </Card>
        </motion.div >
    )
}

export default LoginForm;
