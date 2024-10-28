import React from 'react'

const StepsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="sticky top-0 z-50 w-full custom-gradient border-b custom-border">
            <div className="overflow-auto max-w-3xl mx-auto border-x custom-border">
                <div className="flex divide-x divide-slate-200 dark:divide-clightgray items-center w-max h-max">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default StepsContainer