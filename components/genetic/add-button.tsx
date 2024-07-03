'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { GeneticSchema, geneticSchema } from '@/lib/types';
import { MiniAddIcon, LoadingIcon } from '../ui/icons';
import { createGenetic } from '@/actions/genetic';
import Modal from '../ui/modal';
import { useState } from 'react';
import Card from '../ui/card';
import { enterModal } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import BlackOutModal from '../ui/blackout-modal';

export function AddGeneticBtn({ chipMode, children }: { chipMode?: boolean; children?: React.ReactNode }) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        reset
    } = useForm<GeneticSchema>({
        resolver: zodResolver(geneticSchema)
    })


    const handleClose = () => {
        reset();
        document.body.style.overflow = "auto";
        return setIsOpen(false)
    }
    const handleOpen = () => {
        document.body.style.overflow = "hidden";
        return setIsOpen(true)
    }

    const onSubmit: SubmitHandler<GeneticSchema> = async (data: GeneticSchema) => {
        const toastSavingGenetic = toast.loading('Creando genética...');
        try {
            if (data?.maxRange < data?.minRange) return setError('minRange', {
                type: "manual",
                message: "El mínimo debe ser menor que el máximo",
            })

            const { error, data: createdGenetic } = await createGenetic(data);
            if (error) return toast.error(error)
            toast.success(`Genética creada exitosamente!`);
            reset();
            handleClose()
            router.refresh()
        } catch (error) {
            toast.error('Ha ocurrido un error al crear la genética')
        } finally {
            toast.dismiss(toastSavingGenetic)
        }
    }

    return (
        <>

            <button onClick={handleOpen}>
                {children ??
                    <div className={`${chipMode ? 'chip cgreen dark:bg-csemigreen flex-center gap-2' : 'primary-btn'}`}>
                        <p>Crear  {chipMode ? '' : 'nueva'} genética</p>
                        <MiniAddIcon fill="fill-clime" />
                    </div>
                }
            </button>

            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='max-w-md m-auto'
                >
                    <Card headerLabel='Crear genética'>
                        <form className='relative flex flex-col max-h-[90vh] overflow-auto mt-3 space-y-3' onSubmit={handleSubmit(onSubmit)}>

                            <label htmlFor='name'>
                                <p className="input_label">Nombre*</p>
                                <input
                                    {...register("name")}
                                    name='name'
                                    type="text"
                                    placeholder='Ej. Genética F'
                                    disabled={isSubmitting}
                                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                                />
                                <div className="input_error">
                                    {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                </div>
                            </label>

                            <label htmlFor='description'>
                                <p className="input_label">Descripción</p>
                                <textarea
                                    {...register("description")}
                                    name='description'
                                    placeholder='Escriba una descripción de ser necesario'
                                    disabled={isSubmitting}
                                    className={` input min-h-14 max-h-28 ${errors.description ? 'border-red-500' : ''}`}
                                />
                            </label>

                            <div className='w-full rounded-xl bg-green-100 dark:bg-csemigreen/20 px-3 pt-3'>
                                <p className='text-base font-medium leading-6 mb-3'>
                                    Define el rango donde el individuo que pertenezca a esta genética tenga una condicion corporal ideal.
                                </p>

                                <div className="flex-center gap-4">

                                    <label htmlFor='minRange'>
                                        <p className=' font-medium'>
                                            Mínimo ideal
                                        </p>
                                        <input
                                            {...register("minRange")}
                                            name='minRange'
                                            type="text"
                                            placeholder='Ej. 10'
                                            disabled={isSubmitting}
                                            className={`input ${errors.minRange ? 'border-red-500' : ''}`}
                                        />
                                        <div className="input_error">
                                            {errors.minRange && (<p>{`${errors.minRange.message}`}</p>)}
                                        </div>
                                    </label>

                                    <label htmlFor='maxRange'>
                                        <p className=' font-medium'>
                                            Máximo ideal
                                        </p>
                                        <input
                                            {...register("maxRange")}

                                            name='maxRange'
                                            type="text"
                                            placeholder='Ej. 15'
                                            disabled={isSubmitting}
                                            className={`input ${errors.maxRange ? 'border-red-500' : ''}`}
                                        />
                                        <div className="input_error">
                                            {errors.maxRange && (<p>{`${errors.maxRange.message}`}</p>)}
                                        </div>
                                    </label>
                                </div>

                            </div>

                            <div className="mt-6 flex-end gap-3">
                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <LoadingIcon /> : <>
                                        <p>Crear genética</p>
                                        <MiniAddIcon fill='fill-clime' />
                                    </>}
                                </button>
                            </div>

                        </form >
                    </Card>
                </motion.div>
            </BlackOutModal>
        </>
    )
}

export default AddGeneticBtn

