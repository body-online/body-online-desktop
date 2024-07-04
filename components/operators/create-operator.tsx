"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { RegisterSchema } from '@/schemas';
import toast from "react-hot-toast";
import { z } from 'zod';

import { enterModal } from "@/lib/constants";

import { LoadingIcon, MiniAddIcon } from '../ui/icons';
import BlackOutModal from '../ui/blackout-modal';
import { registerUser } from '@/actions/register';
import CardHeader from '../ui/card-header';
import Card from '../ui/card';

export function CreateOperator({ mode }: { mode?: 'chip' | 'mini' }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const {
        register,
        setValue,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof RegisterSchema>>({ resolver: zodResolver(RegisterSchema), })

    const handleClose = () => {
        reset();
        return setIsOpen(false);
    };
    const handleOpen = () => {
        return setIsOpen(true);
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen,]);

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        // const toastSavingOperator = toast.loading("Creando operario...");
        try {
            const { data, error } = await registerUser({ ...values, type: 'operator' });
            if (error) return toast.error(error ?? 'Ha ocurrido un error')

            // toast.success('Operario creado' ?? ' ');
            reset();
            handleClose();
            router.refresh();
        } catch (error) {
            console.log(error)
            toast.error("Ha ocurrido un error al crear el operario");
        } finally {
            // toast.dismiss(toastSavingOperator);
        }
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className={`
                    ${mode == 'chip' ? 'chip cgreen flex-center gap-2' :
                        mode === 'mini' ? 'rounded-full cgreen dark:bg-csemigreen h-6 sm:h-7 w-6 sm:w-7 flex-center' :
                            'primary-btn'
                    }`
                }
            >
                {!mode ? <p>Nuevo usuario</p> : mode === 'mini' ? <MiniAddIcon fill='fill-clime' /> : null}
            </button>

            <BlackOutModal handleClose={handleClose} isOpen={isOpen}>
                <motion.span
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <form className='max-w-sm mx-auto' onSubmit={handleSubmit(onSubmit)}>

                        <Card headerLabel='Crear usuario'>
                            <div className="flex gap-2 w-full mt-3">
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
                            </div>
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
                                    className={`input ${errors.password ? 'border-red-500' : ''}`}
                                    type="password"
                                    name='password'
                                />
                                <div className="input_error">
                                    {errors.password && (<p>{`${errors.password.message}`}</p>)}
                                </div>
                            </label>

                            <div className="mt-6 flex-end gap-3">
                                <button disabled={isSubmitting} className='primary-btn' type='submit'
                                >
                                    {isSubmitting ? <LoadingIcon /> : (
                                        <>
                                            <p className='text-white'>Crear usuario</p>
                                            <MiniAddIcon fill='fill-clime' />
                                        </>
                                    )}
                                </button>
                            </div>
                        </Card>

                    </form>

                </motion.span>
            </BlackOutModal>
        </>
    );
}

export default CreateOperator;
