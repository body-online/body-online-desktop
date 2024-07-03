'use client'

import toast from 'react-hot-toast';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FarmSchema, farmSchema } from '@/lib/types';
import { LoadingIcon, SendIcon } from './ui/icons';
import { countries, provinces } from '@/lib/constants';
import { createFarm } from '@/actions/farm';
import { useRouter } from 'next/navigation';
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
        <div className="max-w-2xl w-full mx-auto">
            <Card headerLabel=''>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className='space-y-4'>
                        <div className="flex items-center gap-1">
                            <ClipIcon />
                            <p className='text-base font-medium text-slate-500'>Datos de mi organización</p>
                        </div>
                        <div className="grid grid-cols-6 gap-4 w-full">
                            <div className="col-span-2">
                                <label htmlFor='cattleAmount'>
                                    <p className="input_label">Nro. madres</p>
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
                            <div className='col-span-4'>
                                <label htmlFor='name'>
                                    <p className="input_label">Organización*</p>
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

                        <button disabled={isSubmitting} className='primary-btn' type='submit'>
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
        </div >
    )
}

export default FarmForm

const MeasureIcon = ({ fill }: { fill?: string }) => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={`${fill ?? `fill-slate-500`} w-4 h-4`}>
                <path d="M6.5 2.25a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0V4.5h6.75a.75.75 0 0 0 0-1.5H6.5v-.75ZM11 6.5a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-.75h2.25a.75.75 0 0 0 0-1.5H11V6.5ZM5.75 10a.75.75 0 0 1 .75.75v.75h6.75a.75.75 0 0 1 0 1.5H6.5v.75a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75ZM2.75 7.25H8.5v1.5H2.75a.75.75 0 0 1 0-1.5ZM4 3H2.75a.75.75 0 0 0 0 1.5H4V3ZM2.75 11.5H4V13H2.75a.75.75 0 0 1 0-1.5Z" />
            </svg>
        </div>
    )
}

const ClipIcon = ({ fill }: { fill?: string }) => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={`${fill ?? `fill-slate-500`} w-4 h-4`}>
                <path fillRule="evenodd" d="M11.914 4.086a2 2 0 0 0-2.828 0l-5 5a2 2 0 1 0 2.828 2.828l.556-.555a.75.75 0 0 1 1.06 1.06l-.555.556a3.5 3.5 0 0 1-4.95-4.95l5-5a3.5 3.5 0 0 1 4.95 4.95l-1.972 1.972a2.125 2.125 0 0 1-3.006-3.005L9.97 4.97a.75.75 0 1 1 1.06 1.06L9.058 8.003a.625.625 0 0 0 .884.883l1.972-1.972a2 2 0 0 0 0-2.828Z" clipRule="evenodd" />
            </svg>

        </div>
    )
}