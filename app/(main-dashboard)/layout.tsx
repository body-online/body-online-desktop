import Navbar from '@/components/ui/navbar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-slate-50 min-h-screen'>
      {/* <Navbar /> */}
      <div>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout