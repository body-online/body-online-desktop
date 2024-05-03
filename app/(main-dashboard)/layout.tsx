
import Header from '@/components/header';
import Navbar from '@/components/ui/navbar';
import { currentUser } from '@/lib/auth';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  return (
    <div className='bg-slate-50 min-h-screen'>
      {/* Direct Access */}
      <Navbar user={user} />
      <div className='-mt-[140px] md:-mt-[190px]'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout