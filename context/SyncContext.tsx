'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { getPendingMeasures } from '@/data/tasks';
import { uploadEventList } from '@/actions/event';
import { db } from '@/lib/utils';

type SyncContextType = {
    isSyncing: boolean;
    isOnline: boolean;
    syncAmount: number;
    handleSyncOnline: () => Promise<void>;
    refreshPendingMeasures: () => Promise<void>;
};

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncAmount, setSyncAmount] = useState<number>(0);
    const [isOnline, setIsOnline] = useState(true);

    async function refreshPendingMeasures() {
        const pendingMeasuresList = await getPendingMeasures();

        if (pendingMeasuresList?.length) {
            setSyncAmount(pendingMeasuresList.length ?? 0)
            await db.pendingMeasures.clear();
            await db.pendingMeasures.bulkAdd(pendingMeasuresList);
        }
    }

    async function handleSyncOnline() {
        if (!session?.user?.email) return;

        setIsSyncing(true);
        try {
            const eventsPendingToUpload = await db.events.toArray();
            if (eventsPendingToUpload.length > 0) {
                await uploadEventList({ events: eventsPendingToUpload })
                    .then(() => db.events.clear())
                    .catch(() => toast.error('Error al actualizar los eventos'));
            }
            await refreshPendingMeasures();
            toast.success('Sincronización completada');
        } catch (error) {
            toast.error('Error al sincronizar datos');
        } finally {
            setIsSyncing(false);
        }
    }

    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);

        // Actualiza el estado inicialmente
        updateOnlineStatus();

        // Escucha los eventos de conexión
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    useEffect(() => {
        if (isOnline)
            handleSyncOnline()
    }, [isOnline])


    return (
        <SyncContext.Provider value={{ isSyncing, isOnline, handleSyncOnline, syncAmount, refreshPendingMeasures }}>
            {children}
        </SyncContext.Provider>
    );
};

export const useSync = () => {
    const context = useContext(SyncContext);
    if (!context) {
        throw new Error('useSync debe ser usado dentro de SyncProvider');
    }
    return context;
};
