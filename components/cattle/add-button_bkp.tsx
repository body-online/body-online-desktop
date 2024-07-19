"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { CattleSchema, cattleSchema } from "@/lib/types";
import { createCattle } from '@/actions/cattle';

import SelectInputSearchLocation from './select-input-search-location';
import SelectInputSearchGenetic from './select-input-search-genetics';
import { CloseIcon, LoadingIcon, MiniAddIcon } from '../ui/icons';
import BlackOutModal from '../ui/blackout-modal';
import { LayoutBottom, LayoutHeader } from '../ui/default-layout';
import Card from '../ui/card';

export function AddCattleBtn({ mode }: { mode?: 'chip' | 'mini' }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenLocations, setIsOpenLocations] = useState<boolean>(false)
    const [isOpenGenetics, setIsOpenGenetics] = useState<boolean>(false)
    const {
        register,
        setValue,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CattleSchema>({ resolver: zodResolver(cattleSchema), })

    const registerLocationId = (id: string) => {
        return setValue('locationId', id)
    }
    const registerGeneticId = (id: string) => {
        return setValue('geneticId', id)
    }
    const handleClose = () => {
        if (isOpenLocations || isOpenGenetics || isOpenLocations) {
            setIsOpenLocations(false)
            setIsOpenGenetics(false)
            return setIsOpenLocations(false)
        }
        reset();
        return setIsOpen(false);
    };
    const handleOpen = () => {
        return setIsOpen(true);
    };

    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            return setIsOpen(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = "auto";
        } else {
            window.scrollTo(0, 0)
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = "hidden";
        }
    }, [isOpen])


    const onSubmit: SubmitHandler<CattleSchema> = async (data: CattleSchema) => {
        // const toastSavingCattle = toast.loading("Creando individuo...");
        try {
            const { error } = await createCattle(data);
            if (error) return toast.error(error);

            // toast.success(`Individuo creado`);
            reset();
            handleClose();
            router.refresh();
        } catch (error) {
            toast.error("Ha ocurrido un error al crear el individuo");
        } finally {
            // toast.dismiss(toastSavingCattle);
        }
    };

    const buttonClassName = () => {
        return mode == 'chip' ? 'chip cgreen flex-center gap-2' : mode === 'mini' ? 'rounded-full cgreen dark:bg-csemigreen h-6 sm:h-7 w-6 sm:w-7 flex-center' : 'primary-btn md:max-w-max'
    }

    return (
        <div>
            <button
                onClick={handleOpen}
                className={buttonClassName()}
            >
                {mode != 'mini' ? <p>Crear individuos</p> : null}
                <MiniAddIcon fill='fill-clime dark:fill-cblack' />
            </button >

            <BlackOutModal
                handleClose={handleClose}
                isOpen={isOpen}
            >
                <div className="relative h-full">

                    <LayoutHeader>
                        <div className="flex-between w-full">
                            <h2 className='semititle'>Crear individuos</h2>
                            <button type='button' onClick={() => setIsOpen(false)} className='md:hover:opacity-100 md:opacity-50 transition-all'>
                                <CloseIcon fill='fill-cgray dark:fill-white' />
                            </button>
                        </div>
                    </LayoutHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="max-w-md mx-auto w-full mt-auto md:my-auto">
                            <Card rounded='rounded-t-2xl md:rounded-b-2xl'>
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



                                <SelectInputSearchLocation
                                    isOpen={isOpenLocations}
                                    setIsOpen={setIsOpenLocations}
                                    handleSelectLocation={registerLocationId}
                                    error={errors?.locationId?.message}
                                />

                                <SelectInputSearchGenetic
                                    isOpen={isOpenGenetics}
                                    setIsOpen={setIsOpenGenetics}
                                    handleSelectGenetic={registerGeneticId}
                                    error={errors?.geneticId?.message}
                                />
                            </Card>
                        </div>
                    </form>

                    <LayoutBottom>
                        <div className="px-default h-full max-w-md mx-auto w-full">
                            <button
                                disabled={isSubmitting}
                                className='primary-btn'
                                type='submit'
                            >
                                {isSubmitting ? <LoadingIcon /> : (
                                    <>
                                        <p className='text-white'>Crear individuo</p>
                                        <MiniAddIcon fill='fill-clime dark:fill-cblack' />
                                    </>
                                )}
                            </button>
                        </div>
                    </LayoutBottom>
                </div>


            </BlackOutModal >
        </div>
    );
}

export default AddCattleBtn;
