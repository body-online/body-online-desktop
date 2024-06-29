'use client'

import { useTheme } from 'next-themes'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { enterDropdown } from '@/lib/constants'
import { MoonIcon, PCIcon, SunIcon } from './icons'

const ThemeSwitch = () => {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => { return setMounted(true) }, [])

    const changeTheme = (type: string) => {
        return setTheme(type)
    }

    if (!mounted) return (<div className='h-8 w-8 rounded-full animate-pulse bg-slate-200 dark:bg-slate-700' />)

    return (
        <div className='grid grid-cols-3 gap-1 border rounded-full custom-border p-1'>
            <button
                onClick={() => changeTheme('system')}
                className="h-6 md:h-7 w-6 md:w-7 flex-center rounded-full"
            >
                <div className={resolvedTheme == 'system' ? '' : 'opacity-50 md:group-hover:opacity-100 transition-all'}>
                    <PCIcon />
                </div>
            </button>

            <button
                onClick={() => changeTheme('dark')}
                className="h-6 md:h-7 w-6 md:w-7 flex-center rounded-full"
            >
                <div className={resolvedTheme === 'dark' ? '' : 'opacity-50 md:group-hover:opacity-100 transition-all'}>
                    <MoonIcon />
                </div>
            </button>

            <button
                onClick={() => changeTheme('white')}
                className="h-6 md:h-7 w-6 md:w-7 flex-center rounded-full"
            >
                <div className={resolvedTheme === 'white' ? '' : 'opacity-50 md:group-hover:opacity-100 transition-all'}>
                    <SunIcon />
                </div>
            </button>
        </div >

    )
}

export default ThemeSwitch


