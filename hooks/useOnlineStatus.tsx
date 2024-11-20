'use client'

import { useEffect, useState } from 'react';

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true); // Por defecto, asumimos que está online

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

  return isOnline;
};

export default useOnlineStatus;
