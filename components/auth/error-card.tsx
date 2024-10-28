'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import Card from '../ui/card'

const ErrorCard = () => {
    const router = useRouter();

    return (
        <Card>
            <div className="flex items-center justify-center mb-4">
                <ErrorIcon />
            </div>
            <h2 className="semititle">Ha ocurrido un error</h2>
            <div className="flex justify-center py-2">
                <button
                    type='button'
                    className='max-w-max group'
                    onClick={() => router.replace('/auth/login')}
                >
                    <p className="text-center group-hover:underline underline-offset-2">Volver a intentar</p>
                </button>
            </div>
        </Card>
    )
}

export default ErrorCard

const ErrorIcon = () => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="w-9 h-9 stroke-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>
    )
}
