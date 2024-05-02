'use client'

import logout from '@/actions/logout'
import React from 'react'
import toast from 'react-hot-toast'

const LogoutButton = () => {
    const logOut = async () => {
        try {
            logout()
        } catch (error) {
            toast.error('Error al desloguearse')
        }
    }
    return (
        <div>
            <form className='w-min h-min' action={logOut}>
                <button type='submit' className='px-3 py-2 rounded-full w-max bg-black hover:bg-slate-800 transition-all'>
                    <p className="text-sm text-white font-medium">
                        Cerrar sesión
                    </p>
                </button>
            </form></div>
    )
}

export default LogoutButton