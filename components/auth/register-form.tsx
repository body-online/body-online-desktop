'use client'

import toast from 'react-hot-toast';
import * as z from "zod";

import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAccountIcon, LoadingIcon, SendIcon } from '../ui/icons';
import { registerUser } from '@/actions/register';
import { useRouter } from 'next/navigation';
import { RegisterSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import Card from '../ui/card'
import { login } from '@/actions/login';


const RegisterForm = () => {
    const router = useRouter();
    const {
        register, handleSubmit, reset, formState: { errors, isSubmitting }
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema), defaultValues: { email: '', password: '' }
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {

        const response = await registerUser(values);
        if (response.success) {
            toast.success(response.success);
            reset()
            return await login(values)
            // return router.push('/auth/login');
        }
        toast.error(response.error ?? 'Ha ocurrido un error')
    }

    return (
        <div>
            <Card headerLabel='Registrarme'>
                <form
                    onSubmit={handleSubmit((onSubmit))}
                    className="mt-6 space-y-8"
                >
                    {/* classic login */}
                    <div className="flex flex-col space-y-4">
                        <label htmlFor='name'>
                            <p className="input_label">Nombre*</p>
                            <input
                                {...register("name")}
                                disabled={isSubmitting}
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
                            ) :
                                <>
                                    <p>Crear cuenta</p>
                                    <CreateAccountIcon fill='fill-clime' />
                                </>

                            }
                        </button>
                    </div>

                    {/* register... */}
                    <div className="flex justify-center py-2">
                        <button type='button' className='max-w-max group' onClick={() => router.replace('/auth/login')}>
                            <p className="text-center group-hover:underline underline-offset-2">¿Ya tienes una cuenta?</p>
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default RegisterForm

const GoogleIcon = () => {
    return (
        <div className='w-6 h-6'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917" /><path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691" /><path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44" /><path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917" />
            </svg>
        </div>
    )
}