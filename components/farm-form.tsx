'use client'

import toast from 'react-hot-toast';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FarmSchema, farmSchema } from '@/lib/types';
import { LoadingIcon, SendIcon } from './ui/icons';
import { countries, provinces } from '@/lib/constants';
import { createFarm } from '@/actions/farm';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from './ui/card';
import SelectInputSearch from './ui/select-input-search';
import { SelectOptionProps } from './ui/select-input';

export function FarmForm() {
    const router = useRouter()
    const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FarmSchema>({
        resolver: zodResolver(farmSchema)
    })

    const onSubmit: SubmitHandler<FarmSchema> = async (data: FarmSchema) => {
        const toastSavingFarm = toast.loading('Enviado sus datos...');
        try {
            // save farm data
            const response = await createFarm(data);
            if (response?.error) return toast.error(response?.error)
            toast.success(`Recibimos tus datos!`);
            reset();
            router.refresh()
        } catch (error) {
            console.log(error)
            toast.error('Ha ocurrido un error al crear la organización')
        } finally {
            toast.dismiss(toastSavingFarm)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl w-full"
        >
            <Card headerLabel='Mi organización'>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className='mt-6 space-y-4'>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <div>
                                <label htmlFor='name'>
                                    <p className="input_label">Nombre*</p>
                                    <input
                                        {...register("name")}
                                        name='name'
                                        type="text"
                                        placeholder='Ej. San Fernando'
                                        disabled={isSubmitting}
                                        className={`input ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    <div className="input_error">
                                        {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                    </div>
                                </label>
                            </div>
                            <div>
                                <label htmlFor='cattleAmount'>
                                    <p className="input_label">Cantidad de madres</p>
                                    <input
                                        {...register("cattleAmount")}
                                        name='cattleAmount'
                                        type="text"
                                        placeholder='Ej. 1500'
                                        disabled={isSubmitting}
                                        className={`input ${errors.cattleAmount ? 'border-red-500' : ''}`}
                                    />
                                    <div className="input_error">
                                        {errors.cattleAmount && (<p>{`${errors.cattleAmount.message}`}</p>)}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 w-full">
                            <SelectInputSearch
                                label='País*'
                                placeholder='Seleccione una opción'
                                value={watch('country') ? countries.find((o) => o.value == watch('country')) : null}
                                options={countries}
                                isDisabled={isSubmitting}
                                handleChange={(objSelected: SelectOptionProps) => {
                                    return setValue("country", objSelected.value);
                                }}
                                error={errors?.country?.message}
                            />

                            <SelectInputSearch
                                label='Ciudad / Provincia*'
                                placeholder='Seleccione una opción'
                                value={watch('city') ? provinces.find((o) => o.value == watch('city')) : null}
                                options={provinces}
                                isDisabled={isSubmitting}
                                handleChange={(objSelected: SelectOptionProps) => {
                                    return setValue("city", objSelected.value);
                                }}
                                error={errors?.city?.message}
                            />
                        </div>

                        <button disabled={isSubmitting} className='primary-btn ml-auto' type='submit'>
                            {isSubmitting ? (
                                <LoadingIcon />
                            ) : (
                                <>
                                    <p className='text-white'>Completar registro</p>
                                    <SendIcon fill='fill-clime' />
                                </>
                            )
                            }
                        </button>
                    </div>
                </form >
            </Card >
        </motion.div >
    )
}

export default FarmForm