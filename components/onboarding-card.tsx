'use client'

import Link from 'next/link'
import React from 'react'

const OnboardingCard = () => {
    return (
        <div className='gradient_card'>
            <h2 className='text-lg font-medium mb-5'>Primeros pasos</h2>
            <p className="text-base font-medium text-slate-600 dark:text-slate-300">
                En esta sección podrás gestionar las <b>ubicaciones</b>, <b>genéticas</b>, <b>usuarios</b> y <b>eventos</b> de tu organización.
            </p>

            <p className="text-base font-medium text-slate-600 dark:text-slate-300">
                Podrás visualizar <b>tareas</b> y <b>eventos</b> al <span className='hover:opacity-50 transition-all underline underline-offset-2'><Link href={'/individuos'}>crear un individuo</Link></span>.
            </p>

        </div>
    )
}

export default OnboardingCard