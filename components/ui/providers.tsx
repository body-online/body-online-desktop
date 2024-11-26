// 'use client'

// import { ThemeProvider } from 'next-themes';
// import { SyncProvider } from '@/context/SyncContext';

// export function Providers({ children }: { children: React.ReactNode }) {
//     return (
      
//                 {children}
//             </ThemeProvider>
//         </SyncProvider>
//     );
// }

// // import { ThemeProvider } from 'next-themes'
// // import toast, { Toaster } from 'react-hot-toast'
// // import OfflinePage from '../offline';
// // import Navbar from './navbar';
// // import Modal from './modal';
// // import { LoadingIcon } from './icons';
// // import { useSession } from 'next-auth/react';
// // import { useEffect, useState } from 'react';
// // import { getPendingMeasures } from '@/data/tasks';
// // import { uploadEventList } from '@/actions/event';
// // import LoadingDashboard from '@/app/loading';
// // import { db } from '@/lib/utils';

// // export function Providers({ children }: { children: React.ReactNode }) {
// //     const { data: session } = useSession()
// //     const [isOnline, setIsOnline] = useState<boolean>();
// //     const [isLoading, setIsLoading] = useState<boolean>(false);

// //     async function refreshPendingMeasures() {
// //         // fetch fresh assigned to the user tasks
// //         const pendingMeasuresList = await getPendingMeasures()

// //         if (pendingMeasuresList?.length) {
// //             await db.pendingMeasures.clear()
// //             await db.pendingMeasures.bulkAdd(pendingMeasuresList)
// //         }
// //         return
// //     }

// //     // handle user connected
// //     async function handleSyncOnline() {
// //         if (!session?.user?.email) return null

// //         try {
// //             const eventsPendingToUpload = await db.events.toArray();
// //             // 1 Check the pending to upload events before upload to continue
// //             if (eventsPendingToUpload.length > 0) {
// //                 await uploadEventList({ events: eventsPendingToUpload })
// //                     .then(async () => await db.events.clear())
// //                     .catch(() => toast.error('Error al actualizar los eventos'))
// //                     .finally(async () => {
// //                         // 2 Refresh tasks > pending measures
// //                         await refreshPendingMeasures()
// //                     })
// //             } else {
// //                 await refreshPendingMeasures()
// //             }
// //         } catch (error) {
// //             toast.error('Error al sincronizar datos')
// //         }
// //     }

// //     useEffect(() => {
// //         if (isOnline && session) {
// //             setIsLoading(true);
// //             handleSyncOnline().then(() => setIsLoading(false));
// //         }
// //     }, [isOnline, session])

// //     // handle online status
// //     useEffect(() => {
// //         if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {

// //             // Código ejecutado solo en el cliente
// //             const updateOnlineStatus = () => setIsOnline(navigator.onLine);

// //             updateOnlineStatus(); // Actualiza inicialmente el estado
// //             window.addEventListener('online', updateOnlineStatus);
// //             window.addEventListener('offline', updateOnlineStatus);

// //             return () => {
// //                 window.removeEventListener('online', updateOnlineStatus);
// //                 window.removeEventListener('offline', updateOnlineStatus);
// //             };
// //         }
// //     }, []);

// //     return (
// //         <>
// //             <ThemeProvider
// //                 attribute='class'
// //                 defaultTheme='dark'
// //             >
// //                 {session?.user &&
// //                     <Navbar user={session?.user} />
// //                 }
// //                 {isOnline ? (
// //                     isLoading ?
// //                         <LoadingDashboard /> :
// //                         children
// //                 ) : (
// //                     <OfflinePage />
// //                 )}

// //                 {isLoading ? (
// //                     <Modal
// //                         isOpen={isLoading}
// //                         hideCloseBtn={true}
// //                     >
// //                         <div className="card flex py-6 px-4 gap-3 max-w-max mx-auto">
// //                             <LoadingIcon />
// //                             <p className="input_instructions text-sm">
// //                                 Sincronizando medidas offline, por favor aguarde en esta pantalla...
// //                             </p>
// //                         </div>
// //                     </Modal>
// //                 ) : null}

// //             </ThemeProvider>
// //             <Toaster
// //                 position="bottom-right"
// //                 reverseOrder={true}
// //                 toastOptions={{ duration: 5000 }}
// //             />
// //         </>
// //     )
// // }