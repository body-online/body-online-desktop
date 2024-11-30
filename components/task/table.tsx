'use client'

import { useEffect, useState } from 'react'
import { TaskProps } from '@/lib/types'
import { getTasks } from '@/data/tasks'
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
import UsersResume from './users-resume'
import { useSession } from 'next-auth/react'
import Resume from '../ui/resume'
import { ProfileImage } from '../ui/navbar'

const TasksTable = () => {
    const { data: session } = useSession();

    // task filters and status
    const [tasks, setTasks] = useState<TaskProps[]>()
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(50)
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

        if (!session?.user?.id || !session) return null

        let userType = session.user.type ?? 'operator'

        const { data, error } = await getTasks({
            page,
            limit,
            assignedTo:
                userType == 'operator' ? [session.user.id] :
                    !assignedTo.length ?
                        [session.user.id] :
                        assignedTo?.map((i) => i.id),
            completed: userType != 'operator'
        })


        if (data && !error) {
            const { tasks, totalTask, totalPages } = data;

            // save in state (online mode)
            setTasks(tasks)
            setTotalTasks(totalTask)
            setTotalPages(totalPages)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        searchTasks();
    }, [page, limit, assignedTo])


    return (
        <div className='px-default py-default'>
            <div className='card'>
                <div className="header_container">
                    <h2 className='text-xl md:text-2xl font-semibold '>Tareas</h2>

                    {/* new task & counter */}
                    <div className="flex w-max gap-x-2 gap-y-1 items-center flex-wrap-reverse justify-end">
                        {isLoading ? <LoadingIcon /> :
                            <p className='text-sm md:text-base font-normal text-slate-600 dark:text-slate-400'>
                                {totalTasks} {totalTasks != 1 ? 'registros' : 'registro'}
                            </p>
                        }
                        {session?.user.type == 'owner' &&
                            <button
                                type='button'
                                className="rounded_btn bg-cgreen dark:bg-clime"
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

                {/* filters */}
                <div className="px-4 my-2 relative">
                    {session?.user?.type === 'owner' && (
                        <div className='relative rounded_btn bg-slate-100 dark:bg-clightgray max-w-max'>
                            <button
                                className='flex-center gap-2'
                                onClick={() => setIsOpenUsersList(true)}
                            >
                                <FilterIcon fill={`${assignedTo.length ? 'fill-cgreen dark:fill-clime' : 'fill-slate-700 dark:fill-slate-300'}`}
                                    sizes='w-4 h-4'
                                />
                                <p className='font-medium text-slate-700 dark:text-slate-300 text-sm'>Responsables</p>
                                {assignedTo?.length >= 1 &&
                                    <div className="absolute -right-1 -top-1">
                                        <div className="rounded-full bg-cgreen dark:bg-clime w-5 h-5 flex-center">
                                            <p className='font-bold text-clime dark:text-cblack'>{assignedTo.length}</p>
                                        </div>
                                    </div>
                                }
                            </button>


                            {assignedTo?.length ? (
                                <button onClick={() => setAssignedTo([])}>
                                    <CloseIcon
                                        fill='fill-slate-700 dark:fill-slate-300 hover:opacity-70'
                                        sizes='w-4 h-4'
                                    />
                                </button>
                            ) : null}

                            {/* dropdown */}
                            {isOpenUsersList ?
                                <div
                                    className="z-20 card border custom-border shadow-md absolute top-0 left-0 flex flex-col w-[90vw] md:w-[450px]">
                                    <div className="header_container">
                                        <p className="font-medium">
                                            Filtrar responsables
                                        </p>
                                        <CloseBtn handleClose={() => setIsOpenUsersList(false)} />
                                    </div>

                                    <Resume
                                        handleClean={() => setAssignedTo([])}
                                        disabled={!assignedTo?.length || isLoading}
                                        amount={assignedTo?.length}
                                    >
                                        {assignedTo.length ? assignedTo?.toReversed().map((user, userIndex) => (
                                            <div
                                                key={`cattle-${userIndex}`}
                                                className='resume_chip min-w-max'
                                            >
                                                <ProfileImage user={user} height='h-6' width='w-6' />
                                                <p>
                                                    {user.name}
                                                </p>
                                                <button
                                                    type='button'
                                                    disabled={isLoading}
                                                    onClick={() => setAssignedTo(assignedTo.filter(i => i.id != user.id))}
                                                >
                                                    <CloseIcon
                                                        sizes='h-4 w-4'
                                                        fill='fill-slate-500 dark:fill-slate-400 hover:fill-slate-600 dark:hover:fill-slate-300'
                                                    />
                                                </button>
                                            </div>
                                        )) : (
                                            <p className='my-auto  opacity-50'>Sin selecciones</p>
                                        )}
                                    </Resume>
                                    {/* list of users availables */}
                                    <div className="px-4 my-2">
                                        <FilterInput
                                            placeholder={'Buscar por nombre...'}
                                            disabled={isLoading}
                                            onChange={(e: any) => {
                                                setSearchUsers(e);
                                            }}
                                        />
                                    </div>



                                    <div className="flex flex-col max-h-[46vh] md:max-h-[50vh] w-full">
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
                    ) : (
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
                    )
                }
            </div>

            {/* new task modal */}
            <Modal isOpen={isOpenNewTaskModal} handleClose={() => setIsOpenNewTaskModal(false)}>
                <div className='card_modal'>
                    <CreateTaskForm
                        handleRefresh={() => searchTasks()}
                        handleClose={() => setIsOpenNewTaskModal(false)}
                    />
                </div>
            </Modal >
        </div>
    )
}

export default TasksTable