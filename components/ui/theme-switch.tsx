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

    if (!mounted) return (null)

    return (
        <div className='action_button'>
            {resolvedTheme === 'light' ? (
                <button
                    onClick={() => changeTheme('dark')}
                    className="h-6 md:h-7 w-6 md:w-7 flex-center rounded-full group"
                >
                    <MoonIcon />
                </button>
            ) : (
                <button
                    onClick={() => changeTheme('light')}
                    className="h-6 md:h-7 w-6 md:w-7 flex-center rounded-full group"
                >
                    <SunIcon />
                </button>
            )}

        </div >

    )
}

export default ThemeSwitch


