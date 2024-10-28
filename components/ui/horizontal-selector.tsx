import React from 'react'

const HorizontalSelector = ({ options, selected, onChange }: { options: { label: string, value: string }[], selected: string, onChange: (value: string) => void }) => {
    return (
        <div className='flex overflow-x-auto p-2 rounded-lg bg-white border custom-border dark:bg-clightgray'>
            {options.map((option, index) => (

                <button
                    key={index}
                    type='button'
                    className={`rounded-md h-9 px-4 cursor-pointer disabled:opacity-50 transition-all ${selected === option.value ? `bg-cgray dark:bg-white` : `md:hover:bg-opacity-60 enabled:active:bg-opacity-60`}`}
                    onClick={() => onChange(option.value)}
                >
                    <p className={`text-sm font-semibold ${selected === option.value ? `text-white dark:text-cgray` : `text-cgray dark:text-white`}`}>
                        {option.label}
                    </p>
                </button>
            ))}

        </div>
    )
}

export default HorizontalSelector