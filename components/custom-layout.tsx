'use client'

import React from 'react'

import { useSync } from '@/context/SyncContext';
import { ExtendedUser } from '@/next-auth';

import UserResumeCard from './user-resume';
import { LoadingIcon } from './ui/icons';
import OfflinePage from './offline'
import Modal from './ui/modal';

const CustomLayout = ({ children, user }: { children: React.ReactNode; user: ExtendedUser }) => {
    // "isSyncing" works only in online mode
    // const { isSyncing, isOnline } = useSync();
    const isOperator = user.type == 'operator'

    return (
        <div>
            {/* {isSyncing ?
                <Modal
                    isOpen={isSyncing}
                    hideCloseBtn={true}
                >
                    <div className="card flex items-start py-6 px-4 gap-3 max-w-max mx-auto">
                        <div className="mt-1">
                            <LoadingIcon />
                        </div>
                        <div>
                            <p className='text-lg font-semibold tracking-tight'>
                                Sincronizando offline
                            </p>
                            <p className="input_instructions text-sm">
                                Estamos cargando sus datos para que puedas trabajar sin conexión, aguarda unos segundos por favor...
                            </p>
                        </div>
                    </div>
                </Modal> :
                null
            } */}

            <div className="px-default py-default">
                {/* {!isOnline || isOperator ? (
                    <OfflinePage />
                ) :
                    children
                } */}
                {children}
            </div>
        </div>
    )
}

export default CustomLayout