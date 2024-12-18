'use client'

import toast from 'react-hot-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FarmSchema, farmSchema } from '@/lib/types';
import { LoadingIcon } from './ui/icons';
import { createFarm } from '@/actions/farm';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from './ui/card';
import SelectInputSearch from './ui/select-input-search';
import { SelectOptionProps } from './ui/select-input';
import { useSession } from 'next-auth/react';
import { COUNTRIES } from '@/lib/countries';
import { useEffect, useState } from 'react';
import { searchCities } from '@/data/cities';


export function FarmForm() {
    const router = useRouter()
    const { update, data: session } = useSession()
    const { register, watch, setValue, handleSubmit, formState: { errors, isSubmitting },
    } = useForm<FarmSchema>({ resolver: zodResolver(farmSchema) })
    const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false)
    const [cities, setCities] = useState<SelectOptionProps[]>([])
    const country = watch('country')

    const onSubmit: SubmitHandler<FarmSchema> = async (data: FarmSchema) => {
        try {
            // save farm data
            const response = await createFarm(data);

            if (response?.error) {
                return toast.error(response?.error);
            }
            await update({ session })
        } catch (error) {
            console.log(error)
            toast.error('Ha ocurrido un error al crear la organización')
        } finally {
            router.refresh()
        }
    }

    async function handleSearchCities() {
        try {
            setIsLoadingCities(true)
            const cities = await searchCities({ country })

            if (!cities?.length) {
                setCities([])
                return toast.error('Error al buscar las ciudades')
            }

            setCities(cities.map((i) => { return { "value": i.toLowerCase(), "label": i } }))
        } catch (error) {
            setCities([])
        } finally {
            setIsLoadingCities(false)
        }
    }

    useEffect(() => {
        if (country)
            handleSearchCities();
    }, [country])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            className="max-w-lg w-full my-auto"
            key='register-form'
        >
            <Card headerLabel="Mi organización">
                <p className='text-base mt-1 mb-6 opacity-80 font-normal'>Necesitamos que por favor nos brindes algunos datos antes de comenzar.</p>
                {isSubmitting ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-[30vh] w-full max-w-lg px-4 flex-center"
                        key='loading-session'
                    >
                        <div className="flex flex-col items-center gap-2">
                            <LoadingIcon />
                            <p className='text-center'>Guardando datos...</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3 } }}
                        onSubmit={handleSubmit((onSubmit))}
                        key='register-form'
                    >
                        <div className='flex flex-col w-full space-y-4 mt-3'>
                            <div className="grid w-full grid-cols-6 gap-2">
                                <div className="col-span-4">
                                    <label htmlFor='name'>
                                        <input
                                            {...register("name")}
                                            name='name'
                                            type="text"
                                            placeholder='Nombre de la organización'
                                            disabled={isSubmitting}
                                            className={`input ${errors.name ? 'border-red-500' : ''}`}
                                        />
                                        <div className="input_error">
                                            {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                        </div>
                                    </label>
                                </div>

                                <div className="col-span-2">
                                    <label htmlFor='cattleAmount'>
                                        <input
                                            {...register("cattleAmount")}
                                            name='cattleAmount'
                                            type="text"
                                            placeholder='Cant. madres'
                                            disabled={isSubmitting}
                                            className={`input ${errors.cattleAmount ? 'border-red-500' : ''}`}
                                        />
                                        <div className="input_error">
                                            {errors.cattleAmount && (<p>{`${errors.cattleAmount.message}`}</p>)}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <SelectInputSearch
                                label=''
                                placeholder='Seleccione una opción'
                                value={watch('country') ? COUNTRIES.find((o) => o.label.toLowerCase() == watch('country')) : null}
                                options={COUNTRIES}
                                isDisabled={isSubmitting}
                                handleChange={(objSelected: SelectOptionProps) => {
                                    return setValue("country", objSelected.label.toLowerCase());
                                }}
                                error={errors?.country?.message}
                            />

                            <SelectInputSearch
                                label=''
                                placeholder='Seleccione una opción'
                                value={watch('city') ? cities.find((o) => o.label.toLowerCase() == watch('city')) : null}
                                options={cities}
                                isDisabled={isSubmitting || isLoadingCities}
                                handleChange={(objSelected: SelectOptionProps) => {
                                    return setValue("city", objSelected.label.toLowerCase());
                                }}
                                error={errors?.city?.message}
                            />

                        </div>

                        <div className="flex-center py-4">
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className='primary-btn '
                            >
                                <p className={`text-white dark:text-cblack font-medium`}>
                                    {isSubmitting ? "Guardando..." : "Completar datos"}
                                </p>

                                {isSubmitting ?
                                    <LoadingIcon fill='fill-clime dark:fill-cblack' />
                                    :
                                    null
                                }

                            </button>
                        </div>
                    </motion.form >
                )}
            </Card >
        </motion.div >
    )
}

export default FarmForm