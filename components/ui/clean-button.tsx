import React from 'react'
import { TrashIcon } from './icons'

const CleanButton = ({ onClick, disabled, amount }: { onClick: () => void, disabled: boolean, amount: number }) => {
    return (
        <button
            type='button'
            disabled={disabled}
            onClick={onClick}
            className='flex items-center gap-1 px-3 enabled:active:scale-95 transition-all duration-150 rounded-full bg-csemigreen dark:bg-clime min-w-max h-9 disabled:opacity-50'
        >
            <TrashIcon sizes='h-4 w-4' fill='fill-clime dark:fill-cblack' />
            <p className='text-sm font-medium text-slate-200 dark:text-cblack'>
                {amount}
            </p>
        </button>
    )
}

export default CleanButton