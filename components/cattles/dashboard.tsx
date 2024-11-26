'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getCattles } from '@/data/cattle'
import { CattleProps } from '@/lib/types'

import LoadingTableSkeleton from '../ui/loading-table-skeleton'
import { LoadingIcon, MiniAddIcon } from '../ui/icons'

import StatePagination from '../ui/state-pagination'
import CreateCattleForm from './create-cattle-form'
import FilterInput from '../ui/filter-input'
import InfoMessage from '../ui/info'
import CattlesTable from './table'
import Modal from '../ui/modal'
import CustomLayout from '../custom-layout'

function CattlesDashboard() {
    const router = useRouter()
    const [cattles, setCattles] = useState<CattleProps[]>()
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [search, setSearch] = useState<string>('')
    const [totalCattles, setTotalCattles] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    // new cattle modal
    const [isOpenNewCattleModal, setIsOpenNewCattleModal] = useState<boolean>(false)

    const searchCattles = async () => {
        setIsLoading(true)

        var { data, error } = await getCattles({ page, limit, name: search })

        if (data && !error) {
            setCattles(data.cattles)
            setTotalCattles(data.totalCattles)
            setTotalPages(data.totalPages)

        }
        setIsLoading(false)
    }

    function handleClose() {
        setIsOpenNewCattleModal(false)
        router.refresh()
    }

    // search when a parameter chagnes
    useEffect(() => {
        searchCattles();
    }, [page, search, limit])

    return (
        <CustomLayout>
            <div className="px-default py-default">
                {/* dashboard taks */}
                <div className='card overflow-hidden max-h-max w-full'>

                    <div className="header_container">
                        <h2 className='text-xl md:text-2xl font-semibold'>Individuos</h2>

                        {/* new cattle btn */}
                        <div className="flex gap-2 items-center">

                            {isLoading ? <LoadingIcon /> :
                                <p className='text-sm md:text-base font-normaltext-slate-600 dark:text-slate-400'>
                                    {totalCattles} {totalCattles != 1 ? 'registros' : 'registro'}
                                </p>
                            }

                            <button
                                className="rounded_btn bg-cgreen dark:bg-clime"
                                type='button'
                                onClick={() => setIsOpenNewCattleModal(true)}
                            >
                                <p className='text-white dark:text-cgray'>
                                    Nuevo
                                </p>
                                <MiniAddIcon fill='fill-clime dark:fill-cgray' />
                            </button>
                        </div>
                    </div>

                    <div className="px-4 pb-3">
                        <FilterInput
                            disabled={(!search && !cattles?.length) || (!search && isLoading)}
                            placeholder={'Buscar por caravana...'}
                            onChange={(e: any) => { return setSearch(e); }}
                        />
                    </div>

                    {isLoading ?
                        <LoadingTableSkeleton />
                        : !cattles?.length ? (
                            <div className="p-4">
                                <InfoMessage
                                    type='info'
                                    title='Sin resultados'
                                    subtitle={
                                        search ? `No hemos encontrado resultados con "${search}".` : 'Crea un individuo para visualizarlo en la tabla.'}
                                />
                            </div>
                        ) :
                            <>
                                <CattlesTable
                                    cattles={cattles ?? []}
                                    pageSize={limit}
                                    searchCattles={searchCattles}
                                />
                                <div className="px-2">
                                    <StatePagination
                                        changePage={(newPage) => setPage(newPage)}
                                        page={page}
                                        totalPages={totalPages}
                                        limit={limit}
                                        changeLimit={(newLimit) => setLimit(newLimit)}
                                    />
                                </div>
                            </>
                    }
                </div>

                {/* new task modal */}
                <Modal isOpen={isOpenNewCattleModal} handleClose={handleClose}>
                    <div className='card_modal max-w-lg mx-auto w-full'>
                        <CreateCattleForm handleRefresh={() => { return searchCattles() }} handleClose={handleClose} />
                    </div>
                </Modal >
            </div>
        </CustomLayout>
    )
}


export default CattlesDashboard