'use client'

import InfoMessage from '@/components/ui/info'
import { useRouter } from 'next/navigation'
import React from 'react'

const AuthErrorPage = () => {
    const router = useRouter();

    return (
        <div className='card p-4'>
            <InfoMessage type='warning' title='Ha ocurrido un error al iniciar' />
            <button
                type='button'
                className='max-w-max group'
                onClick={() => router.push('/auth/login')}
            >
                <p className="text-center group-hover:underline underline-offset-2">Volver a intentar</p>
            </button>
        </div>
    )
}

export default AuthErrorPage