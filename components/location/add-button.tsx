'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { LocationSchema, locationSchema } from '@/lib/types';
import { LoadingIcon, MiniAddIcon } from '../ui/icons';
import { createLocation } from '@/actions/location';
import BlackOutModal from '../ui/blackout-modal';
import { enterModal } from '@/lib/constants';
import Card from '../ui/card';

export function AddLocationBtn({ mode }: { mode?: 'chip' | 'mini' }) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LocationSchema>({
        resolver: zodResolver(locationSchema)
    })


    const handleClose = () => {
        document.body.style.overflow = "auto";
        reset();
        return setIsOpen(false)
    }
    const handleOpen = () => {
        document.body.style.overflow = "hidden";
        return setIsOpen(true)
    }

    const onSubmit: SubmitHandler<LocationSchema> = async (data: LocationSchema) => {
        // const toastSavingLocation = toast.loading('Creando ubicación...');
        try {
            const { error, data: createdLocation } = await createLocation(data);
            if (error) return toast.error(error)
            // toast.success(`Ubicación creada exitosamente!`);
            reset();
            handleClose()
            return router.refresh();
        } catch (error) {
            toast.error('Ha ocurrido un error al crear la ubicación')
        } finally {
            // toast.dismiss(toastSavingLocation)
        }
    }

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
                {mode != 'mini' ? <p>Crear ubicación</p> : null}
                <MiniAddIcon fill='fill-clime' />
            </button>

            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='m-auto max-w-lg'
                >
                    <Card headerLabel='Crear ubicación'>
                        <form className='relative max-h-[90vh] flex flex-col overflow-auto mt-3 space-y-8' onSubmit={handleSubmit(onSubmit)}>
                            <div>

                                <label htmlFor='name' className='md:col-span-2'>
                                    <p className="input_label">Nombre*</p>
                                    <input
                                        {...register("name")}
                                        name='name'
                                        type="text"
                                        placeholder='Ej. Jaula 1'
                                        disabled={isSubmitting}
                                        className={`input ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    <div className="input_error">
                                        {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                    </div>
                                </label>

                                <label htmlFor='description' className='md:col-span-2'>
                                    <p className="input_label">Descripción</p>
                                    <textarea
                                        {...register("description")}
                                        name='description'
                                        placeholder='Escriba una descripción de ser necesario'
                                        disabled={isSubmitting}
                                        className={`input min-h-14 max-h-28 ${errors.description ? 'border-red-500' : ''}`}
                                    />
                                </label>

                                <div className="mt-6 flex-end gap-3">
                                    <button
                                        type="submit"
                                        className="primary-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <LoadingIcon /> : <>
                                            <p>Crear ubicación</p>
                                            <MiniAddIcon fill='fill-clime' />
                                        </>}
                                    </button>
                                </div>
                            </div>
                        </form >
                    </Card>
                </motion.div>
            </BlackOutModal>
        </>
    )
}

export default AddLocationBtn

