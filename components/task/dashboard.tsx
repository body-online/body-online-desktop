'use client'

import { useEffect, useState } from 'react'
import LoadingRowsSkeleton from '../ui/loading-rows-skeleton'
import { TaskProps } from '@/lib/types'
import { getTasks } from '@/data/tasks'
import Card from '../ui/card'
import { CloseIcon, FilterIcon, LoadingIcon, MiniAddIcon } from '../ui/icons'
import { ExtendedUser } from '@/next-auth'
import Modal from '../ui/modal'
import UsersList from './users-list'
import TaskTable from './task-table'
import InfoMessage from '../ui/info'
import CreateTaskForm from './create-task-form'
import StatePagination from '../ui/state-pagination'
import FilterInput from '../ui/filter-input'
import CloseBtn from '../ui/close-btn'
import LoadingTableSkeleton from '../ui/loading-table-skeleton'

const TasksDashboard = ({ user }: { user?: ExtendedUser }) => {
    const userType = user?.type ?? 'operator'
    // task filters and status
    const [tasks, setTasks] = useState<TaskProps[]>()
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [totalTasks, setTotalTasks] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [assignedTo, setAssignedTo] = useState<ExtendedUser[]>([])

    // new task modal
    const [isOpenNewTaskModal, setIsOpenNewTaskModal] = useState<boolean>(false)

    // status of assignedTo tasks filter
    const [isOpenUsersList, setIsOpenUsersList] = useState<boolean>(false)
    const [searchUsers, setSearchUsers] = useState<string>('')


    const searchTasks = async () => {
        setIsLoading(true);

        const { data, error } = await getTasks({
            page,
            limit,
            assignedTo: userType == 'operator' ? user?.id : assignedTo?.[0]?.id,
            dueSoon: true,
            completed: userType != 'operator'
            // search
        })

        if (data && !error) {
            setTasks(data.tasks)
            setTotalTasks(data.totalTask)
            setTotalPages(data.totalPages)
        }
        setIsLoading(false);
    }

    // search when a parameter chagnes
    useEffect(() => {
        searchTasks();
        return setIsOpenUsersList(false);
    }, [page, limit, assignedTo])
    // search,

    return (
        <>
            {/* dashboard taks */}
            <div className='card'>
                <div className="header_container">
                    <h2 className='semititle'>Tareas</h2>

                    {/* new task & counter */}
                    <div className="flex gap-2 items-center">
                        {isLoading ? <LoadingIcon /> :
                            <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                                {totalTasks} {totalTasks != 1 ? 'registros' : 'registro'}
                            </p>
                        }
                        {userType == 'owner' &&
                            <button
                                className="rounded_btn bg-cgreen dark:bg-clime"
                                type='button'
                                onClick={() => setIsOpenNewTaskModal(true)}
                            >
                                <p className='text-white dark:text-cgray'>
                                    Nueva
                                </p>
                                <MiniAddIcon fill='fill-clime dark:fill-cgray' />
                            </button>
                        }
                    </div>
                </div>

                <div className="mx-4">

                    {userType === 'owner' && (
                        <div className='rounded-lg bg-slate-100 dark:bg-clightgray max-w-max h-9 px-3 flex-center relative'>
                            <button
                                className='flex-center gap-2 w-max disabled:opacity-50'
                                onClick={() => {
                                    if (!assignedTo?.length) setIsOpenUsersList(true)
                                    else setAssignedTo([])
                                }}
                            >
                                {assignedTo?.length ? (
                                    <>
                                        <CloseIcon
                                            fill='fill-slate-700 dark:fill-slate-300'
                                            sizes='w-4 h-4'
                                        />
                                        <div className="h-4 w-4 absolute -right-1 -top-1 rounded-full flex-center bg-clime">
                                            <p className="text-cgray dark:text-cgray text-xs font-black">
                                                {assignedTo.length ? 1 : 0}
                                            </p>
                                        </div>
                                    </>
                                ) : null}

                                <>
                                    <FilterIcon fill='fill-slate-700 dark:fill-slate-300'
                                        sizes='w-4 h-4'
                                    />
                                    <p className='font-medium text-slate-700 dark:text-slate-300 text-sm'>
                                        Usuarios
                                    </p>
                                </>
                            </button>

                            {isOpenUsersList ?
                                <div
                                    className="z-20 card border custom-border shadow-md absolute top-0 -left-3 flex flex-col w-[350px] md:w-[450px]">
                                    <div className="p-4">
                                        <div className="flex-between">
                                            <p className='font-medium text-slate-700 dark:text-slate-300 text-sm'>
                                                Filtrar por responsable
                                            </p>
                                            <CloseBtn handleClose={() => setIsOpenUsersList(false)} />
                                        </div>

                                        <FilterInput
                                            placeholder={'Buscar por nombre...'}
                                            disabled={isLoading}
                                            onChange={(e: any) => {
                                                setSearchUsers(e);
                                            }}
                                        />
                                    </div>

                                    {/* list of users availables */}
                                    <div className="flex flex-col max-h-96 w-full">
                                        <UsersList
                                            selectedUsers={assignedTo ?? []}
                                            setSelectedUsers={setAssignedTo}
                                            search={searchUsers}
                                            disabled={false}
                                        />
                                    </div>
                                </div>
                                : null
                            }
                        </div>
                    )}
                </div>


                {isLoading ?
                    <LoadingTableSkeleton />
                    : !tasks?.length ? (
                        <div className="p-4">
                            <InfoMessage
                                type='info'
                                title='Sin resultados'
                                subtitle={`No encontramos tareas registradas por el momento.`}
                            />
                        </div>
                    ) :
                        <>
                            <div className="w-full overflow-auto">
                                <TaskTable
                                    tasks={tasks}
                                    page={page}
                                    limit={limit}
                                />
                            </div>
                            <div className="px-2 flex-end">
                                <StatePagination
                                    limit={limit}
                                    changeLimit={(newLimit) => setLimit(newLimit)}
                                    changePage={(newPage) => setPage(newPage)}
                                    totalPages={totalPages ?? 1}
                                    page={page ?? 1}
                                />
                            </div>
                        </>
                }
            </div>

            {/* new task modal */}
            <Modal isOpen={isOpenNewTaskModal} handleClose={() => setIsOpenNewTaskModal(false)}>
                <div className='card_modal'>
                    <div className="header_container">
                        <h2 className="semititle">
                            Crear tarea
                        </h2>

                        <CloseBtn handleClose={() => setIsOpenNewTaskModal(false)} />
                    </div>

                    <CreateTaskForm handleRefresh={() => { return searchTasks() }} />
                </div>
            </Modal >
        </ >
    )
}

export default TasksDashboard