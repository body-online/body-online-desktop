'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { MoonIcon, SunIcon } from './icons'

const ThemeSwitch = () => {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => { return setMounted(true) }, [])

    const changeTheme = (type: string) => {
        return setTheme(type)
    }

    if (!mounted) return (<div className='h-10 w-12 px-3 rounded-full animate-pulse bg-white dark:bg-cgray' />)

    return (
        <div className='grid grid-cols-2 gap-1 border rounded-full custom-border flex-center h-10 px-2 bg-white dark:bg-cgray'>
            <button
                onClick={() => changeTheme('dark')}
                className="h-6 md:h-7 w-6 md:w-7 flex-center rounded-full group"
            >
                <div className={resolvedTheme === 'dark' ? '' : 'opacity-30 md:group-hover:opacity-100 transition-all'}>
                    <MoonIcon />
                </div>
            </button>

            <button
                onClick={() => changeTheme('white')}
                className="h-6 md:h-7 w-6 md:w-7 flex-center rounded-full group"
            >
                <div className={resolvedTheme === 'white' ? '' : 'opacity-30 md:group-hover:opacity-100 transition-all'}>
                    <SunIcon />
                </div>
            </button>
        </div >

    )
}

export default ThemeSwitch


