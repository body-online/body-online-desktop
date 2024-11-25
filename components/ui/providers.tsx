'use client'

import useOnlineStatus from '@/hooks/useOnlineStatus'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import OfflinePage from '../offline';
import Navbar from './navbar';
import Modal from './modal';
import { LoadingIcon } from './icons';

export function Providers({ children }: { children: React.ReactNode }) {
    const { isOnline, isLoading, uploadingEvents } = useOnlineStatus();

    return (
        <>
            <ThemeProvider
                attribute='class'
                defaultTheme='dark'
            >
                <Navbar />

                {uploadingEvents ? (
                    <Modal
                        isOpen={isLoading}
                        hideCloseBtn={true}
                    >
                        <div className="gradient_card flex py-6 px-4 gap-3 max-w-max mx-auto">
                            <LoadingIcon />
                            <p className="input_instructions text-sm">
                                Sincronizando medidas offline, por favor aguarde en esta pantalla...
                            </p>
                        </div>
                    </Modal>
                ) : null}

                {isOnline ? children : <OfflinePage />}
            </ThemeProvider>
            <Toaster
                position="bottom-right"
                reverseOrder={true}
                toastOptions={{ duration: 5000 }}
            />
        </>
    )
}