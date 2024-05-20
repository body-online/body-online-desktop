import React from 'react'

const LoadingDashboard = () => {
    return (
        <div className='container pb-12 px-default space-y-8 relative mt-4'>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="h-96 w-full rounded-xl bg-white overflow-hidden">
                    <div className="bg-slate-100 animate-pulse  h-full w-full"></div>
                </div>
                <div className="h-96 w-full rounded-xl bg-white overflow-hidden">
                    <div className="bg-slate-100 animate-pulse  h-full w-full"></div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="h-96 w-full rounded-xl bg-white overflow-hidden">
                    <div className="bg-slate-100 animate-pulse  h-full w-full"></div>
                </div>
                <div className="h-96 w-full rounded-xl bg-white overflow-hidden">
                    <div className="bg-slate-100 animate-pulse  h-full w-full"></div>
                </div>
            </div>

        </div>
    )
}

export default LoadingDashboard