import React from 'react'

const StepIndicator = ({ active, label, step }: {
    active: boolean;
    label: string;
    step: string;
}) => {
    return (
        <div className={`border-t p-1.5 ${active ? 'border-caqua dark:border-clime' : 'opacity-50 saturate-0'}`}>
            <p className={`${active ? 'text-caqua dark:text-clime' : 'text-cblack dark:text-white'}`}>
                {step}. {label}
            </p>
        </div>
    )
}

export default StepIndicator