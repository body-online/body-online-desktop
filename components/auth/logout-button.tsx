'use client'

import logout from '@/actions/logout'
import React from 'react'
import toast from 'react-hot-toast'
import { LogoutIcon } from '../ui/icons'
import { useSession } from 'next-auth/react'

const LogoutButton = () => {
    const { data: session, status } = useSession()

    const logOut = async () => {
        try {
            logout()
        } catch (error) {
            toast.error('Error al desloguearse')
        }
    }

    if (status == 'loading') return <div className='h-8 w-16 rounded-full animate-pulse bg-white dark:bg-cgray' />

    if (status != 'authenticated') return null;
    return (
        <form className="flex justify-center py-2 group" action={logOut}>
            <button type='submit' className='flex-center gap-2 border rounded-full custom-border w-max bg-white dark:bg-cgray h-10 px-3'>
                <p className='text-sm text-start font-medium transition-all'>Cerrar sesión</p>
                <LogoutIcon fill='fill-slate-600 dark:fill-slate-400 md:group-hover:fill-black dark:md:group-hover:fill-white' />
            </button>
        </form>
    )
}

export default LogoutButton