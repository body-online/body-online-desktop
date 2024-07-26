'use client'

import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import React, { useEffect, useState } from 'react'

import { getGenetics } from '@/data/genetic'
import { CattleSchema } from '@/lib/types'

import LoadingRowsSkeleton from '../ui/loading-rows-skeleton'
import OptionSelector from '../ui/option-selector'
import InfoMessage from '../ui/info'
import Link from 'next/link'

const SelectGenetic = ({ watch, setValue }: { watch: UseFormWatch<CattleSchema>; setValue: UseFormSetValue<CattleSchema> }) => {
    const [options, setOptions] = useState<{ value: string; label: string; }[]>();
    const [filteredGenetics, setFilteredGenetics] = useState<{ value: string; label: string; }[]>();
    const [searchTerm, setSearchTerm] = useState<string>();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const searchGenetics = async () => {
        setError(undefined)
        setIsLoading(true)

        try {
            const { data, error } = await getGenetics()

            if (error || !data?.length) return setError(error);

            setOptions(data?.map((o) => { return { label: o.name, value: o._id } }) ?? []);
        } catch (err: any) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => { searchGenetics() }, [])

    // debounce input filter
    useEffect(() => {
        if (searchTerm)
            return setFilteredGenetics(options?.filter((a) => { return a.label.toLowerCase().includes(searchTerm.toLowerCase()) }))
        setFilteredGenetics(undefined);
    }, [searchTerm]);

    return (
        <div className="h-full flex flex-col gap-y-2">
            <h3 className="semititle">Genética</h3>
            <label className='flex-center'>
                <input type="text" className='input' placeholder='Buscar por genética...' value={searchTerm ?? ''}
                    onChange={({ target }) => { return setSearchTerm(target.value) }} />
            </label>

            {
                error ? <InfoMessage type='warning' title='Algo ha salido mal...' subtitle={error} /> :
                    isLoading ? <LoadingRowsSkeleton /> :
                        (!filteredGenetics?.length && searchTerm) || !options ?
                            <div className='max-w-md mx-auto flex-center flex-col'>
                                <InfoMessage type='info' title='No hemos encontrado genéticas'
                                    subtitle={
                                        !searchTerm ? 'Debes crear una genética para continuar' :
                                            `No hemos encontrado resultados que contengan "${searchTerm}"`
                                    }
                                />
                                <Link href='/geneticas' className='rounded_btn custom-gradient px-3'>
                                    Ir a genéticas
                                </Link>
                            </div> :
                            <OptionSelector
                                value={watch('geneticId')}
                                error={error}
                                setValue={(e: any) => { return setValue('geneticId', e) }}
                                options={filteredGenetics ?? options}
                            />
            }
        </div>
    )
}

export default SelectGenetic
