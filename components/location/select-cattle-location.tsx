'use client'

import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import React, { useEffect, useState } from 'react'

import { getLocations } from '@/data/location'
import { CattleSchema } from '@/lib/types'

import OptionSelector from '../ui/option-selector'
import InfoMessage from '../ui/info'
import LoadingRowsSkeleton from '../ui/loading-rows-skeleton'
import Link from 'next/link'

const SelectCattleLocation = ({ watch, setValue }: { watch: UseFormWatch<CattleSchema>; setValue: UseFormSetValue<CattleSchema> }) => {
    const [options, setOptions] = useState<any[]>();
    const [searchTerm, setSearchTerm] = useState<string>();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const searchLocations = async () => {
        setError(undefined)
        setIsLoading(true)

        try {
            const { data, error } = await getLocations({ page: 1, limit: 10, name: searchTerm })

            if (error || !data?.locations) return setError(error);

            setOptions(data?.locations?.map((o) => { return { label: o.name, value: o._id } }) ?? []);
        } catch (err: any) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    // debounce input filter
    useEffect(() => {
        const handler = setTimeout(() => {
            searchLocations();
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
                            <OptionSelector
                                value={watch('locationId')}
                                error={error}
                                setValue={(e: any) => { return setValue('locationId', e) }}
                                options={options}
                            />
            }
        </div>
    )
}

export default SelectCattleLocation
