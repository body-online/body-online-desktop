import TaskTable from '@/components/task/table';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';

async function TasksPage() {
    const user = await currentUser()
    if (!user?.farmId) return redirect('/')

    return <TaskTable />
}

export default TasksPage;