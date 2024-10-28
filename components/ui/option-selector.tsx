'use client'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { CheckmarkIcon } from 'react-hot-toast';
import { CheckIcon } from './icons';

const container = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0,
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1
    }
};


const OptionSelector = (
    { options, value, setValue, hasOther, customOtherLabel, customOtherPlaceholder, error }:
        { options: Array<{ label: string, value?: string; disabled?: boolean; }>; value?: string; setValue: Function; hasOther?: boolean; customOtherLabel?: string; customOtherPlaceholder?: string; error?: string }
) => {
    const [isOther, setIsOther] = useState<boolean>(false);

    useEffect(() => {
        const optionsKeys = options.map((opt) => opt.value)
        if (optionsKeys.includes(value)) {
            return setIsOther(false)
        } else if (value != undefined) {
            return setIsOther(true)
        }
    }, [])

    return (
        <motion.ul
            className='w-full space-y-3 transition-all'
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {options.map((option, index) => {
                const selected = option.value == value;

                return (
                    <motion.li
                        variants={item}
                        key={index}
                    >
                        <button
                            type='button'
                            onClick={() => { setIsOther(false); setValue(option.value) }}
                            disabled={option?.disabled}
                            className="option_button"
                        >
                            <div className="min-h-5 min-w-5 bg-slate-100 dark:bg-slate-600 rounded-full">
                                {selected ? <CheckIcon /> : ''}
                            </div>

                            <p className='text-start leading-6 text-truncate text-base text-slate-800 dark:text-slate-300 font-medium'>
                                {option.label}
                            </p>
                        </button>
                    </motion.li>
                )
            })}

            {hasOther ?
                <motion.div
                    className='space-y-2'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: (options?.length ?? 1) * 0.02 } }}
                >
                    <motion.button
                        type='button'
                        onClick={() => { setIsOther(true); setValue('') }}
                        className={`option_button ${isOther ? 'custom-gradient border custom-border' : ''}`}
                    >
                        <div className="h-5 w-5 bg-slate-300 dark:bg-slate-600 rounded-full">
                            {isOther ? <CheckIcon /> : ''}
                        </div>

                        <p className='text-start leading-6 text-truncate text-base text-slate-800 dark:text-slate-300 font-medium'>
                            {customOtherLabel ?? 'Otro'}
                        </p>
                    </motion.button>

                    {isOther ?
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='flex'
                        >
                            <div className="w-12 h-11 grid grid-cols-2 grid-rows-2 opacity-50">
                                <div />
                                <div className='h-full w-full border-b border-l rounded-bl-lg -mt-1.5 border-slate-400 dark:border-slate-600 step-indicator' />
                            </div>
                            <input
                                type="text"
                                placeholder={customOtherPlaceholder}
                                className={`input ${error ? 'border-red-500 dark:border-red-400' : ''}`}
                                onChange={({ target }) => setValue(target?.value)}
                                value={value ?? ''}
                            />
                        </motion.div>
                        : null
                    }
                </motion.div >
                : null
            }
        </motion.ul >
    )
}

export default OptionSelector