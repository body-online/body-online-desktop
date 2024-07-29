'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { LocationSchema, locationSchema } from '@/lib/types';
import { createLocation } from '@/actions/location';

import { CloseIcon, LoadingIcon, MiniAddIcon } from '../ui/icons';
import { LayoutBody, LayoutBottom, LayoutHeader } from '../ui/default-layout';
import BlackOutModal from '../ui/blackout-modal';
import StepsContainer from '../ui/steps-container';
import StepIndicator from '../ui/step-indicator';

export function AddLocationBtn() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const {
        register,
        watch,
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
            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>

                <LayoutHeader>
                    <div className="flex-between w-full container">
                        <h2 className='semititle'>Crear ubicación</h2>
                        <button
                            type='button'
                            disabled={isSubmitting}
                            onClick={() => setIsOpen(false)}
                            className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30'
                        >
                            <CloseIcon fill='fill-cgray dark:fill-white' />
                        </button>
                    </div>
                </LayoutHeader>

                <StepsContainer>
                    <StepIndicator
                        label='Nombre'
                        value={watch('name')}
                        active={true}
                        step={'1'}
                    />
                    <StepIndicator
                        label='Descripción'
                        value={'No requerido'}
                        active={true}
                        step={'2'}
                    />
                </StepsContainer>

                <LayoutBody>
                    <form onSubmit={(e) => { return e.preventDefault() }} className=' px-default py-default'>
                        <div className=''>
                            <h3 className='semititle mb-3'>Datos principales</h3>
                            <div className="grid gap-4">
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
                                        className={`h-32 md:h-60 textarea`}
                                    />
                                </label>
                            </div>
                        </div>
                    </form >
                </LayoutBody>

                <LayoutBottom>
                    <div className="flex-end w-full">
                        <button
                            disabled={isSubmitting || !watch('name')}
                            className='rounded_btn bg-csemigreen dark:bg-clime md:max-w-max px-3'
                            type='button'
                            onClick={handleSubmit(onSubmit)}
                        >
                            {isSubmitting ? (
                                <LoadingIcon fill='fill-clime dark:fill-cblack' />
                            ) : (
                                <div className='flex-center gap-1'>
                                    <p className='text-white py-1 dark:text-cblack'>Crear ubicación</p>
                                    <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                                </div>
                            )}
                        </button>
                    </div>
                </LayoutBottom>
            </BlackOutModal>


            <button
                onClick={handleOpen}
                className='h-max w-max rounded_btn bg-csemigreen dark:bg-clime flex-center px-3 gap-1'
            >
                <div className='flex-center gap-1'>
                    <p className={`text-white dark:text-cblack font-medium`}>Crear ubicación</p>
                    <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                </div>
            </button>
        </>
    )
}

export default AddLocationBtn

