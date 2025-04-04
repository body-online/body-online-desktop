'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { LocationSchema, locationSchema } from '@/lib/types';
import { createLocation } from '@/actions/location';
import { LoadingIcon, MiniAddIcon } from '../ui/icons';

export function LocationForm({ callback }: { callback?: (location: LocationSchema) => void }) {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LocationSchema>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    })

    const onSubmit: SubmitHandler<LocationSchema> = async (data: LocationSchema) => {
        const toastId = toast.loading('Creando ubicación...');

        try {
            const { error, data: createdLocation } = await createLocation(data);

            if (error) {
                toast.error(error, { id: toastId });
                return;
            }

            toast.success('¡Ubicación creada exitosamente!', { id: toastId });
            reset();

            if (callback && createdLocation) {
                callback(createdLocation);
            }
        } catch (error) {
            toast.error('Ha ocurrido un error al crear la ubicación', { id: toastId });
        }
    }

    const watchedName = watch('name');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
            <div className="w-full flex flex-col gap-3">
                <label htmlFor='name' className='w-full'>
                    <input
                        {...register("name")}
                        id='name'
                        type="text"
                        placeholder='Nombre de la ubicación'
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
            </div>

            <div className="flex justify-end">
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

export default LocationForm
