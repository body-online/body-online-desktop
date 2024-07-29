import { LoadingIcon } from '@/components/ui/icons'
import React from 'react'

const LoadingDashboard = () => {
    return (
        <div className='h-full min-h-[50vh] flex-center'>
            <LoadingIcon fill='fill-cblack dark:fill-white scale-2 animate-pulse' />
        </div>
    )
}

export default LoadingDashboard