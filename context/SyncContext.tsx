'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { getPendingMeasures } from '@/data/tasks';
import { uploadEventList } from '@/actions/event';
import { db } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';
import { getAllCattles } from '@/data/cattle';
import { MinifyCattleProps, PendingMeasureProps } from '@/lib/types';

type SyncContextType = {
    isSyncing: boolean;
    isOnline: boolean;
    cattlesList: MinifyCattleProps[];
    handleSyncOnline: () => Promise<void>;
    // refreshPendingMeasures: () => Promise<void>;
};


const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();

    // offline 
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [cattlesList, setCattlesList] = useState<MinifyCattleProps[]>([])

    // we will save the entire cattles array so..
    async function loadOnlineData() {
        let cattlesList
        try {
            const cattles = await getAllCattles()
            cattlesList = cattles
        } catch (error) {
            console.log(error)
        }
        setCattlesList(cattlesList ?? [])
    }

    async function handleSyncOnline() {
        if (!session?.user?.email) return;

        setIsSyncing(true);
        try {
            const eventsPendingToUpload = await db.events.toArray();

            if (eventsPendingToUpload.length >= 1) {
                await uploadEventList({ events: eventsPendingToUpload })
                    .then(() => db.events.clear())
                    .catch(() => toast.error('Error al actualizar los eventos'));
            }

            await loadOnlineData();
            toast.success('Sincronización completada');
        } catch (error) {
            toast.error('Error al sincronizar datos');
        } finally {
            setIsSyncing(false);
        }
    }

    // useEffect(() => {
    //     const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    //     // Actualiza el estado inicialmente
    //     updateOnlineStatus();

    //     // Escucha los eventos de conexión
    //     window.addEventListener('online', updateOnlineStatus);
    //     window.addEventListener('offline', updateOnlineStatus);

    //     return () => {
    //         window.removeEventListener('online', updateOnlineStatus);
    //         window.removeEventListener('offline', updateOnlineStatus);
    //     };
    // }, []);

    // useEffect(() => {
    //     if (isOnline)
    //         handleSyncOnline()
    // }, [isOnline])

    return (
        <SyncContext.Provider value={{ isSyncing, isOnline, handleSyncOnline, cattlesList }}>
            <ThemeProvider attribute='class'>
                {children}
            </ThemeProvider>
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






