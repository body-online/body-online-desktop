import React from 'react'

import FarmForm from '@/components/farm-form';
import { currentFarm, currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

const OnboardingPage = async () => {
    const user = await currentUser()

    if (user?.farmId) {
        signOut()
        return redirect('/')
    }

    return (
        <main>
            <FarmForm />
        </main>
    )
}

export default OnboardingPage;