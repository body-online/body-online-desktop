'use client'

import { useEffect, useState } from 'react'
import { ExtendedUser } from '@/next-auth'

import { getOperators } from '@/data/operators'

import LoadingRowsSkeleton from '../ui/loading-rows-skeleton'
import StatePagination from '../ui/state-pagination'
import CheckButton from '../ui/check-button'
import { ProfileImage } from '../ui/navbar'
import InfoMessage from '../ui/info'

const UsersList = ({
    selectedUsers, setSelectedUsers, search, disabled, onlyOne,
}: {
    selectedUsers: ExtendedUser[],
    setSelectedUsers: React.Dispatch<React.SetStateAction<ExtendedUser[]>>,
    search?: string,
    disabled: boolean,
    onlyOne?: boolean,

}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [usersList, setUsersList] = useState<ExtendedUser[]>([])
    // filters states
    const [page, setPage] = useState<number>(1)
    const [limit, setUsersLimit] = useState<number>(10)
    const [totalPages, setTotalPages] = useState<number>(1)



    const handleSelectUser = (user: ExtendedUser) => {
        if (disabled) return
        if (!selectedUsers || onlyOne) {
            setSelectedUsers([user])
        } else if (selectedUsers.find(i => i.id === user.id)) {
            setSelectedUsers(selectedUsers?.filter(i => i.id !== user.id) ?? [])
        } else {
            setSelectedUsers([...selectedUsers, user])
        }
    }

    useEffect(() => {
        const handleGetUsers = async () => {
            setIsLoading(true);
            const { data, error } = await getOperators({ page, limit, search: { name: search } })

            if (data) {
                setUsersList(data.users)
                setTotalPages(data.totalPages ?? 1)
            }
            if (error) setError(error)
            return setIsLoading(false)
        }

        handleGetUsers()
    }, [page, limit, search])


    return (
        <div className='flex flex-col overflow-hidden h-full'>
            {error ? (
                <div className="p-4">
                    <InfoMessage
                        type='warning'
                        title={`Error al cargar los usuarios`}
                        subtitle={error ??
                            'Ha ocurrido un error al cargar los usuarios.'
                        }
                    />
                </div>
            ) : isLoading ? (
                <LoadingRowsSkeleton />
            ) : !usersList.length ? (
                <div className="p-4">
                    <InfoMessage
                        type='info'
                        title="Sin resultados"
                        subtitle={
                            (search && search?.length > 0) ? `No se encontraron usuarios llamados "${search}"` : 'No se encontraron operarios'
                        }
                    />
                </div>
            ) : (
                <>
                    <div className="custom_list">
                        {usersList.map((user, index) => {
                            const selected = Boolean(selectedUsers?.find(i => i.id === user.id));

                            return (
                                <CheckButton
                                    key={index}
                                    value={user.email as string}
                                    label={user.name}
                                    onClick={() => handleSelectUser(user)}
                                    selected={selected}
                                    disabled={disabled}
                                >
                                    <div className="w-full flex items-center gap-3">
                                        <ProfileImage user={user} width='min-w-9 max-w-9 w-9' height='min-h-9 max-h-9 h-9' />
                                        <div className='text-start truncate'>
                                            <p className={`font-medium text-base text-gray-600 dark:text-gray-300 ${selected ? 'text-opacity-100' : 'dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100'}`}>
                                                {user.name}
                                            </p>
                                            <p className={`font-normal text-sm text-gray-600 dark:text-gray-300 dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100`}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </CheckButton>
                            )
                        })}

                    </div>

                    <div className="px-2">
                        <StatePagination
                            page={page}
                            limit={limit}
                            changePage={(newPage: number) => setPage(newPage)}
                            totalPages={totalPages}
                            changeLimit={setUsersLimit}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default UsersList