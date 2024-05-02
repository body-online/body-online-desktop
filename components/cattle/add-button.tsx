"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { CattleSchema, GeneticProps, LocationProps, cattleSchema } from "@/lib/types";
import { useState } from "react";
import { enterModal } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { LoadingIcon, MiniAddIcon } from '../ui/icons';
import Modal from '../ui/modal';
import { createCattle } from '@/actions/cattle';
import Card from '../ui/card';
import SelectInputSearch from '../ui/select-input-search';
import { SelectOptionProps } from '../ui/select-input';

export function AddCattleBtn({ data }: { data: { genetics: GeneticProps[]; locations: LocationProps[] } }) {
    const locations = data.locations.map((location) => { return { value: location._id, label: location.name } })
    const genetics = data.genetics.map((genetic) => { return { value: genetic._id, label: genetic.name } })
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const {
        register,
        setValue,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CattleSchema>({ resolver: zodResolver(cattleSchema), })

    const handleClose = () => {
        reset();
        return setIsOpen(false);
    };
    const handleOpen = () => {
        return setIsOpen(true);
    };

    const onSubmit: SubmitHandler<CattleSchema> = async (data: CattleSchema) => {
        const toastSavingCattle = toast.loading("Creando individuo...");
        try {
            const { error } = await createCattle(data);
            if (error) return toast.error(error);

            toast.success(`Individuo creado exitosamente!`);
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
            <button className="rounded_btn cgreen" onClick={handleOpen}>
                <MiniAddIcon fill="fill-clime" />
            </button>

            <Modal handleClose={handleClose} isOpen={isOpen}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-xl"
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Card headerLabel="Crear individuo">
                        <form className="mt-6 space-y-8" onSubmit={handleSubmit(onSubmit)}>

                            <div className="space-y-4 w-full max-w-2xl">
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

                                <SelectInputSearch
                                    label='Ubicación*'
                                    placeholder='Seleccione una opción'
                                    value={watch('locationId') ? locations.find((o) => o.value == watch('locationId')) : null}
                                    options={locations}
                                    isDisabled={isSubmitting}
                                    handleChange={(objSelected: SelectOptionProps) => {
                                        return setValue("locationId", objSelected.value);
                                    }}
                                    error={errors?.locationId?.message}
                                />

                                <SelectInputSearch
                                    label='Genética*'
                                    placeholder='Seleccione una opción'
                                    value={watch('geneticId') ? genetics.find((o) => o.value == watch('geneticId')) : null}
                                    options={genetics}
                                    isDisabled={isSubmitting}
                                    handleChange={(objSelected: SelectOptionProps) => {
                                        return setValue("geneticId", objSelected.value);
                                    }}
                                    error={errors?.geneticId?.message}
                                />

                                <div className="mt-6 flex-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="btn slate"
                                        disabled={isSubmitting}
                                    >
                                        <p>Cancelar</p>
                                    </button>
                                    <button type="submit" className="btn black" disabled={isSubmitting}>
                                        {isSubmitting ? <LoadingIcon /> : <p>Crear</p>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </Modal>
        </>
    );
}

export default AddCattleBtn;
