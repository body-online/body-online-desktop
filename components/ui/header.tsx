import React from 'react'

const PageHeader = ({ children, customHeigth }: { children: React.ReactNode; customHeigth?: string; }) => {
    return (
        <div className="flex items-center bg-gradient-to-b dark:from-cgray/50">
            <div className={`container px-default ${customHeigth ?? 'my-8'}`}>
                <div className="w-full mx-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default PageHeader