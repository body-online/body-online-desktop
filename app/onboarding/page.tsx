import React from 'react'

import FarmForm from '@/components/farm-form';
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

const OnboardingPage = async () => {
    const user = await currentUser()

    if (user?.farmId) {
        return redirect('/')
    }

    return (
        <FarmForm />
    )
}

export default OnboardingPage;