import CattlesDashboard from '@/components/cattles/dashboard'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
    const user = await currentUser()

    if (!user?.farmId) return redirect('/')
    if (user?.type != 'owner') return redirect('/tareas')

    return <CattlesDashboard />
}