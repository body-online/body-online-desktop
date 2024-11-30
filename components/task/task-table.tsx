'use client';

import { TaskProps } from '@/lib/types'
import { useState } from 'react'
import CaravansResume from './caravans-resume';
import { CalendarIcon } from '../ui/icons';
import UsersResume from './users-resume';
import UpdateTaskButton from './update-task-button';

const TaskTable = ({ tasks, page, limit }: { page: number, limit: number, tasks: TaskProps[] }) => {
    // const [selectedTask, setTasks] = useState<TaskProps[]>(tasks)

    return (
        <table>
            <thead className='sticky top-0'>
                <tr>
                    <th>
                        Acciones
                    </th>
                    <th>
                        Vencimiento
                    </th>
                    <th>
                        Pendientes
                    </th>
                    <th>
                        Responsable/s
                    </th>
                    <th>
                        Completitud
                    </th>
                </tr>
            </thead>

            <tbody>
                {tasks.map((task, index) => <TaskRow task={task} key={index} />)}
            </tbody>
        </table>
    )
}

export default TaskTable

const TaskRow = ({ task }: { task: TaskProps }) => {
    const [taskRow, setTaskRow] = useState<TaskProps>(task)
    const expirationDate = new Date(taskRow.expirationDate)
    const measuredCount: number = Number(taskRow?.measuredCattles?.length) ?? 0
    const measuresCount: number = Number(taskRow?.caravan?.length) ?? 0
    const totalMeasures: number = Number(measuredCount + measuresCount)

    return (
        <tr>
            <td>
                <UpdateTaskButton
                    defaultValues={{
                        eventType: 'body_measure',
                        taskId: task._id
                    }}
                    task={taskRow}
                    setTask={setTaskRow}
                />
            </td>

            <td>
                <div className="flex items-center gap-1">
                    <CalendarIcon fill='fill-slate-500 dark:fill-slate-400' />
                    <p className='text-start font-medium text-base'>{expirationDate.toLocaleDateString()}</p>
                </div>
            </td>
            <td>
                <CaravansResume cattles={taskRow?.cattleIds} truncateAt={3} />
            </td>
            <td>
                <UsersResume assignedTo={taskRow.assignedTo} />
            </td>
            <td>
                <div className="flex gap-2">
                    <p className='font-semibold text-base'>
                        {Math.round((measuredCount / totalMeasures) * 100)}%
                    </p>
                </div>
            </td>
        </tr>
    )
}