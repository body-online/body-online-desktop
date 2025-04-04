'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useState } from 'react';


import { createGenetic } from '@/actions/genetic';
import { LoadingIcon, MiniAddIcon } from '../ui/icons';
import MultiRangeSlider from '../ui/multirange-slider';
import { GeneticSchema, geneticSchema } from '@/lib/types';

export function AddGeneticBtn({ customText, handleRefresh }: { customText?: string; handleRefresh?: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const {
        register,
        watch,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<GeneticSchema>({
        resolver: zodResolver(geneticSchema),
        defaultValues: {
            name: '',
            description: '',
            minRange: '2',
            maxRange: '27'
        }
    })

    const handleClose = () => {
        reset();
        setIsOpen(false);
    }

    const onSubmit: SubmitHandler<GeneticSchema> = async (data: GeneticSchema) => {
        const toastId = toast.loading('Creando genética...');

        try {
            const { error, data: createdGenetic } = await createGenetic(data);

            if (error) {
                toast.error(error, { id: toastId });
                return;
            }

            toast.success('¡Genética creada exitosamente!', { id: toastId });

            if (handleRefresh && createdGenetic) {
                handleRefresh(createdGenetic);
            }

            reset();
            handleClose();
        } catch (error) {
            toast.error('Ha ocurrido un error al crear la genética', { id: toastId });
        }
    }

    const watchedName = watch('name');

    return (
        <>
            {isOpen ? (
                <div className='flex flex-col w-full dark:bg-clightgray/50 border custom-border p-2 md:p-3 rounded-lg'>
                    <p className="input_label">Nueva genética</p>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
                        <div className="w-full flex flex-col gap-3">
                            <label htmlFor='name' className='w-full'>
                                <input
                                    {...register("name")}
                                    id='name'
                                    type="text"
                                    placeholder='Nombre de la genética'
                                    disabled={isSubmitting}
                                    className={`input w-full ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                    autoComplete="off"
                                />
                                {errors.name && (
                                    <span className="text-sm text-red-500 mt-1">
                                        {errors.name.message}
                                    </span>
                                )}
                            </label>

                            <label htmlFor='description' className='w-full'>
                                <textarea
                                    {...register("description")}
                                    id='description'
                                    placeholder='Descripción (opcional)'
                                    disabled={isSubmitting}
                                    className={`input w-full min-h-[80px] resize-none ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                {errors.description && (
                                    <span className="text-sm text-red-500 mt-1">
                                        {errors.description.message}
                                    </span>
                                )}
                            </label>

                            <label htmlFor="bodyRanges" className='w-full'>
                                <div className="flex items-center gap-3 mb-2">
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
                                            setValue('minRange', `${min}`);
                                            setValue('maxRange', `${max}`);
                                        }}
                                    />
                                </div>
                            </label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type='button'
                                disabled={isSubmitting}
                                className='rounded_btn bg-gray-100 dark:bg-clightgray'
                                onClick={handleClose}
                            >
                                <p className='dark:text-slate-400 text-slate-500'>
                                    Cancelar
                                </p>
                            </button>
                            <button
                                disabled={isSubmitting || !watchedName}
                                className='primary-btn'
                                type='submit'
                            >
                                {isSubmitting ? (
                                    <LoadingIcon fill='fill-white dark:fill-cblack' />
                                ) : (
                                    <>
                                        <p>Crear</p>
                                        <MiniAddIcon fill='fill-white dark:fill-cblack' />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    type='button'
                    onClick={() => setIsOpen(true)}
                    className='primary-btn'
                >
                    <p className='text-white dark:text-cblack'>
                        {customText ?? "Crear genética"}
                    </p>
                    <MiniAddIcon fill='fill-white dark:fill-cblack' />
                </button>
            )}
        </>
    )
}

export default AddGeneticBtn