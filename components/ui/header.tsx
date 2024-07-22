import React from 'react'

const PageHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center bg-gradient-to-b dark:from-cgray/50">
            <div className='container px-default my-8'>
                <div className="w-full mx-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default PageHeader