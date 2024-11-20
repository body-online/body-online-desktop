'use client'

import { getTasks } from '@/data/tasks';
import { TaskProps } from '@/lib/types';
import { db } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const useLoadTasksOnline = () => {
    const { data: session } = useSession();
    const [savedTasks, setSavedTasks] = useState<TaskProps[]>([]); // Por defecto, asumimos que está online

    const loadOfflineTasks = async () => {
        if (!session?.user.id) return null

        const { data, error } = await getTasks({
            page: 1,
            limit: 50,
            assignedTo: [session.user.id],
            completed: false
        })

        const pendingTasks: TaskProps[] = data?.tasks ?? [];
        setSavedTasks(pendingTasks)
        console.log(pendingTasks)
        await db.tasks.clear()
        await db.tasks.bulkAdd(pendingTasks)

    }

    useEffect(() => {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            // Código ejecutado solo en el cliente
            loadOfflineTasks()
        }
    }, []);

    return savedTasks;
};

export default useLoadTasksOnline;
