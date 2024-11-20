import AddEventBtn from '@/components/cattles/add-event';
import TasksDashboard from '@/components/task/dashboard';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';

async function TasksPage() {
    const user = await currentUser()
    if (!user?.farmId) return redirect('/')

    return (
        <div className='py-default px-default'>
            {user.type === 'operator' && <AddEventBtn />}
            <TasksDashboard />
        </div>
    );
}

export default TasksPage;