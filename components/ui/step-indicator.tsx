import React from 'react'

const StepIndicator = ({ active, label, value, step }: {
    active: boolean;
    label: string;
    value?: string;
    step?: string;
}) => {
    return (
        <div className='flex items-center min-w-40 px-4 md:px-5 md:py-1 gap-2 snap-center'>
            <div
                className={`h-6 w-6 flex-center rounded-full
                 ${value ? 'bg-green-500 dark:bg-green-500' : 'bg-slate-100 dark:bg-clightgray'}`}
            >
                <h1 className={`text-sm font-medium${value ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                    {!value ? (
                        <p className={active ? 'text-caqua dark:text-clime' : ''}>
                            {step}
                        </p>
                    ) : (
                        <CheckIcon fill={' fill-white dark:fill-white'} />
                    )}
                </h1>
            </div>
            <div>
                <div className='h-4 mt-1'>
                    <p className={`text-xs font-medium transition-all ${active ? 'text-cblack dark:text-white' : 'opacity-40'}`}>
                        {label}
                    </p>
                </div>
                <div className='h-8'>
                    <p className={`text-base font-medium transition-all ${value ? 'text-cblack dark:text-white' : ''}`}>
                        {value ?? '-'}
                    </p>
                </div>
            </div>
        </div>

        // <div className={`border-t  w-full max-w-full min-w-max p-1.5 ${active ? 'border-caqua dark:border-clime' : 'opacity-50 saturate-0'}`}>
        //     <p className={`${active ? 'text-caqua dark:text-clime' : 'text-cblack dark:text-white'}`}>
        //         {label}
        //     </p>
        // </div>
    )
}

export default StepIndicator

const CheckIcon = ({ fill }: { fill?: string }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={`${fill ?? 'fill-black'} h-4 w-4`}>
            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
        </svg>

    )
}