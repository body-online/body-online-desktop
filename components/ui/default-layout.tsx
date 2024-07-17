import React from 'react'
import ThemeSwitch from './theme-switch'
import LogoutButton from '../auth/logout-button'

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='w-screen h-screen relative overflow-y-auto flex flex-col'>
            <div className='w-full sticky top-0 py-3 backdrop-blur-lg'>
                <div className="flex-between w-full gap-2 px-default">
                    <h1 className='text-lg md:text-xl font-semibold dark:text-white'>
                        Body
                        <span className='font-bold text-cgreen dark:text-clime'>
                            Online</span></h1>
                    <div className="flex-center gap-2">
                        <ThemeSwitch />
                        <LogoutButton />
                    </div>
                </div>
            </div>

            {children}
        </div>
    )
}

export default DefaultLayout