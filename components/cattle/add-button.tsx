"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { CattleSchema, cattleSchema } from "@/lib/types";
import { createCattle } from '@/actions/cattle';
import { enterModal } from "@/lib/constants";

import SelectInputSearchLocation from './select-input-search-location';
import SelectInputSearchGenetic from './select-input-search-genetics';
import { LoadingIcon, MiniAddIcon } from '../ui/icons';
import BlackOutModal from '../ui/blackout-modal';

export function AddCattleBtn({ chipMode }: { chipMode?: boolean }) {
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

    useEffect(() => {
        document.body.style.overflow = isOpen || isOpenLocations || isOpenGenetics ? "hidden" : "auto";
    }, [isOpen, isOpenGenetics, isOpenLocations]);

    const onSubmit: SubmitHandler<CattleSchema> = async (data: CattleSchema) => {
        const toastSavingCattle = toast.loading("Creando individuo...");
        try {
            const { error } = await createCattle(data);
            if (error) return toast.error(error);

            toast.success(`Individuo creado`);
            reset();
            handleClose();
            router.refresh();
        } catch (error) {
            toast.error("Ha ocurrido un error al crear el individuo");
        } finally {
            toast.dismiss(toastSavingCattle);
        }
    };

    return (
        <>
            <button className={`${chipMode ? 'chip cgreen flex-center gap-1' : 'btn cgreen'}`} onClick={handleOpen}>
                <p>Crear  {chipMode ? '' : 'nuevo'} individuo</p>
                <MiniAddIcon fill="fill-clime" />
            </button>

            <BlackOutModal handleClose={handleClose} isOpen={isOpen}>
                <motion.span
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <form className='w-[90vw] h-[80vh] overflow-auto pr-1 max-w-xl' onSubmit={handleSubmit(onSubmit)}>

                        <div className="space-y-4">
                            <h1 className="semititle">Crear individuo</h1>
                            <div className="flex gap-2 w-full">
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

                            <div className="grid md:grid-cols-2 gap-3 w-full">
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
                            </div>



                            <div className="mt-6 flex-end gap-3">
                                <button type="submit" className="btn cgreen" disabled={isSubmitting}>
                                    {isSubmitting ? <LoadingIcon /> :
                                        <>
                                            <p>Crear individuo</p>
                                            <MiniAddIcon fill='fill-clime' />
                                        </>
                                    }
                                </button>
                            </div>
                        </div>

                    </form>

                </motion.span>
            </BlackOutModal>
        </>
    );
}

export default AddCattleBtn;
