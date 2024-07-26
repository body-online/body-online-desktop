"use client";

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { z } from 'zod';

import { CattleSchema, cattleSchema } from '@/lib/types';
import { createCattle } from '@/actions/cattle';

import SelectCattleLocation from '../location/select-location';
import SelectCattleGenetic from '../genetic/select-genetic';
import { CloseIcon, LoadingIcon, MiniAddIcon } from '../ui/icons';
import { LayoutBottom, LayoutHeader } from '../ui/default-layout';
import BlackOutModal from '../ui/blackout-modal';
import InfoMessage from '../ui/info';
import SelectLocation from '../location/select-location';

export function CreateCattle() {
    const [isOpen, setIsOpen] = useState(false);
    const [massiveUpload, setMassiveUpload] = useState(false);
    const [step, setStep] = useState<number>(0)
    const router = useRouter();

    const onSubmit: SubmitHandler<CattleSchema> = async (data: CattleSchema) => {
        try {
            const { error } = await createCattle(data);
            if (error) return toast.error(error);

            reset();
            router.refresh();
            setStep(0)
            setIsOpen(false)
            toast.success('Individuo creado')
        } catch (error) {
            toast.error("Ha ocurrido un error al crear el individuo");
        }
    };

    useEffect(() => { // esc handler and disable background overflow
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = "auto";
            document.removeEventListener('keydown', handleEsc);
        }

        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof cattleSchema>>({ resolver: zodResolver(cattleSchema), })

    return (
        <>
            <BlackOutModal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
                <LayoutHeader>
                    <div className='w-full space-y-2'>
                        {/* title */}
                        <div className="flex-between w-full">
                            <h2 className='semititle'>Crear individuo{massiveUpload ? 's' : ''}</h2>
                            <button
                                type='button'
                                disabled={isSubmitting}
                                onClick={() => setIsOpen(false)}
                                className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30'
                            >
                                <CloseIcon fill='fill-cgray dark:fill-white' />
                            </button>
                        </div>

                        {/* massive mode switch */}
                        <div className='grid grid-cols-2 max-w-max bg-slate-200 dark:bg-cgray border custom-border rounded-xl overflow-hidden'>
                            <button
                                type='button'
                                onClick={() => setMassiveUpload(false)}
                                disabled={isSubmitting}
                                className={`font-medium text-xs sm:text-sm py-2 px-3 disabled:opacity-40 transition-all
                                    ${massiveUpload ? 'text-slate-400 dark:dark:text-gray-500' : 'bg-clightgray dark:bg-clightgray text-white dark:text-white'}`}
                            >
                                Carga manual
                            </button>
                            <button
                                type='button'
                                onClick={() => setMassiveUpload(true)}
                                disabled={isSubmitting}
                                className={`font-medium text-xs sm:text-sm py-2 px-3 disabled:opacity-40 transition-all
                                    ${!massiveUpload ? 'text-slate-400 dark:dark:text-gray-500' : 'bg-clightgray dark:bg-clightgray text-white dark:text-white'}`}
                            >
                                Carga masiva
                            </button>
                        </div>
                    </div>
                </LayoutHeader>


                <div className='w-full h-full flex flex-col overflow-auto'>
                    {!massiveUpload ? (
                        <div>
                            {isSubmitting ? <div className="m-auto py-default"><LoadingIcon /></div> :
                                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-y-4 max-w-2xl mx-auto">
                                    {step == 0 ?
                                        <div className='py-default px-default h-full w-full'>
                                            <div className="flex flex-col gap-y-4 max-w-3xl mx-auto ">
                                                <h3 className='semititle mb-3'>Datos principales</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <label htmlFor='caravan' className='w-full'>
                                                        <p className="input_label">Caravana*</p>
                                                        <input
                                                            {...register("caravan")}
                                                            placeholder='Ej. AAA001'
                                                            disabled={isSubmitting}
                                                            className={`input ${errors.caravan ? 'border-red-500' : ''}`}
                                                            type="text"
                                                            name='caravan'
                                                        />
                                                        <div className="input_error">
                                                            {errors.caravan && (<p>{`${errors.caravan.message}`}</p>)}
                                                        </div>
                                                    </label>

                                                    <label htmlFor='defaultCicles' className='max-w-1/3'>
                                                        <p className="input_label">Ciclos</p>
                                                        <input
                                                            {...register("defaultCicles")}
                                                            placeholder='Ej. 2'
                                                            disabled={isSubmitting}
                                                            className={`input ${errors.defaultCicles ? 'border-red-500' : ''}`}
                                                            type="number"
                                                            min={0}
                                                            name='defaultCicles'
                                                        />
                                                        <div className="input_error">
                                                            {errors.defaultCicles && (<p>{`${errors.defaultCicles.message}`}</p>)}
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        step == 1 ?
                                            <div className='py-default px-default h-full w-full'>
                                                <SelectLocation watch={watch} setValue={setValue} />
                                            </div>
                                            :
                                            step == 2 ?
                                                <div className='py-default px-default h-full w-full'>
                                                    <SelectCattleGenetic watch={watch} setValue={setValue} />
                                                </div>
                                                :
                                                null
                                    }
                                </form>
                            }
                        </div>
                    ) : (
                        <div key='massive'>
                            <div className='py-default px-default h-full w-full'>
                                <div className="flex flex-col gap-y-4 max-w-3xl mx-auto ">
                                    {/* <h3 className='semititle mb-3'>Datos principales</h3> */}
                                    <InfoMessage type='censored' title='Estamos desarrollando este apartado' />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* send and control buttons */}
                <LayoutBottom>
                    <div className='w-full max-w-2xl mx-auto '>
                        <div className='flex-between gap-4  items-stretch justify-between w-full'>
                            {/* prev */}
                            <button
                                disabled={step != 0 && (!watch('caravan') || !watch('defaultCicles')) || isSubmitting}
                                onClick={() => {
                                    if (step == 0) return setIsOpen(false)
                                    setStep(step - 1)
                                }}
                                className='rounded_btn bg-csemigreen dark:bg-clightgray md:max-w-max px-3'
                            >
                                <p className='text-white py-1'>{step == 0 ? 'Cancelar' : 'Anterior'}</p>
                            </button>

                            {/* next */}
                            {step < 2 ?
                                <button
                                    disabled={(step == 0 && !watch('caravan') || !watch('defaultCicles')) || (step == 1 && !watch('locationId')) || (step === 2 && !watch('geneticId'))}
                                    onClick={() => setStep(step + 1)}
                                    className='rounded_btn bg-csemigreen dark:bg-clightgray md:max-w-max px-3'
                                >
                                    <p className='text-white py-1'>Siguiente</p>
                                </button>
                                :
                                <button
                                    disabled={isSubmitting || !watch('geneticId') || !watch('locationId')}
                                    className='rounded_btn bg-csemigreen dark:bg-clime md:max-w-max px-3'
                                    type='button'
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {isSubmitting ? (
                                        <LoadingIcon fill='fill-clime dark:fill-cblack' />
                                    ) : (
                                        <div className='flex-center gap-1'>
                                            <p className='text-white py-1 dark:text-cblack'>Crear individuo</p>
                                            <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                                        </div>
                                    )}
                                </button>
                            }
                        </div>
                    </div>
                </LayoutBottom>
            </BlackOutModal>


            <button
                onClick={() => { reset(); return setIsOpen(true) }}
                className='h-7 md:h-max w-7 md:w-max rounded_btn bg-csemigreen dark:bg-clime flex-center md:px-3'
            >
                <p className={`text-white dark:text-cblack font-medium hidden md:block`}>Crear individuo</p>
                <MiniAddIcon fill='fill-clime dark:fill-cblack' />
            </button>
        </>
    );
}

export default CreateCattle;
