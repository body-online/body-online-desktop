"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import { z } from 'zod';


import { cattleSchema } from '@/lib/types';

import { CloseIcon, MiniAddIcon } from '../ui/icons';
import { LayoutHeader } from '../ui/default-layout';
import BlackOutModal from '../ui/blackout-modal';
import CreateSingleCattle from './create-single-cattle';
import InfoMessage from '../ui/info';

export function CreateCattle({ mode }: { mode?: 'chip' | 'mini' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [massiveUpload, setMassiveUpload] = useState(false);

    useEffect(() => { // esc handler and disable background overflow
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = "auto";
            document.removeEventListener('keydown', handleEsc);
        }

        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<z.infer<typeof cattleSchema>>({ resolver: zodResolver(cattleSchema), })


    return (
        <div>
            <BlackOutModal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
                <LayoutHeader>
                    <div className='w-full space-y-2'>
                        {/* title */}
                        <div className="flex-between w-full">
                            <h2 className='semititle'>Crear individuos</h2>
                            <button
                                type='button'
                                disabled={isSubmitting}
                                onClick={() => setIsOpen(false)}
                                className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30'
                            >
                                <CloseIcon fill='fill-cgray dark:fill-white' />
                            </button>
                        </div>

                        {/* massive mode switch */}
                        <div className='grid grid-cols-2 max-w-max rounded-xl overflow-hidden bg-slate-200 dark:bg-cgray border custom-border'>
                            <button
                                type='button'
                                onClick={() => setMassiveUpload(false)}
                                disabled={isSubmitting}
                                className={`font-medium text-xs sm:text-sm py-2.5 px-5 disabled:opacity-40 
                                    ${massiveUpload ? '' : 'bg-clightgray dark:bg-clightgray text-white dark:text-white'}`}
                            >
                                Carga manual
                            </button>
                            <button
                                type='button'
                                onClick={() => setMassiveUpload(true)}
                                disabled={isSubmitting}
                                className={`font-medium text-xs sm:text-sm py-2.5 px-5 disabled:opacity-40 
                                    ${!massiveUpload ? '' : 'bg-clightgray dark:bg-clightgray text-white dark:text-white'}`}
                            >
                                Carga masiva
                            </button>
                        </div>
                    </div>
                </LayoutHeader>


                {massiveUpload ?
                    <div key='massive'>
                        <div className='py-default px-default h-full w-full bg-gradient-to-b dark:from-cgray/50 border-t custom-border'>
                            <div className="flex flex-col gap-y-4 max-w-3xl mx-auto ">
                                {/* <h3 className='semititle'>Datos principales</h3> */}
                                <InfoMessage type='censored' title='Estamos desarrollando este apartado, vuelva pronto...' />
                            </div>
                        </div>
                    </div>
                    :
                    <CreateSingleCattle
                        register={register}
                        setValue={setValue}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        errors={errors}
                        reset={reset}
                        watch={watch}
                        handleCloseCattlesModal={() => setIsOpen(false)}
                    />
                }
            </BlackOutModal>

            <button
                onClick={() => { reset(); return setIsOpen(true) }}
                className={`
                    ${mode == 'chip' ? 'chip cgreen flex-center gap-2' :
                        mode === 'mini' ? 'rounded-full bg-cgreen dark:bg-clime h-6 sm:h-7 w-6 sm:w-7 flex-center' :
                            'primary-btn'
                    }`
                }
            >
                <p>Crear individuo</p>
                <MiniAddIcon fill='fill-clime dark:fill-cblack' />
            </button>
        </div >
    );
}

export default CreateCattle;
