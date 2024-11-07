import TasksDashboard from '@/components/task/dashboard';
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function TasksPage() {
    const user = await currentUser()

    if (!user?.farmId) return redirect('/')

    return (
        <div className='py-default px-default'>
            <TasksDashboard user={user} />
        </div>
    );
}

export default TasksPage;