'use client'

import { CattleProps } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import BlackOutModal from '../ui/blackout-modal'
import { LoadingIcon, SearchIcon } from '../ui/icons'
import InfoMessage from '../ui/info'
import { enterModal } from '@/lib/constants'
import { motion } from 'framer-motion'
import Card from '../ui/card'
import ChipState from './chip-state'
import ChipBodyCondition from './chip-body-condition'
import { getCattles } from '@/data/cattle'

const SelectInputSearchCattle = ({ selectedCattle, handleSelectCattle, isOpen, setIsOpen, error, isSubmitting }:
    { selectedCattle?: CattleProps; handleSelectCattle: Function; isOpen: boolean; setIsOpen: Function; error?: string; isSubmitting?: boolean }) => {
    // the list of cattles seached in this component
    const [cattles, setCattles] = useState<CattleProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState<string>()

    const handleOpen = () => {
        if (isSubmitting) return null
        return setIsOpen(true)
    }
    const handleClose = () => {
        return setIsOpen(false)
    }

    const searchCattles = async () => {
        setIsLoading(true)
        try {
            const { data } = await getCattles({ page: 1, limit: 10, name: searchTerm })

            if (data?.cattles) setCattles(data.cattles)

        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    // debounce input filter
    useEffect(() => {
        const handler = setTimeout(() => {
            searchCattles();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);


    return (
        <div>
            <p className='input_label'>
                Individuo
            </p>
            <button
                type='button'
                className='input text-start w-full disabled:opacity-50'
                onClick={handleOpen}
                disabled={isSubmitting}
            >
                <div className="flex-between gap-2">
                    <p className='w-full truncate'>
                        {selectedCattle ? selectedCattle?.caravan : 'Seleccionar individuo'}
                    </p>
                    <SearchIcon fill='fill-cblack dark:fill-white' />
                </div>
            </button>
            <div className="input_error">
                {error && (<p>{`${error}`}</p>)}
            </div>

            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='m-auto max-w-2xl'
                >
                    <Card headerLabel='Seleccionar individuo'>
                        <div className="relative max-h-[74vh] flex flex-col overflow-auto pr-1 mt-3">
                            {/* search */}
                            <div className='w-full sticky top-0 z-30'>
                                <div className="backdrop-blur-md pb-2 rounded-lg border custom-border overflow-hidden h-max mb-3 bg-slate-200/50 dark:bg-clightgray/50">
                                    <div className="flex-center px-3 gap-2 outline-0 ring-0 bg-white dark:bg-clightgray border-b custom-border">
                                        <SearchIcon fill='fill-cblack dark:fill-slate-200' />

                                        <input
                                            className={`text-base h-12 bg-transparent outline-0 ring-0 w-full disabled:opacity-50`}
                                            disabled={!cattles}
                                            placeholder="Buscar por caravana..."
                                            value={searchTerm ?? ''}
                                            onChange={({ target }) => { return setSearchTerm(target.value) }}
                                        />
                                    </div>

                                    <div className='text-sm mx-2 mt-2 flex gap-1 text-slate-600 dark:text-slate-400'>
                                        {isLoading ? <LoadingIcon /> : cattles?.length ?? 0} resultados
                                    </div>
                                </div>
                            </div>


                            {/* results */}
                            <div className="h-full">
                                {isLoading ?
                                    <div className='py-default'>
                                        <LoadingIcon />
                                    </div>
                                    : cattles?.length > 0 ?
                                        <ul className='w-full overflow-auto space-y-2'>
                                            {cattles.map((cattle, index) => {
                                                return (
                                                    <li key={index}>
                                                        <button
                                                            type='button'
                                                            onClick={() => {
                                                                handleSelectCattle(cattle);
                                                                handleClose();
                                                            }}
                                                            className='border custom-border md:hover:bg-salte-100 dark:md:hover:bg-clightgray rounded w-full overflow-auto relative'
                                                        >
                                                            <div className='w-max h-20 flex gap-8 items-center mr-4'>

                                                                <div
                                                                    className='h-full sticky left-0 flex-center z-10 w-full
                                                                    bg-slate-200/50 dark:bg-clightgray/50 backdrop-blur-md
                                                                    border-r custom-border min-w-14 px-3
                                                                    '>
                                                                    <p className="text-xl font-semibold text-center truncate">
                                                                        {cattle.caravan}
                                                                    </p>
                                                                </div>

                                                                <div className='min-w-max'>
                                                                    <p className='text-xs opacity-50 text-start'>Genética</p>
                                                                    <p className="text-base">
                                                                        {cattle.geneticName}
                                                                    </p>
                                                                </div>

                                                                <div className='min-w-max'>
                                                                    <p className='text-xs opacity-50 text-start'>Ubicación</p>
                                                                    <p className="text-base">
                                                                        {cattle.locationName}
                                                                    </p>
                                                                </div>

                                                                <div className='min-w-max'>
                                                                    <p className='text-xs opacity-50 text-start'>Estado</p>
                                                                    <ChipState state={cattle?.state} />
                                                                </div>

                                                                <div className='min-w-max'>
                                                                    <p className='text-xs opacity-50 text-start'>Condición Corporal</p>
                                                                    <ChipBodyCondition
                                                                        bodyRanges={cattle?.bodyRanges}
                                                                        measure={Number(cattle.bodyCondition)}
                                                                        state={cattle.state}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        : <InfoMessage type='censored' title='Sin resultados' subtitle='No hemos encontrado individuos' />
                                }
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </BlackOutModal >

        </div >
    )
}

export default SelectInputSearchCattle