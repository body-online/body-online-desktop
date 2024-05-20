'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { LocationSchema, locationSchema } from '@/lib/types';
import { LoadingIcon, MiniAddIcon } from '../ui/icons';
import { createLocation } from '@/actions/location';
import Modal from '../ui/modal';
import { useState } from 'react';
import Card from '../ui/card';
import { enterModal } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export function AddLocationBtn() {
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
        const toastSavingLocation = toast.loading('Creando ubicación...');
        try {
            const { error, data: createdLocation } = await createLocation(data);
            if (error) return toast.error(error)
            toast.success(`Ubicación creada exitosamente!`);
            reset();
            handleClose()
            router.refresh()
        } catch (error) {
            toast.error('Ha ocurrido un error al crear la ubicación')
        } finally {
            toast.dismiss(toastSavingLocation)
        }
    }

    return (
        <>
            <button className="rounded_btn cgreen" onClick={handleOpen}>
                <MiniAddIcon fill="fill-clime" />
            </button>


            <Modal handleClose={handleClose} isOpen={isOpen}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full sm:w-full sm:min-w-96"
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Card headerLabel='Crear ubicación'>
                        <form className='mt-6 space-y-8' onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className='space-y-4'>

                                <label htmlFor='name' className='md:col-span-2'>
                                    <p className="input_label">Nombre*</p>
                                    <input
                                        {...register("name")}
                                        name='name'
                                        type="text"
                                        placeholder='ej. Jaula 1'
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
                                        className={` p-3 text-start transition rounded-lg border hover:border-gray-400 focus:outline-0 focus:ring-[1px] ring-slate-300 w-full disabled:opacity-50 min-h-14 max-h-28 ${errors.description ? 'border-red-500' : ''}`}
                                    />
                                </label>

                                <div className="mt-6 flex-end gap-3">
                                    <button
                                        type='button'
                                        onClick={handleClose}
                                        className='btn slate'
                                        disabled={isSubmitting}
                                    >
                                        <p>Cancelar</p>
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn black"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <LoadingIcon /> : <p>Crear</p>}
                                    </button>
                                </div>
                            </div>
                        </form >
                    </Card>
                </motion.div>
            </Modal>
        </>
    )
}

export default AddLocationBtn

