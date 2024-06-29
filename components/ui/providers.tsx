'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {

    return (
        <>
            <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
            >
                {children}
            </ThemeProvider>
            <Toaster
                position="bottom-right"
                reverseOrder={true}
                toastOptions={{ duration: 5000 }}
            />
        </>
    )
}