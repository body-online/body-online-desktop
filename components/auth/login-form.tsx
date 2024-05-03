'use client'

import toast from 'react-hot-toast';
import * as z from "zod";

import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingIcon, SendIcon } from '../ui/icons';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { login } from '@/actions/login';
import { LoginSchema } from '@/schemas';
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
        toast.success('Seras redirigido en segundos');
        reset()
    }

    return (
        <div>
            <Card headerLabel='Iniciar sesión'>
                <form
                    onSubmit={handleSubmit((onSubmit))}
                    className="mt-6 space-y-8"
                >
                    {/* classic login */}
                    <div className="flex flex-col space-y-4">
                        <label htmlFor='email'>
                            <p className="input_label">Correo*</p>
                            <input
                                {...register("email")}
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
                            <p className="input_label">Contraseña*</p>
                            <input
                                {...register("password")}
                                disabled={isSubmitting}
                                className={`input ${errors.password ? 'border-red-500' : ''}`}
                                type="password"
                                name='password'
                            />
                            <div className="input_error">
                                {errors.password && (<p>{`${errors.password.message}`}</p>)}
                            </div>
                        </label>

                        <button disabled={isSubmitting} className='login_btn' type='submit'>
                            {isSubmitting ? (
                                <LoadingIcon />
                            ) : (
                                <>
                                    <p>Ingresar</p>
                                    <SendIcon />
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
                            onClick={() => router.replace('/auth/register')}
                        >
                            <p className="text-center group-hover:underline underline-offset-2">¿Aún no tienes una cuenta?</p>
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default LoginForm;
