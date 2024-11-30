'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { GeneticSchema, geneticSchema } from '@/lib/types';
import { createGenetic } from '@/actions/genetic';

import { LoadingIcon, MiniAddIcon } from '../ui/icons';
import MultiRangeSlider from '../ui/multirange-slider';

export function AddGeneticBtn({ customText, handleRefresh }: { customText?: string; handleRefresh?: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const { register, watch, handleSubmit, setValue, reset,
        formState: { errors, isSubmitting },
    } = useForm<GeneticSchema>({
        resolver: zodResolver(geneticSchema)
    })


    const handleClose = () => {
        reset();
        return setIsOpen(false)
    }
    const handleOpen = () => {
        return setIsOpen(true)
    }

    const onSubmit: SubmitHandler<GeneticSchema> = async (data: GeneticSchema) => {
        // const toastSavingGenetic = toast.loading('Creando genética...');
        try {
            const { error, data: createdGenetic } = await createGenetic(data);
            if (error || !createdGenetic) return toast.error(error ?? 'Error al crear la genética')
            // toast.success(`Genética creada exitosamente!`);
            if (handleRefresh)
                handleRefresh(createdGenetic);
            reset();
            handleClose();
        } catch (error) {
            toast.error('Ha ocurrido un error al crear la genética')
        } finally {
            // toast.dismiss(toastSavingGenetic)
        }
    }

    return (
        <>
            {isOpen ? (
                <div
                    className='flex flex-col w-full dark:bg-clightgray/50 border custom-border p-2 md:p-3 rounded-lg'
                >
                    <p className="input_label">Nueva genética</p>
                    <form onSubmit={(e) => { return e.preventDefault() }} className='space-y-6'>
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor='name' className='w-full'>
                                <input
                                    {...register("name")}
                                    name='name'
                                    type="text"
                                    placeholder='Nombre de la genética'
                                    disabled={isSubmitting}
                                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                                />
                                <div className="input_error">
                                    {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                </div>
                            </label>

                            <label htmlFor="bodyRanges">
                                <div className="flex items-center gap-3">
                                    <p className="input_label">
                                        Rango ideal
                                    </p>
                                    <p className="chip chip_green">
                                        {watch('minRange')} a {watch('maxRange')}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center w-full py-4">
                                    <MultiRangeSlider
                                        min={2}
                                        max={27}
                                        isSubmitting={isSubmitting}
                                        onChange={({ min, max }) => {
                                            if (min != Number(watch('minRange'))) {
                                                return setValue('minRange', `${min}`);
                                            }
                                            if (max != Number(watch('maxRange'))) {
                                                return setValue('maxRange', `${max}`);
                                            }
                                        }}
                                    />
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
                        {customText ?? "Crear genética"}
                    </p>
                    <MiniAddIcon fill='dark:fill-clime fill-clime' />
                </button>
            )
            }
        </ >
    )
}

export default AddGeneticBtn