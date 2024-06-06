import Navbar from '@/components/ui/navbar'
import { currentUser } from '@/lib/auth'


const MainLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await currentUser();

    return (
        <main className='min-h-screen flex flex-col'>
            <Navbar user={user} />
            {children}
        </main>
    )
}

export default MainLayout