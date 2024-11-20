// 'use client'

// import { db, ExtendedEventSchema } from '@/lib/utils';
// import { useEffect, useState } from 'react'
// import Card from './ui/card';
// import { createEvent } from '@/actions/event';
// import CheckButton from './ui/check-button';
// import toast from 'react-hot-toast';

// const PendingToSyncEvents = () => {
//   const [selectedPendingEvents, setSelectedPendingEvents] = useState<ExtendedEventSchema[]>([]);
//   const [pendingEvents, setPendingEvents] = useState<ExtendedEventSchema[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   // Cargar los eventos aun no subidos desde IndexedDB
//   useEffect(() => {
//     const loadOfflineData = async () => {
//       const storedPendingEvents = await db.events.toArray();
//       setPendingEvents(storedPendingEvents);
//     };
//     loadOfflineData();
//   }, []);

//   const handleUploadEvents = async () => {
//     setIsLoading(true)
//     await Promise.all(selectedPendingEvents.map(async (pendingEvent, index) => {
//       const { data, error } = await createEvent(pendingEvent);

//       if (data) {
//         const leftToUpload = selectedPendingEvents.splice(index, 1)
//         await db.events.clear()
//         await db.events.bulkAdd(leftToUpload)

//         return toast.success(`Caravana ${pendingEvent.extraFields.cattle.caravan}`)
//       }
//     }))
//     setIsLoading(false)
//   }

//   if (!pendingEvents?.length) return null

//   return (
//     <div>

//       <Card>
//         <p className="dark:text-gray-300 text-lg font-medium">
//           {pendingEvents.length} eventos pendientes
//         </p>

//         <ul className="custom_list">
//           {pendingEvents.map((event, index) => {
//             let selected = selectedPendingEvents.includes(event)
//             return (
//               <CheckButton
//                 key={index}
//                 value={JSON.stringify(event)}
//                 label={event.extraFields.cattle.caravan}
//                 onClick={() => {
//                   if (selected) {
//                     setSelectedPendingEvents((prev) => prev.filter((e) => e.extraFields.cattle._id))
//                   }
//                 }}
//                 selected={selected}
//                 disabled={isLoading}
//               >
//                 <p
//                   className={`font-medium text-xl text-gray-600 dark:text-gray-300 text-start
//                  ${selected ? 'text-opacity-100' : 'dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100'}`}
//                 >
//                   {event.extraFields.cattle.caravan}
//                 </p>
//               </CheckButton>
//             )
//           })}
//         </ul>

//         <button
//           className='rounded_btn bg-cgreen dark:bg-clime'
//           disabled={isLoading || !selectedPendingEvents}
//           type='button'
//           onClick={handleUploadEvents}
//         >
//           <p className='text-white dark:text-cgray'>
//             Sincronizar
//           </p>
//         </button>
//       </Card>

//     </div>
//   )
// }

// export default PendingToSyncEvents
