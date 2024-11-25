import TasksDashboard from '@/components/task/dashboard';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';

async function TasksPage() {
    const user = await currentUser()
    if (!user?.farmId) return redirect('/')

    return <TasksDashboard />
}

export default TasksPage;