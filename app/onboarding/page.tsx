import React from 'react'

import FarmForm from '@/components/farm-form';
import { currentFarm } from '@/lib/auth';
import { redirect } from 'next/navigation';

const OnboardingPage = async () => {
    const farm = await currentFarm()

    if (farm) {
        return redirect('/')
    }

    return (
        <div className="max-w-lg h-max m-auto space-y-6 px-2">
            <h3 className='font-black text-xl md:text-2xl text-center'>¡Bienvenido a BodyOnline!</h3>
            <div className="w-full">
                <h3 className="truncate text-lg font-bold  text-black">
                    ¡Un paso más y comenzarás tus mediciones!
                </h3>
                <p>
                    Necesitamos que por favor completes el siguiente formulario para recolectar lo indispensable
                    sobre tu organización y poder brindarte la mejor experiencia posible.
                </p>
            </div>

            <FarmForm />
        </div>
    )
}

export default OnboardingPage;