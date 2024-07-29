"use client";

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { z } from 'zod';

import { CattleSchema, cattleSchema } from '@/lib/types';
import { createCattle } from '@/actions/cattle';

import { CloseIcon, LoadingIcon, MiniAddIcon } from '../ui/icons';
import { LayoutBody, LayoutBottom, LayoutHeader } from '../ui/default-layout';
import SelectLocation from '../location/select-location';
import SelectGenetic from '../genetic/select-genetic';
import BlackOutModal from '../ui/blackout-modal';
import StepIndicator from '../ui/step-indicator';
import InfoMessage from '../ui/info';
import StepsContainer from '../ui/steps-container';

export function CreateCattle() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [massiveUpload, setMassiveUpload] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0)
    const [locationName, setLocationName] = useState<string>()
    const [geneticName, setGeneticName] = useState<string>()

    const handleClose = () => {
        return setIsOpen(false)
    }
    const handleOpen = () => {
        setLocationName(undefined)
        setGeneticName(undefined)
        reset();
        setIsOpen(true);
    }

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
            setStep(0)
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
            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <LayoutHeader>
                    <div className="flex-between w-full container">
                        <h2 className='semititle'>Crear individuo{massiveUpload ? 's' : ''}</h2>
                        <button
                            type='button'
                            disabled={isSubmitting}
                            onClick={handleClose}
                            className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30'
                        >
                            <CloseIcon fill='fill-cgray dark:fill-white' />
                        </button>
                    </div>
                </LayoutHeader>

                {/* steps status */}
                <StepsContainer>
                    <StepIndicator
                        label='Caravana'
                        value={watch('caravan')}
                        active={step == 0}
                        step={'1'}
                    />
                    <StepIndicator
                        label='Ciclos'
                        value={watch('defaultCicles')}
                        active={step == 0}
                        step={'2'}
                    />
                    <StepIndicator
                        label='Ubicación'
                        value={locationName}
                        active={step == 1}
                        step={'3'}
                    />
                    <StepIndicator
                        label='Genética'
                        value={geneticName}
                        active={step == 2}
                        step={'4'}
                    />
                </StepsContainer>

                <LayoutBody>
                    {!massiveUpload ? (
                        <>
                            {isSubmitting ? (
                                <div className="flex-center h-full gap-2 py-default">
                                    <LoadingIcon />
                                    <p>Creando individuo...</p>
                                </div>
                            ) : (
                                <form onSubmit={(e) => e.preventDefault()} className='px-default py-default'>
                                    {step == 0 ? (
                                        <div className=''>
                                            <h3 className='semititle mb-3'>Datos principales</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <label htmlFor='caravan' className='w-full'>
                                                    <p className="input_label">Caravana</p>
                                                    <input
                                                        onChange={(e: any) => {
                                                            const value = e?.target?.value?.toUpperCase()
                                                            setValue('caravan', value)
                                                        }}
                                                        value={watch('caravan')}
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
                                    ) : step == 1 ? (
                                        <SelectLocation
                                            watch={watch}
                                            setValue={setValue}
                                            setLocationName={setLocationName}
                                        />
                                    ) : step == 2 ? (
                                        <SelectGenetic
                                            watch={watch}
                                            setValue={setValue}
                                            setGeneticName={setGeneticName}
                                        />
                                    ) : null}
                                </form>
                            )}
                        </>
                    ) : (
                        <div key='massive'>

                            <InfoMessage type='censored' title='Estamos desarrollando este apartado' />
                        </div>
                    )}
                </LayoutBody >

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
            </BlackOutModal >


            <button
                onClick={handleOpen}
                className='h-max w-max rounded_btn bg-csemigreen dark:bg-clime flex-center px-3 gap-1'
            >
                <p className={`text-white dark:text-cblack font-medium`}>Crear individuo</p>
                <MiniAddIcon fill='fill-clime dark:fill-cblack' />
            </button>
        </>
    );
}

export default CreateCattle;
