import React from 'react'
import { CheckIcon } from './icons'

const CheckButton = ({ value, onClick, selected, disabled, children }: { value: string, label: string, onClick: () => void, selected: boolean, disabled: boolean, children: React.ReactNode }) => {

    return (
        <button
            disabled={disabled}
            value={value}
            type='button'
            onClick={onClick}
            className={`relative flex items-center transition-all px-6 py-4 w-full
                        md:hover:bg-slate-100 md:dark:hover:bg-clightgray ${disabled ? 'opacity-50' : ''}`}
        >
            <div className={`h-5 overflow-hidden flex items-center justify-start w-5 mr-2 opacity-100`}>
                <div className='min-w-max min-h-max'>
                    {selected &&
                        <CheckIcon fill='fill-cgreen dark:fill-clime' />
                    }
                </div>
            </div>

            <div className='flex items-center gap-2 w-full'>
                {children}
            </div>
        </button>
    )
}

export default CheckButton