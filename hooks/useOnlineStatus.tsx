'use client'

import { uploadEventList } from '@/actions/event';
import { getPendingMeasures } from '@/data/tasks';
import { PendingMeasureProps } from '@/lib/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { db } from '@/lib/utils';
import { useSession } from 'next-auth/react';

const useOnlineStatus = () => {
  const { data: session } = useSession()
  const [isOnline, setIsOnline] = useState<boolean>();
  const [pendingTasks, setPendingTasks] = useState<PendingMeasureProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadingEvents, setUploadingEvents] = useState<boolean>(false);

  async function loadPendingMeasures() {
    // fetch fresh assigned to the user tasks 
    const pendingMeasuresList = await getPendingMeasures()

    if (pendingMeasuresList?.length) {
      await db.pendingMeasures.clear()
      await db.pendingMeasures.bulkAdd(pendingMeasuresList)
    }
    return pendingMeasuresList

  }
  // handle user connected
  async function handleSyncOnline() {
    if (!session) return null
    try {
      setIsLoading(true);

      // 1 Check the pending to upload events before upload to continue
      const eventsPendingToUpload = await db.events.toArray();

      if (eventsPendingToUpload.length) setUploadingEvents(true);

      await uploadEventList({ events: eventsPendingToUpload })
        .then(async () => {
          // clear the records if the insertion was OK
          await db.events.clear();


          toast.success('Datos actualizados', { id: 'success-update-events' })
        })
        .catch(() => {
          toast.error('Error al actualizar los eventos')
        })
        .finally(async () => {
          // 2 Refresh tasks > pending measures
          await loadPendingMeasures().then((data) => {
            return setPendingTasks(data ?? [])
          });
          setUploadingEvents(false)
        })

    } catch (error) {
      toast.error('Error al sincronizar')
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isOnline && !isLoading && session?.user) handleSyncOnline();
  }, [isOnline, session])

  // handle online status
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {

      // Código ejecutado solo en el cliente
      const updateOnlineStatus = () => setIsOnline(navigator.onLine);

      updateOnlineStatus(); // Actualiza inicialmente el estado
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    }
  }, []);

  return { isOnline, pendingTasks, handleSyncOnline, isLoading, uploadingEvents };
};

export default useOnlineStatus;
