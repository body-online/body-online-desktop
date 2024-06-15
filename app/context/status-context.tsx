'use client'

import { CattleProps } from '@/lib/types'
import { createContext, useState } from 'react'

export const StatusContext = createContext({})

export default function StatusProvider({ children }: { children: React.ReactNode }) {
    const [totalCattles, setTotalCattles] = useState<number>(0)

    return (
        <StatusContext.Provider value={{ totalCattles, setTotalCattles }}>
            {children}
        </StatusContext.Provider>
    )
}