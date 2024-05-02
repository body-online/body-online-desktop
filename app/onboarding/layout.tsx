import Navbar from '@/components/ui/navbar';
import React from 'react'

const LayoutOnboardingPage = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-between'>
            <Navbar />
            {children}
            <div className="h-20 w-full bg-white border-t flex items-center">
                <div className="container">
                    <p className='text-slate-500 text-xs'>BodyOnline todos los derechos reservados</p>
                </div>
            </div>
        </div>
    )

}

export default LayoutOnboardingPage