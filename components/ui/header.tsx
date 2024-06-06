import React from 'react'

const PageHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="border-b flex items-center bg-white ">
            <div className='container px-default my-10'>
                <div className="w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default PageHeader