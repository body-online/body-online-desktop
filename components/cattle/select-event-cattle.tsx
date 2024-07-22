'use client'

import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { getCattles } from '@/data/cattle'
import { EventSchema } from '@/lib/types'


import LoadingRowsSkeleton from '../ui/loading-rows-skeleton'
import ChipBodyCondition from './chip-body-condition'
import InfoMessage from '../ui/info'
import ChipState from './chip-state'

const SelectEventCattle = ({ watch, setValue } : { watch: UseFormWatch<EventSchema>; setValue: UseFormSetValue<EventSchema> }) => {
    const [options, setOptions] = useState<any[]>();
    const [searchTerm, setSearchTerm] = useState<string>();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const searchCattles = async () => {
        setError(undefined)
        setIsLoading(true)

        try {
            const { data, error } = await getCattles({ page: 1, limit: 10, name: searchTerm })

            if (error || !data?.cattles) return setError(error);

            setOptions(data?.cattles);
        } catch (err: any) {
            setError(error)
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
        <div className="h-full flex flex-col gap-y-2">
            <label className='flex-center'>
                <input type="text" className='input' placeholder='Buscar por ubicación...' value={searchTerm ?? ''}
                    onChange={({ target }) => { return setSearchTerm(target.value) }} />
            </label>

            {
                error ? <InfoMessage type='warning' title='Algo ha salido mal...' subtitle={error} /> :
                    isLoading ? <LoadingRowsSkeleton /> :
                        !options?.length ?
                            <div className='max-w-md mx-auto flex-center flex-col'>
                                <InfoMessage type='info' title='No hemos encontrado ubicaciones'
                                    subtitle={
                                        !searchTerm ? 'Debes crear una ubicación para continuar' :
                                            `No hemos encontrado resultados que contengan "${searchTerm}"`
                                    }
                                />
                                <Link href='/ubicaciones' className='rounded_btn custom-gradient px-3'>
                                    Ir a ubicaciones
                                </Link>
                            </div> :
                            <ul className='w-full overflow-auto space-y-2'>
                                {options.map((cattle, index) => {
                                    return (
                                        <li key={index}>
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    // handleSelectEventCattle(cattle);
                                                    // handleClose();
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
            }
        </div>
    )
}

export default SelectEventCattle
