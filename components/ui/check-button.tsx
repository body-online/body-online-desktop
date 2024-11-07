import React from 'react'
import { CheckIcon } from './icons'

const CheckButton = ({ value, onClick, selected, disabled, children }: { value: string, label: string, onClick: () => void, selected: boolean, disabled: boolean, children: React.ReactNode }) => {

    return (
        <button
            disabled={disabled}
            value={value}
            type='button'
            onClick={onClick}
            className={`relative flex items-center transition-all px-6 py-3 w-full gap-2
                        md:hover:bg-slate-100 md:dark:hover:bg-clightgray ${disabled ? 'opacity-50' : ''}`}
        >
            <div className='min-h-6 min-w-6 max-h-6 max-w-6'>
                {selected ?
                    <CheckIcon className='fill-cgreen dark:fill-clime h-6 w-6' />
                    :
                    <div className={`h-6 rounded-full bg-white dark:bg-clightgray border-2 border-slate-300 dark:border-cgray/50 overflow-hidden flex items-center justify-start w-6 opacity-100`}>
                    </div>
                }
            </div>

            <div className='flex items-center gap-2 w-full'>
                {children}
            </div>
        </button>
    )
}

export default CheckButton