import Navbar from '@/components/ui/navbar';
import { currentUser } from '@/lib/auth';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await currentUser();
    return (
        <main className='min-h-screen'>
            {/* Direct Access */}
            <Navbar user={user} />
            {children}
        </main>
    )
}

export default DashboardLayout