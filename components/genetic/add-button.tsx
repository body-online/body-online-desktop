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

export function AddGeneticBtn({ chipMode }: { chipMode?: boolean }) {
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
            <button className={`${chipMode ? 'chip cgreen flex-center gap-1' : 'btn cgreen'}`} onClick={handleOpen}>
                <p>Crear {chipMode ? '' : 'nueva'} genética</p>
                <MiniAddIcon fill="fill-clime" />
            </button>

            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"

                >
                    <div className='w-[90vw] h-[80vh] overflow-auto pr-1 max-w-md'>
                        {/* header */}
                        <div
                            className="w-full sticky top-0 z-10 mb-3
                            bg-gradient-to-b from-white via-white/80 to-transparent"
                        >
                            <div className="flex-between gap-3 mb-2">
                                <h1 className="semititle">Crear genética</h1>
                            </div>
                        </div>

                        <form className='mt-6' onSubmit={handleSubmit(onSubmit)}>

                            <div className='w-full'>
                                <label htmlFor='name'>
                                    <p className="input_label">Nombre*</p>
                                    <input
                                        {...register("name")}
                                        name='name'
                                        type="text"
                                        placeholder='ej. Genética F'
                                        disabled={isSubmitting}
                                        className={`input ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    <div className="input_error">
                                        {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                    </div>
                                </label>

                                <div className='my-4'>
                                    <p className='text-base font-medium leading-8'>
                                        Define el rango donde el individuo que <span className='text-green-500'>pertenezca a esta genética</span> tenga una condicion corporal <span className='text-green-500'>ideal</span></p>
                                    <div className='bg-green-200 rounded-xl p-3 flex gap-3 mt-2'>

                                        <div className="w-full">
                                            <label htmlFor='minRange'>
                                                <p className='text-green-500 font-medium'>
                                                    Nro. mínimo
                                                </p>
                                                <input
                                                    {...register("minRange")}
                                                    name='minRange'
                                                    type="text"
                                                    placeholder='ej. 10'
                                                    disabled={isSubmitting}
                                                    className={`input ${errors.minRange ? 'border-red-500' : ''}`}
                                                />
                                                <div className="input_error">
                                                    {errors.minRange && (<p>{`${errors.minRange.message}`}</p>)}
                                                </div>
                                            </label>
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor='maxRange'>
                                                <p className='text-green-500 font-medium'>
                                                    Nro. máximo
                                                </p>
                                                <input
                                                    {...register("maxRange")}

                                                    name='maxRange'
                                                    type="text"
                                                    placeholder='ej. 15'
                                                    disabled={isSubmitting}
                                                    className={`input ${errors.maxRange ? 'border-red-500' : ''}`}
                                                />
                                                <div className="input_error">
                                                    {errors.maxRange && (<p>{`${errors.maxRange.message}`}</p>)}
                                                </div>
                                            </label>
                                        </div>

                                    </div>
                                </div>


                                <label htmlFor='description'>
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
                                        type="submit"
                                        className="btn cgreen"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <LoadingIcon /> : <>
                                            <p>Crear genética</p>
                                            <MiniAddIcon fill='fill-clime' />
                                        </>}
                                    </button>
                                </div>

                            </div>

                        </form >
                    </div>
                </motion.div>
            </BlackOutModal>
        </>
    )
}

export default AddGeneticBtn

