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

function OperatorsTablePage() {
    const [users, setUsers] = useState<ExtendedUser[]>()
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
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
        <div className='card overflow-hidden max-h-max w-full'>
            <div className="header_container">
                <h2 className='font-semibold text-xl'>Usuarios</h2>

                <div className="flex gap-2 items-center">
                    {isLoading ? <LoadingIcon /> :
                        <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                            {totalUsers} {totalUsers > 1 ? 'registros' : 'registro'}
                        </p>
                    }
                </div>
            </div>

            <div className="px-4 mb-2 space-y-2">
                <FilterInput
                    placeholder={'Buscar por nombre...'}
                    onChange={(e) => { setSearchTerm(e); }}
                    disabled={(!search && !users?.length) || (!search && isLoading)}
                // searchTerm={searchTerm ?? ''}
                />

                <AddUserBtn customText='Nuevo' handleRefresh={() => getUsers()} />
            </div>


            {isLoading ? (
                <LoadingTableSkeleton />
            ) : search && !users?.length ? (
                <div className='p-4'>
                    <InfoMessage
                        type='info'
                        title='Sin resultados'
                        subtitle={`No hemos encontrado resultados con "${search}"`}
                    />
                </div>
            ) : (
                <div className="w-full max-h-max">
                    <OperatorsTable
                        users={users ?? []}
                        pageSize={limit}
                    />
                    <div className="p-2">
                        <StatePagination
                            changePage={(newPage) => setPage(newPage)}
                            page={page}
                            totalPages={totalPages}
                            limit={limit}
                            changeLimit={(newLimit) => setLimit(newLimit)}
                        />
                    </div>
                </div>
            )}

        </div>
    )
}


export default OperatorsTablePage