'use client'

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { GeneticSchema, geneticSchema } from '@/lib/types';
import { createGenetic } from '@/actions/genetic';

import { CloseIcon, LoadingIcon, MiniAddIcon } from '../ui/icons';
import { LayoutBody, LayoutBottom, LayoutHeader } from '../ui/default-layout';
import BlackOutModal from '../ui/blackout-modal';
import StepsContainer from '../ui/steps-container';
import StepIndicator from '../ui/step-indicator';
import MultiRangeSlider from '../ui/multirange-slider';
import Card from '../ui/card';

export function AddGeneticBtn() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<GeneticSchema>({
        resolver: zodResolver(geneticSchema)
    })


    const handleClose = () => {
        document.body.style.overflow = "auto";
        reset();
        return setIsOpen(false)
    }
    const handleOpen = () => {
        document.body.style.overflow = "hidden";
        return setIsOpen(true)
    }

    const onSubmit: SubmitHandler<GeneticSchema> = async (data: GeneticSchema) => {
        // const toastSavingGenetic = toast.loading('Creando genética...');
        try {
            const { error, data: createdGenetic } = await createGenetic(data);
            if (error) return toast.error(error)
            // toast.success(`Genética creada exitosamente!`);
            reset();
            handleClose()
            return router.refresh();
        } catch (error) {
            toast.error('Ha ocurrido un error al crear la genética')
        } finally {
            // toast.dismiss(toastSavingGenetic)
        }
    }

    return (
        <>
            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>

                <LayoutHeader>
                    <div className="flex-between w-full container">
                        <h2 className='semititle'>Crear genética</h2>
                        <button
                            type='button'
                            disabled={isSubmitting}
                            onClick={() => setIsOpen(false)}
                            className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30'
                        >
                            <CloseIcon fill='fill-cgray dark:fill-white' />
                        </button>
                    </div>
                </LayoutHeader>

                <StepsContainer>
                    <StepIndicator
                        label='Nombre'
                        value={watch('name')}
                        active={true}
                        step={'1'}
                    />
                    <StepIndicator
                        label='Rango ideal'
                        value={`${watch('minRange')} - ${watch('maxRange')}`}
                        active={true}
                        step={'2'}
                    />
                    <StepIndicator
                        label='Descripción'
                        value={'No requerido'}
                        active={true}
                        step={'3'}
                    />
                </StepsContainer>

                <LayoutBody>
                    <form onSubmit={(e) => { return e.preventDefault() }} className=' px-default py-default'>
                        <div className='space-y-4'>
                            <h3 className='semititle mb-3'>Datos principales</h3>

                            <div>
                                <label htmlFor='name' className='md:col-span-2'>
                                    <p className="input_label">Nombre</p>
                                    <input
                                        {...register("name")}
                                        name='name'
                                        type="text"
                                        placeholder='Ej. Genética 1'
                                        disabled={isSubmitting}
                                        className={`input ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    <div className="input_error">
                                        {errors.name && (<p>{`${errors.name.message}`}</p>)}
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label htmlFor="ranges">
                                    <p className="input_label">Rango ideal</p>
                                    <Card paddings='p-4 max-w-max'>
                                        <div className='h-max pt-2 md:pt-0 md:h-10 flex flex-col md:flex-row justify-center md:justify-start items-center gap-x-4 gap-y-6'>
                                            <MultiRangeSlider
                                                min={2}
                                                max={27}
                                                isSubmitting={isSubmitting}
                                                onChange={({ min, max }) => {
                                                    if (min != Number(watch('minRange'))) {
                                                        return setValue('minRange', `${min}`);
                                                    }
                                                    if (max != Number(watch('maxRange'))) {
                                                        return setValue('maxRange', `${max}`);
                                                    }
                                                }}
                                            />
                                            <p className='chip chip_green'>
                                                {watch('minRange')} - {watch('maxRange')}
                                            </p>
                                        </div>
                                    </Card>
                                </label>
                            </div>

                            <div>
                                <label htmlFor='description' className='md:col-span-2'>
                                    <p className="input_label">Descripción</p>
                                    <textarea
                                        {...register("description")}
                                        name='description'
                                        placeholder='Escriba una descripción de ser necesario'
                                        disabled={isSubmitting}
                                        className={`h-32 md:h-60 textarea`}
                                    />
                                </label>
                            </div>
                        </div>
                    </form >
                </LayoutBody>

                <LayoutBottom>
                    <div className="flex-end w-full">
                        <button
                            disabled={isSubmitting || !watch('name')}
                            className='rounded_btn bg-csemigreen dark:bg-clime md:max-w-max px-3'
                            type='button'
                            onClick={handleSubmit(onSubmit)}
                        >
                            {isSubmitting ? (
                                <LoadingIcon fill='fill-clime dark:fill-cblack' />
                            ) : (
                                <div className='flex-center gap-1'>
                                    <p className='text-white py-1 dark:text-cblack'>Crear genética</p>
                                    <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                                </div>
                            )}
                        </button>
                    </div>
                </LayoutBottom>
            </BlackOutModal>


            <button
                onClick={handleOpen}
                className='h-max w-max rounded_btn bg-csemigreen dark:bg-clime flex-center px-3 gap-1'
            >
                <div className='flex-center gap-1'>
                    <p className={`text-white dark:text-cblack font-medium`}>Crear genética</p>
                    <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                </div>
            </button>
        </>
    )
}

export default AddGeneticBtn

// 'use client'

// import { zodResolver } from '@hookform/resolvers/zod';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import toast from 'react-hot-toast';
// import { motion } from 'framer-motion';

// import { GeneticSchema, geneticSchema } from '@/lib/types';
// import { MiniAddIcon, LoadingIcon } from '../ui/icons';
// import { createGenetic } from '@/actions/genetic';
// import Modal from '../ui/modal';
// import { useState } from 'react';
// import Card from '../ui/card';
// import { enterModal } from '@/lib/constants';
// import { useRouter } from 'next/navigation';
// import BlackOutModal from '../ui/blackout-modal';

// export function AddGeneticBtn({ chipMode, children }: { chipMode?: boolean; children?: React.ReactNode }) {
//     const router = useRouter()
//     const [isOpen, setIsOpen] = useState(false)
//     const {
//         register,
//         handleSubmit,
//         setError,
//         formState: { errors, isSubmitting },
//         reset
//     } = useForm<GeneticSchema>({
//         resolver: zodResolver(geneticSchema)
//     })


//     const handleClose = () => {
//         reset();
//         document.body.style.overflow = "auto";
//         return setIsOpen(false)
//     }
//     const handleOpen = () => {
//         document.body.style.overflow = "hidden";
//         return setIsOpen(true)
//     }

//     const onSubmit: SubmitHandler<GeneticSchema> = async (data: GeneticSchema) => {
//         const toastSavingGenetic = toast.loading('Creando genética...');
//         try {
//             if (data?.maxRange < data?.minRange) return setError('minRange', {
//                 type: "manual",
//                 message: "El mínimo debe ser menor que el máximo",
//             })

//             const { error, data: createdGenetic } = await createGenetic(data);
//             if (error) return toast.error(error)
//             toast.success(`Genética creada exitosamente!`);
//             reset();
//             handleClose()
//             router.refresh()
//         } catch (error) {
//             toast.error('Ha ocurrido un error al crear la genética')
//         } finally {
//             toast.dismiss(toastSavingGenetic)
//         }
//     }

//     return (
//         <>

//             <button onClick={handleOpen}>
//                 {children ??
//                     <div className={`${chipMode ? 'chip cgreen dark:bg-csemigreen flex-center gap-2' : 'primary-btn'}`}>
//                         <p>Crear  {chipMode ? '' : 'nueva'} genética</p>
//                         <MiniAddIcon fill='fill-clime dark:fill-cblack' />
//                     </div>
//                 }
//             </button>

//             <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
//                 <motion.div
//                     onClick={(e) => e.stopPropagation()}
//                     variants={enterModal}
//                     initial="hidden"
//                     animate="visible"
//                     exit="exit"
//                     className='max-w-md m-auto'
//                 >
//                     <Card headerLabel='Crear genética'>
//                         <form className='relative flex flex-col max-h-[90vh] overflow-auto mt-3 space-y-3' onSubmit={handleSubmit(onSubmit)}>

//                             <label htmlFor='name'>
//                                 <p className="input_label">Nombre*</p>
//                                 <input
//                                     {...register("name")}
//                                     name='name'
//                                     type="text"
//                                     placeholder='Ej. Genética F'
//                                     disabled={isSubmitting}
//                                     className={`input ${errors.name ? 'border-red-500' : ''}`}
//                                 />
//                                 <div className="input_error">
//                                     {errors.name && (<p>{`${errors.name.message}`}</p>)}
//                                 </div>
//                             </label>

//                             <label htmlFor='description'>
//                                 <p className="input_label">Descripción</p>
//                                 <textarea
//                                     {...register("description")}
//                                     name='description'
//                                     placeholder='Escriba una descripción de ser necesario'
//                                     disabled={isSubmitting}
//                                     className={` input min-h-14 max-h-28 ${errors.description ? 'border-red-500' : ''}`}
//                                 />
//                             </label>

//                             <div className='w-full rounded-xl bg-green-100 dark:bg-csemigreen/20 px-3 pt-3'>
//                                 <p className='text-base font-medium leading-6 mb-3'>
//                                     Define el rango donde el individuo que pertenezca a esta genética tenga una condicion corporal ideal.
//                                 </p>

//                                 <div className="flex-center gap-4">

//                                     <label htmlFor='minRange'>
//                                         <p className=' font-medium'>
//                                             Mínimo ideal
//                                         </p>
//                                         <input
//                                             {...register("minRange")}
//                                             name='minRange'
//                                             type="text"
//                                             placeholder='Ej. 10'
//                                             disabled={isSubmitting}
//                                             className={`input ${errors.minRange ? 'border-red-500' : ''}`}
//                                         />
//                                         <div className="input_error">
//                                             {errors.minRange && (<p>{`${errors.minRange.message}`}</p>)}
//                                         </div>
//                                     </label>

//                                     <label htmlFor='maxRange'>
//                                         <p className=' font-medium'>
//                                             Máximo ideal
//                                         </p>
//                                         <input
//                                             {...register("maxRange")}

//                                             name='maxRange'
//                                             type="text"
//                                             placeholder='Ej. 15'
//                                             disabled={isSubmitting}
//                                             className={`input ${errors.maxRange ? 'border-red-500' : ''}`}
//                                         />
//                                         <div className="input_error">
//                                             {errors.maxRange && (<p>{`${errors.maxRange.message}`}</p>)}
//                                         </div>
//                                     </label>
//                                 </div>

//                             </div>

//                             <div className="mt-6 flex-end gap-3">
//                                 <button
//                                     type="submit"
//                                     className="primary-btn"
//                                     disabled={isSubmitting}
//                                 >
//                                     {isSubmitting ? <LoadingIcon /> : <>
//                                         <p>Crear genética</p>
//                                         <MiniAddIcon fill='fill-clime dark:fill-cblack' />
//                                     </>}
//                                 </button>
//                             </div>

//                         </form >
//                     </Card>
//                 </motion.div>
//             </BlackOutModal>
//         </>
//     )
// }

// export default AddGeneticBtn

