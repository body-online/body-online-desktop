"use client";

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { z } from 'zod';

import { CreateCattleSchema, createCattleSchema, GeneticProps, LocationProps } from '@/lib/types';
import { createCattle } from '@/actions/cattle';

import { ArrowsIcon, LoadingIcon } from '../ui/icons';
import { AxiosError } from 'axios';
import LocationsList from '../location/locations-list';
import GeneticsList from '../genetic/genetic-list';
import CloseBtn from '../ui/close-btn';

const CreateCattleForm = (
    { disabled, handleRefresh, handleClose }: {
        disabled?: boolean;
        handleRefresh?: () => void;
        handleClose?: () => void;
    }
) => {
    const [step, setStep] = useState<number>(1)

    // step 2: location list states
    const [selectedLocations, setSelectedLocations] = useState<LocationProps[]>([])

    // step 3: genetics list states
    const [selectedGenetic, setSelectedGenetic] = useState<GeneticProps>()

    // functions
    const onSubmit: SubmitHandler<CreateCattleSchema> = async (data: CreateCattleSchema) => {
        try {
            const { error } = await createCattle(data);
            if (error) return toast.error(error)

            setSelectedLocations([])
            setSelectedGenetic(undefined)
            setStep(1)
            reset();
            toast.success(`Caravana ${data.caravan} registrada`)
        } catch (error: AxiosError | any) {
            console.log(error)
            toast.error(error?.response?.data?.message ?? 'Ha ocurrido un error al crear el individuo.')
        } finally {
            if (handleRefresh) handleRefresh()
        }
    }

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof createCattleSchema>>({ resolver: zodResolver(createCattleSchema), defaultValues: { defaultCicles: '0' } })

    // update the form values after any list changes
    useEffect(() => { if (selectedLocations?.length) setValue('locationId', selectedLocations?.[0]._id) }, [selectedLocations])
    useEffect(() => { setValue('geneticId', `${selectedGenetic?._id}`) }, [selectedGenetic])

    return (
        <>
            <div className="header_container">
                <div className="overflow-x-auto w-full">
                    <div className="flex items-center gap-1 w-max py-1 px-2">
                        <div>
                            <p className="text-base font-medium">
                                Nuevo individuo
                            </p>
                        </div>
                        {watch('caravan') &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />
                                <p className=''>
                                    {watch('caravan')}
                                </p>
                            </>
                        }
                        {watch('defaultCicles') &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />
                                <p className=''>
                                    {watch('defaultCicles')} ciclos
                                </p>
                            </>
                        }
                        {selectedLocations?.[0]?.name &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />

                                {selectedLocations[0].name}
                            </>
                        }
                        {selectedGenetic?.name &&
                            <>
                                <ArrowsIcon direction='-rotate-90' />

                                {selectedGenetic?.name}
                            </>
                        }
                    </div>
                </div>
                {handleClose &&
                    <CloseBtn handleClose={handleClose} />
                }
            </div>

            {isSubmitting ? (
                <div className="flex-center h-full gap-2 py-default ">
                    <LoadingIcon />
                    <p>Creando individuo...</p>
                </div>
            ) : step == 1 ? (
                <div className="px-4 mb-2 w-full">
                    <div className="flex gap-4">
                        <div className="w-full">
                            <label htmlFor='caravan'>
                                <p className="input_instructions mb-2">Caravana</p>
                                <input
                                    onChange={(e: any) => {
                                        const value = e?.target?.value?.toUpperCase()
                                        setValue('caravan', value)
                                    }}
                                    value={watch('caravan') ?? ""}
                                    disabled={isSubmitting}
                                    placeholder='0001'
                                    className={`input !placeholder:text-2xl !text-2xl !placeholder:text-opacity-80 font-semibold ${errors.caravan ? 'border-red-500' : ''}`}
                                    type="text"
                                    name='caravan'
                                />

                                <div className="input_error">
                                    {errors.caravan && (<p>{`${errors.caravan.message}`}</p>)}
                                </div>
                            </label>
                        </div>


                        <label htmlFor='defaultCicles'>
                            <p className="input_instructions mb-2">Nro. de ciclos</p>
                            <input
                                {...register("defaultCicles")}
                                placeholder=''
                                disabled={isSubmitting}
                                className={`input !max-w-[200px] ${errors.defaultCicles ? 'border-red-500' : ''}`}
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
            ) : step == 2 ? (
                <LocationsList
                    onlyOne={true}
                    selectedLocation={selectedLocations ?? []}
                    setSelectedLocation={setSelectedLocations}
                    disabled={isSubmitting}
                />
            ) : step == 3 ? (
                <GeneticsList
                    disabled={isSubmitting}
                    selectedGenetic={selectedGenetic}
                    setSelectedGenetic={setSelectedGenetic}
                // search={searchGenetics}
                />
            ) : null}

            {/* send and control buttons */}
            <div className="buttons_container">
                <button
                    disabled={step == 1 || isSubmitting}
                    className='rounded_btn bg-white dark:bg-clightgray'
                    type='button'
                    onClick={() => setStep(step - 1)}
                >
                    <p className='dark:text-slate-400 text-slate-500'>Anterior</p>
                </button>
                <p className='input_instructions text-sm font-medium'>{step} de 3</p>
                {step == 3 ? (
                    <button
                        className='rounded_btn bg-cgreen dark:bg-clime'
                        disabled={!watch('geneticId') || !watch('caravan') || !watch('locationId') || isSubmitting}
                        type='button'
                        onClick={handleSubmit(onSubmit)}
                    >
                        {/* {isSubmitting ? <LoadingIcon fill='fill-clime dark:fill-cgray' /> : */}
                        <p className='text-white dark:text-cgray'>
                            Crear
                        </p>
                    </button>
                ) : (
                    <button
                        className='rounded_btn bg-cgreen dark:bg-clime'
                        disabled={
                            isSubmitting ||
                            (step == 1 && (!watch('caravan') || !watch('defaultCicles'))) ||
                            (step == 2 && (!watch('locationId')))
                        }
                        type={'button'}
                        onClick={() => setStep(step + 1)}
                    >
                        <p className='text-white dark:text-cgray'>
                            Continuar
                        </p>
                    </button>
                )}
            </div >
        </>
    );
}

export default CreateCattleForm;
