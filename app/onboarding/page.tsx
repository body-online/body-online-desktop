import React from 'react'

import FarmForm from '@/components/farm-form';
import { currentFarm, currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

const OnboardingPage = async () => {
    const farm = await currentFarm()

    if (farm) {
        return redirect('/')
    }

    return (
        <main>
            <FarmForm />
        </main>
    )
}

export default OnboardingPage;