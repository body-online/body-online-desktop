import BodyOnlineLogo from '@/components/ui/body-online-logo'
import { LoadingIcon } from '@/components/ui/icons'
import React from 'react'

const LoadingDashboard = () => {
    return (
        <div className="h-[60vh] flex-center w-screen">
            <div className="animate-pulse">
                <BodyOnlineLogo />
            </div>
        </div>
    )
}

export default LoadingDashboard