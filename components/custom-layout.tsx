'use client'

import React from 'react'
import OfflinePage from './offline'
import { useSync } from '@/context/SyncContext';
import Modal from './ui/modal';
import { LoadingIcon } from './ui/icons';

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
    const { isSyncing, isOnline } = useSync();

    if (!isOnline) {
        return <OfflinePage />
    }

    return (
        <div>
            {isSyncing ?
                <Modal
                    isOpen={isSyncing}
                    hideCloseBtn={true}
                >
                    <div className="card flex py-6 px-4 gap-3 max-w-max mx-auto">
                        <LoadingIcon />
                        <p className="input_instructions text-sm">
                            Sincronizando medidas offline, por favor aguarde en esta pantalla...
                        </p>
                    </div>
                </Modal> :
                null
            }
            {children}
        </div>
    )
}

export default CustomLayout