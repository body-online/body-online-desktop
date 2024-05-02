'use client'

import toast from 'react-hot-toast';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FarmSchema, farmSchema } from '@/lib/types';
import { LoadingIcon, SendIcon } from './ui/icons';
import { countries } from '@/lib/constants';
import { createFarm } from '@/actions/farm';
import { useRouter } from 'next/navigation';
import Card from './ui/card';

export function FarmForm() {
    const router = useRouter()
    const {
        register,
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
        <form onSubmit={handleSubmit(onSubmit)}>

            <p className="subtitle mb-2">Datos principales</p>
            <Card>

                {/* <div className="grid md:grid-cols-3 gap-4 w-full"> */}
                <label htmlFor='name' className='md:col-span-2'>
                    <p className="input_label">Nombre de la organización*</p>
                    <input
                        {...register("name")}
                        name='name'
                        type="text"
                        placeholder='ej. San Fernando'
                        disabled={isSubmitting}
                        className={`input ${errors.name ? 'border-red-500' : ''}`}
                    />
                    <div className="input_error">
                        {errors.name && (<p>{`${errors.name.message}`}</p>)}
                    </div>
                </label>
                {/* <label htmlFor='animalsAmount'>
                        <p className="input_label">Número de madres</p>
                        <input
                            {...register("animalsAmount")}
                            name='animalsAmount'
                            type="text"
                            placeholder='ej. 15'
                            disabled={isSubmitting}
                            className={`input ${errors.animalsAmount ? 'border-red-500' : ''}`}
                        />
                        <div className="input_error">
                            {errors.animalsAmount && (<p>{`${errors.animalsAmount.message}`}</p>)}
                        </div>
                    </label> */}
                {/* </div> */}

                <div className="grid grid-cols-2 gap-4 w-full">
                    <label htmlFor='country'>
                        <p className="input_label">País*</p>
                        <select
                            {...register('country')}
                            name="country"
                            className='input'
                        >
                            {countries.map((c, index) => {
                                return <option value={c} key={index}>{c}</option>
                            })}
                        </select>
                        <div className="input_error">
                            {errors.country && (<p>{`${errors.country.message}`}</p>)}
                        </div>
                    </label>

                    <label htmlFor='city'>
                        <p className="input_label">Ciudad*</p>
                        <input
                            {...register("city")}
                            name='city'
                            type="text"
                            placeholder='ej. Santa Fe'
                            disabled={isSubmitting}
                            className={`input ${errors.city ? 'border-red-500' : ''}`}
                        />
                        <div className="input_error">
                            {errors.city && (<p>{`${errors.city.message}`}</p>)}
                        </div>
                    </label>
                </div>

                <div className="mt-6 flex-end">
                    <button
                        type="submit"
                        className="btn black"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <LoadingIcon />
                        ) :
                            <>
                                <p>Completar datos</p>
                                <SendIcon />
                            </>

                        }
                    </button>
                </div>

            </Card>

        </form >
    )
}

export default FarmForm

