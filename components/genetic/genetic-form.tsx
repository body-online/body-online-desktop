'use client'

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Slider } from "@heroui/slider";
import { createGenetic } from '@/actions/genetic';
import { LoadingIcon, MiniAddIcon } from '../ui/icons';
import { GeneticSchema, geneticSchema } from '@/lib/types';

export function GeneticForm({ handleRefresh }: { handleRefresh?: (createdGenetic: any) => void }) {
    const [sliderValue, setSliderValue] = useState<number[]>([100, 300]);

    const { register, watch, handleSubmit, setValue: setFormValue, reset, formState: { errors, isSubmitting } } = useForm<GeneticSchema>({
        resolver: zodResolver(geneticSchema),
        defaultValues: { name: '', description: '', minRange: '2', maxRange: '27' }
    });

    const onSubmit: SubmitHandler<GeneticSchema> = async (data) => {
        const toastId = toast.loading('Creando genética...');
        try {
            const { error, data: createdGenetic } = await createGenetic(data);
            if (error) {
                toast.error(error, { id: toastId });
                return;
            }
            toast.success('¡Genética creada exitosamente!', { id: toastId });
            handleRefresh?.(createdGenetic);
        } catch {
            toast.error('Ha ocurrido un error al crear la genética', { id: toastId });
        }
    };

    const watchedName = watch('name');
    const watchedMinRange = watch('minRange');
    const watchedMaxRange = watch('maxRange');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4 w-full'>
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
                    {errors.name && <span className="text-sm text-red-500 mt-1">{errors.name.message}</span>}
                </label>

                <label htmlFor='description' className='w-full'>
                    <textarea
                        {...register("description")}
                        id='description'
                        placeholder='Descripción (opcional)'
                        disabled={isSubmitting}
                        className={`input w-full min-h-[80px] resize-none ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.description && <span className="text-sm text-red-500 mt-1">{errors.description.message}</span>}
                </label>


                <div className="flex items-center gap-3 mb-2">
                    <p className="input_label">Rango ideal</p>
                    <p className="chip chip_green">{watchedMinRange} a {watchedMaxRange}</p>
                </div>

                <Slider
                    label="Mi Slider"
                    step={1}
                    minValue={0}
                    maxValue={100}
                    defaultValue={50}
                    // Propiedades opcionales
                    color="primary"
                    size="md"
                    radius="full"
                />
            </div>

            <div className="flex justify-end gap-2">
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
    )
}

export default GeneticForm