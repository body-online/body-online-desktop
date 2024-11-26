'use client'

import { useEffect, useState } from 'react'

import { GeneticProps } from '@/lib/types'

import LoadingTableSkeleton from '../ui/loading-table-skeleton'
import { LoadingIcon, SearchIcon } from '../ui/icons'
import InfoMessage from '../ui/info'
import { getGenetics } from '@/data/genetic'
import AddGeneticBtn from './add-genetic'
import GeneticsTable from './table'


function GeneticsTablePage() {
    const [genetics, setGenetics] = useState<GeneticProps[]>()
    const [search, setSearch] = useState<string>('')

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState<string>('')

    const fetchGenetics = async () => {
        setIsLoading(true)
        let { data, error } = await getGenetics()

        if (data && !error) {
            setGenetics(data)
        }
        setIsLoading(false)
    }

    // search when a parameter chagnes
    useEffect(() => {
        fetchGenetics();
    }, [])


    const filteredGenetics = (!searchTerm || searchTerm == '') ? genetics : genetics?.filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className='card h-min'>
            <div className="header_container">
                <h2 className='text-xl md:text-2xl font-semibold '>Genéticas</h2>

                <div className="flex gap-2 items-center">
                    {isLoading ? <LoadingIcon /> :
                        <p className='text-sm md:text-base font-normaltext-slate-600 dark:text-slate-400'>
                            {genetics?.length} {(genetics?.length ?? 0) != 1 ? 'registros' : 'registro'}
                        </p>
                    }
                </div>
            </div>

            <div className="px-4 mb-2 space-y-2">
                <div className="flex input gap-3 items-center w-full md:max-w-sm px-4">
                    <div className={`${isLoading ? "opacity-50" : ""}`}>
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
                <AddGeneticBtn customText='Nueva' handleRefresh={() => fetchGenetics()} />
            </div>


            {isLoading ? (
                <LoadingTableSkeleton />
            ) : !filteredGenetics?.length ? (
                <div className='p-4'>
                    <InfoMessage
                        type='info'
                        title='Sin resultados'
                        subtitle={`Crea una genética para visualizarla en la tabla.`}
                    />
                </div>
            ) : (
                <GeneticsTable
                    genetics={filteredGenetics ?? []}
                    searchGenetics={() => fetchGenetics()}
                />
            )}

        </div>
    )
}


export default GeneticsTablePage