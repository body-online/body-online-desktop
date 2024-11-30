import React from 'react'

const HorizontalSelector = ({ options, selected, onChange }: { options: { label: string, value: string }[], selected: string, onChange: (value: string) => void }) => {
    return (
        <div className='flex overflow-x-auto p-1 md:p-2 bg-slate-100 dark:bg-clightgray rounded-full'>
            {options.map((option, index) => (

                <button
                    key={index}
                    type='button'
                    className={`rounded-full h-8 px-4 cursor-pointer disabled:opacity-50 transition-all ${selected === option.value ? `bg-cgreen dark:bg-clime` : `md:hover:bg-opacity-60 enabled:active:bg-opacity-60`}`}
                    onClick={() => onChange(option.value)}
                >
                    <p className={`text-sm font-medium ${selected === option.value ? `text-white dark:text-cblack` : `text-clightgray dark:text-slate-500`}`}>
                        {option.label}
                    </p>
                </button>
            ))}

        </div>
    )
}

export default HorizontalSelector