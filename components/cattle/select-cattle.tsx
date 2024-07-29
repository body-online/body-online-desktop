'use client'

import React, { useEffect, useState } from 'react'

import { CattleProps, EventSchema } from '@/lib/types'
import { getCattles } from '@/data/cattle'


import LoadingRowsSkeleton from '../ui/loading-rows-skeleton'
import ChipBodyCondition from './chip-body-condition'
import InfoMessage from '../ui/info'
import ChipState from './chip-state'
import { CheckIcon } from '../ui/icons'

const SelectCattle = ({ selectedCattle, setSelectedCattle }: { selectedCattle?: CattleProps, setSelectedCattle: (e: CattleProps) => void }) => {
    const [options, setOptions] = useState<CattleProps[]>();
    const [searchTerm, setSearchTerm] = useState<string>();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const searchCattles = async () => {
        setError(undefined)
        setIsLoading(true)

        try {
            const { data, error } = await getCattles({ page: 1, limit: 10, name: searchTerm })
            if (error || !data?.cattles) return setError(error);

            const selectedAlreadyExist = (data?.cattles?.filter((i) => { return i._id === selectedCattle?._id })?.length >= 1);

            if (!selectedAlreadyExist && selectedCattle && !searchTerm) {
                return setOptions([selectedCattle].concat(data?.cattles))
            } else { return setOptions(data?.cattles) }

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
        <div className="flex flex-col w-full gap-3">
            <h3 className='semititle'>Individuo</h3>

            <input
                type="text"
                className='input'
                placeholder='Buscar por caravana...'
                value={searchTerm ?? ''}
                onChange={({ target }) => { return setSearchTerm(target.value) }}
            />

            <div className="h-full overflow-y-auto">

                {error ? <InfoMessage type='warning' title='Algo ha salido mal...' subtitle={error} /> :
                    isLoading ? <LoadingRowsSkeleton /> :
                        !options?.length ?
                            <div className='max-w-md mx-auto flex-center flex-col'>
                                <InfoMessage type='censored' title='No hemos encontrado individuos'
                                    subtitle={
                                        searchTerm ? `No hemos encontrado resultados que contengan "${searchTerm}"` : 'Debes crear un individuo para continuar'
                                    }
                                />
                            </div> :
                            <ul className='w-full space-y-3 h-max'>
                                {options.map((cattle, index) => {
                                    const selected = cattle?._id === selectedCattle?._id;

                                    return (
                                        <li key={index}>
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    setSelectedCattle(cattle)
                                                }}
                                                className="option_button"
                                            >
                                                <div className="w-full relative overflow-x-auto pb-[2px] flex items-center">
                                                    <div
                                                        className="min-w-max w-max py-1 pl-2 pr-4 sticky left-0 gap-2 flex items-center"
                                                    >
                                                        {selected ? <CheckIcon /> :
                                                            <div className="h-[20px] w-[20px] bg-slate-300 dark:bg-slate-600 rounded-full">
                                                            </div>
                                                        }
                                                        <p className="text-lg font-medium h-full">{cattle.caravan}</p>
                                                    </div>

                                                    <div className="w-full overflow-x-auto">
                                                        <div className="flex items-center gap-2 w-max">
                                                            <ChipState state={cattle?.state} />
                                                            <ChipBodyCondition
                                                                bodyRanges={cattle?.bodyRanges}
                                                                measure={Number(cattle.bodyCondition)}
                                                            />
                                                            <div>
                                                                <p className="text-base px-2">{cattle.geneticName}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-base px-2">{cattle.locationName}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                }
            </div>
        </div >
    )
}

export default SelectCattle
