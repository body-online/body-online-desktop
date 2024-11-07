'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { LocationSchema, locationSchema } from '@/lib/types';
import { createLocation } from '@/actions/location';

import { LoadingIcon, MiniAddIcon } from '../ui/icons';

export function AddLocationBtn({ customText, searchLocations }: { customText?: string; searchLocations?: () => void }) {
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
        reset();
        return setIsOpen(false)
    }
    const handleOpen = () => {
        return setIsOpen(true)
    }

    const onSubmit: SubmitHandler<LocationSchema> = async (data: LocationSchema) => {
        // const toastSavingLocation = toast.loading('Creando ubicación...');
        try {
            const { error, data: createdLocation } = await createLocation(data);
            if (error) return toast.error(error)
            // toast.success(`Ubicación creada exitosamente!`);
            reset();
            handleClose();
            if (searchLocations)
                searchLocations();
        } catch (error) {
            toast.error('Ha ocurrido un error al crear la ubicación')
        } finally {
            // toast.dismiss(toastSavingLocation)
        }
    }

    return (
        <>
            {isOpen ? (
                <div
                    className='flex flex-col w-full dark:bg-clightgray/50 border custom-border p-2 md:p-3 rounded-lg'
                >
                    <p className="input_label mb-3">Nueva ubicación</p>
                    <form onSubmit={(e) => { return e.preventDefault() }} className='space-y-6'>
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor='name' className='w-full'>
                                <input
                                    {...register("name")}
                                    name='name'
                                    type="text"
                                    placeholder='Nombre de la ubicación'
                                    disabled={isSubmitting}
                                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                                />
                                <div className="input_error">
                                    {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                </div>
                            </label>
                        </div>

                        <div className="flex-between gap-2">
                            <button
                                disabled={isSubmitting}
                                className='rounded_btn bg-gray-100 dark:bg-clightgray md:max-w-max px-3'
                                type='button'
                                onClick={handleClose}
                            >
                                <p className='dark:text-slate-400 text-slate-500'>
                                    Cancelar
                                </p>
                            </button>
                            <button
                                disabled={isSubmitting || !watch('name')}
                                className='rounded_btn bg-cgreen dark:bg-clightgray md:max-w-max px-3'
                                type='button'
                                onClick={handleSubmit(onSubmit)}
                            >
                                {isSubmitting ?
                                    <LoadingIcon fill='fill-clime dark:fill-' /> :
                                    <>
                                        <p className='text-white'>Crear</p>
                                        <MiniAddIcon fill='fill-clime' />
                                    </>
                                }
                            </button>
                        </div>
                    </form >
                </div >
            ) : (
                <button
                    type='button'
                    onClick={handleOpen}
                    className='rounded_btn bg-cgreen  dark:bg-clightgray'
                >
                    <p className={`text-white dark:`}>
                        {customText ?? "Crear ubicación"}
                    </p>
                    <MiniAddIcon fill='dark:fill-clime fill-clime' />
                </button>
            )
            }
        </ >
    )
}

export default AddLocationBtn

