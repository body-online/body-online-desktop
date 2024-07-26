import React from 'react'

const StepIndicator = ({ active, label, value }: {
    active: boolean;
    label: string;
    value?: string;
}) => {
    return (
        <div className='h-14 px-4'>
            <p className={`text-xs transition-all ${active ? 'text-cblack dark:text-clime' : 'opacity-50'}`}>
                {label}
            </p>
            <p className={`pl-3 transition-all ${value ? 'text-cblack dark:text-white' : ''}`}>
                {value}
            </p>
        </div>

        // <div className={`border-t  w-full max-w-full min-w-max p-1.5 ${active ? 'border-caqua dark:border-clime' : 'opacity-50 saturate-0'}`}>
        //     <p className={`${active ? 'text-caqua dark:text-clime' : 'text-cblack dark:text-white'}`}>
        //         {label}
        //     </p>
        // </div>
    )
}

export default StepIndicator