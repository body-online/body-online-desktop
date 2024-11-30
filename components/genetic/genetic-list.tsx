'use client'

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { GeneticProps } from '@/lib/types'
import { getGenetics } from '@/data/genetic'

import LoadingRowsSkeleton from '../ui/loading-rows-skeleton'
import CheckButton from '../ui/check-button'
import { SearchIcon } from '../ui/icons'
import AddGeneticBtn from './add-genetic'
import { useRouter } from 'next/navigation'

const GeneticsList = (
    { search, disabled, selectedGenetic, setSelectedGenetic }:
        {
            search?: string;
            disabled: boolean;
            selectedGenetic?: GeneticProps;
            setSelectedGenetic: Dispatch<SetStateAction<GeneticProps | undefined>>
        }
) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [genetics, setGenetics] = useState<GeneticProps[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchGenetics = async () => {
        setIsLoading(true)

        try {
            const { data, error } = await getGenetics()

            if (error) return toast.error(error ?? 'Error al buscar el listado de genéticas');

            setGenetics(data);
        } catch (err: any) {
            setGenetics([])
            return toast.error(err ?? 'Error al buscar el listado de genéticas');
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGenetics();
    }, [])

    const filteredGenetics = (!searchTerm || searchTerm == '') ? genetics : genetics?.filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <>
            <div className="px-4 my-2">
                <div className='mb-2'>
                    <p className="input_label">
                        Asignar genética
                    </p>
                </div>

                <div className="flex input gap-3 items-center w-full md:max-w-sm px-4">
                    <div className={`${disabled ? "opacity-50" : ""}`}>
                        <SearchIcon />
                    </div>
                    <input
                        disabled={isLoading || (!genetics?.length && !searchTerm)}
                        className={`bg-transparent border-0 focus:ring-0 outline-0 focus:outline-0`}
                        type="text"
                        placeholder={'Buscar por nombre...'}
                        value={searchTerm ?? ''}
                        onChange={(e) => { return setSearchTerm(e?.target?.value ?? '') }}
                    />
                </div>
            </div>

            <div className="mb-2 px-4">
                <AddGeneticBtn handleRefresh={() => {
                    fetchGenetics();
                    return router.refresh();
                }} />
            </div>

            {isLoading ? <LoadingRowsSkeleton /> :
                filteredGenetics?.length ?
                    <div className="custom_list">
                        {
                            filteredGenetics?.map((genetic, index) => {
                                const selected = Boolean(selectedGenetic?._id === genetic._id);
                                return (
                                    <CheckButton
                                        key={index}
                                        value={genetic.name as string}
                                        label={genetic.name}
                                        onClick={() => setSelectedGenetic(genetic)}
                                        selected={selected}
                                        disabled={disabled}
                                    >
                                        <div className="flex-between gap-3 w-full">
                                            <div className='min-w-32 w-full'>
                                                <p className={`text-start font-medium text-lg text-gray-600 dark:text-gray-300 ${selected ? 'text-opacity-100' : 'dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100'}`}>
                                                    {genetic.name}
                                                </p>
                                            </div>

                                            <p className="chip chip_green">
                                                {genetic.bodyRanges[0]} a {genetic.bodyRanges[1]}
                                            </p>
                                        </div>
                                    </CheckButton>
                                )
                            })
                        }
                    </div> : null
            }
        </>
    )
}

export default GeneticsList
