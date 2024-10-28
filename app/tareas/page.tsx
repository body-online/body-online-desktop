import TasksDashboard from '@/components/task/dashboard';
import { currentUser } from '@/lib/auth';

async function TasksPage() {
    const user = await currentUser()

    return (
        <div className='py-default px-default'>
            <TasksDashboard user={user} />
        </div>
    );
}

export default TasksPage;