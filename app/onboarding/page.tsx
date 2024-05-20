import React from 'react'

import FarmForm from '@/components/farm-form';
import { currentFarm, currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

const OnboardingPage = async () => {
    const farm = await currentFarm()
    const user = await currentUser()

    if (farm) {
        return redirect('/')
    }

    return (
        <main>
            <div className='container pb-12 px-default space-y-8 relative mt-4'>
                <FarmForm />
            </div>
        </main>
    )
}

export default OnboardingPage;