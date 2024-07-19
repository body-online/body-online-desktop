import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import React, { useState } from 'react'

import { CattleSchema } from '@/lib/types'
import { createCattle } from '@/actions/cattle'

import { LoadingIcon, MiniAddIcon } from '../ui/icons'
import { LayoutBottom } from '../ui/default-layout'
import SelectCattleLocation from '../location/select-cattle-location'
import SelectCattleGenetic from '../genetic/select-cattle-genetic'

type CreateSingleCattleProps = {
    handleSubmit: UseFormHandleSubmit<CattleSchema>;
    register: UseFormRegister<CattleSchema>;
    isSubmitting?: boolean;
    errors: FieldErrors<CattleSchema>;
    reset: UseFormReset<CattleSchema>;
    watch: UseFormWatch<CattleSchema>;
    setValue: UseFormSetValue<CattleSchema>;
    handleCloseCattlesModal: () => void;
};

const CreateSingleCattle = ({ handleSubmit, register, isSubmitting, errors, reset, watch, setValue, handleCloseCattlesModal }: CreateSingleCattleProps) => {
    const [step, setStep] = useState<number>(0)
    const router = useRouter();

    const onSubmit: SubmitHandler<CattleSchema> = async (data: CattleSchema) => {
        try {
            const { error } = await createCattle(data);
            if (error) return toast.error(error);

            reset();
            handleCloseCattlesModal();
            router.refresh();
            toast.success('Individuo creado')
        } catch (error) {
            toast.error("Ha ocurrido un error al crear el individuo");
        }
    };

    return (
        <>
            <div className='py-default px-default h-full w-full bg-gradient-to-b dark:from-cgray/50 border-t custom-border'>
                {isSubmitting ? <LoadingIcon /> :
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-y-4 max-w-2xl mx-auto ">
                        {step == 0 ?
                            <>
                                <h3 className='semititle'>Datos principales</h3>
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
                            </>
                            :
                            step == 1 ?
                                <>
                                    <h3 className='semititle'>Asignar ubicación</h3>
                                    <SelectCattleLocation
                                        watch={watch}
                                        setValue={setValue}
                                    />
                                </>
                                :
                                step == 2 ?
                                    <>
                                        <h3 className='semititle'>Asignar genetica</h3>
                                        <SelectCattleGenetic
                                            watch={watch}
                                            setValue={setValue}
                                        />
                                    </> : null
                        }

                    </form>
                }
            </div>

            {/* send and control buttons */}
            <LayoutBottom>
                <div className='w-full space-y-4 max-w-2xl mx-auto '>

                    <div className='flex-between gap-4  items-stretch justify-between w-full'>

                        {/* prev */}
                        <button
                            disabled={step != 0 && (!watch('caravan') || !watch('defaultCicles')) || isSubmitting}
                            onClick={() => {
                                if (step == 0) return handleCloseCattlesModal()
                                setStep(step - 1)
                            }}
                            className='rounded_btn bg-cgray dark:bg-clightgray md:max-w-max px-3'
                        >
                            <p className='text-white py-1'>{step == 0 ? 'Cancelar' : 'Anterior'}</p>
                        </button>

                        {/* next */}
                        {step < 2 ?
                            <button
                                disabled={(step == 0 && !watch('caravan') || !watch('defaultCicles')) || (step == 1 && !watch('locationId')) || (step === 2 && !watch('geneticId'))}
                                onClick={() => setStep(step + 1)}
                                className='rounded_btn bg-cgray dark:bg-clightgray md:max-w-max px-3'
                            >
                                <p className='text-white py-1'>Siguiente</p>
                            </button>
                            :
                            <button
                                disabled={isSubmitting || !watch('geneticId')}
                                className='primary-btn md:max-w-max'
                                type='submit'
                                onClick={handleSubmit(onSubmit)}
                            >
                                {isSubmitting ? <LoadingIcon fill='fill-clime dark:fill-cblack' /> : (
                                    <>
                                        <p>Crear individuo</p>
                                        <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                                    </>
                                )}
                            </button>
                        }
                    </div>
                </div>

            </LayoutBottom>
        </>
    )
}

export default CreateSingleCattle;