'use client'

import { useEffect, useState } from 'react'
import { ExtendedUser } from '@/next-auth'

import { getOperators } from '@/data/operators'

import LoadingTableSkeleton from '../ui/loading-table-skeleton'
import StatePagination from '../ui/state-pagination'
import FilterInput from '../ui/filter-input'
import { LoadingIcon } from '../ui/icons'
import OperatorsTable from './table'
import InfoMessage from '../ui/info'
import AddUserBtn from './add-user-btn'

function Operators() {
    const [users, setUsers] = useState<ExtendedUser[]>()
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(20)
    const [search, setSearch] = useState<string>('')
    const [totalUsers, setTotalUsers] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState<string>('')

    const getUsers = async () => {
        setIsLoading(true)
        let { data, error } = await getOperators({ page, limit, search: { name: search } })

        if (data && !error) {
            setUsers(data.users)
            setTotalUsers(data.totalUsers)
            setTotalPages(data.totalPages)
        }
        setIsLoading(false)
    }

    // search when a parameter chagnes
    useEffect(() => {
        getUsers();
    }, [page, search, limit])

    // debounce method to search
    useEffect(() => {
        const delayInputTimeoutId =
            setTimeout(() => {
                setSearch(searchTerm);
            }, 300);
        return () => clearTimeout(delayInputTimeoutId);
    }, [searchTerm]);

    return (
        <div className='card max-h-max'>
            <div className="header_container">
                <h2 className='text-xl md:text-2xl font-semibold'>Usuarios</h2>


                <div className="flex w-max gap-x-2 gap-y-1 items-center flex-wrap-reverse justify-end">
                    {isLoading ? <LoadingIcon /> :
                        <p className='text-sm md:text-base font-normal text-slate-600 dark:text-slate-400'>
                            {totalUsers} {totalUsers > 1 ? 'registros' : 'registro'}
                        </p>
                    }
                    <AddUserBtn customText='Nuevo' handleRefresh={() => getUsers()} />
                </div>
            </div>

            <div className="px-4 my-2">
                <FilterInput
                    placeholder={'Buscar por nombre...'}
                    onChange={(e) => { setSearchTerm(e); }}
                    disabled={(!search && !users?.length) || (!search && isLoading)}
                // searchTerm={searchTerm ?? ''}
                />
            </div>

            {isLoading ? (
                <LoadingTableSkeleton />
            ) : totalPages >= 1 && !users?.length ? (
                <div className='p-4'>
                    <InfoMessage
                        type='info'
                        title='Sin resultados'
                        subtitle={`No hemos encontrado resultados con "${search}"`}
                    />
                </div>
            ) : (
                <OperatorsTable
                    users={users ?? []}
                    pageSize={limit}
                />
            )}

            <div className="buttons_container">
                <StatePagination
                    disabled={isLoading || totalPages >= 1 && !users?.length}
                    changePage={setPage}
                    page={page}
                    totalPages={totalPages ?? 1}
                    changeLimit={setLimit}
                    limit={limit}
                />
            </div>
        </div>
    )
}


export default Operators