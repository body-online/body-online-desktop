// 'use client'

// import { db } from '@/lib/utils';
// import { useEffect, useState } from 'react';
// import CattleResume from './ui/cattle-resume';
// import CaliperMeasure from './event/caliper-measure';
// import { ArrowsIcon, CheckIcon, } from './ui/icons';
// import Modal from './ui/modal';
// import toast from 'react-hot-toast';
// import InfoMessage from './ui/info';
// import { CattleProps, eventSchema, EventSchema, TaskProps } from '@/lib/types';

// const OfflinePage = () => {
//     const [pendingTasks, setPendingTasks] = useState<TaskProps[]>([]);
//     const [pendingEvents, setPendingEvents] = useState<EventSchema[]>([]);

//     const [isLoading, setIsLoading] = useState<boolean>(false)

//     const [selectedTask, setSelectedTask] = useState<TaskProps>()
//     const [selectedCattle, setSelectedCattle] = useState<CattleProps>()
//     const [caliperMeasure, setCaliperMeasure] = useState<number>();
//     const [caliperDetail, setCaliperDetail] = useState<string>();

//     async function handleSaveEventInIndexDB() {
//         setIsLoading(true)
//         try {
//             if (!selectedCattle) return toast.error('No hemos encontrado individuo seleccionado')
//             if (!selectedTask) return toast.error('No hemos encontrado tarea seleccionada')
//             const { _id: cattleId, caravan } = selectedCattle;
//             const { _id: taskId, expirationDate } = selectedTask;
//             const newEvent: EventSchema = {
//                 cattleId,
//                 taskId,
//                 measure: caliperMeasure,
//                 eventDate: expirationDate,
//                 eventDetail: caliperDetail,
//                 eventType: 'body_measure',
//             }

//             if (eventSchema.safeParse(newEvent)) { // validation
//                 // save the event as medition
//                 let newPendingEventsList = pendingEvents;
//                 newPendingEventsList.push(newEvent);

//                 await db.events.clear()
//                 await db.events.bulkAdd(newPendingEventsList)
//                 setPendingEvents(newPendingEventsList)

//                 handleClose()
//                 return toast.success(`${selectedCattle?.caravan} medida registrada: ${caliperMeasure}`, { position: 'top-left' })
//             }
//         } catch (error) {
//             toast.error('Ha ocurrido un error')
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     function handleSelectCattle({ cattle, task }: { cattle: CattleProps; task: TaskProps }) {
//         setSelectedCattle(cattle)
//         setSelectedTask(task)
//     }

//     function handleClose() {
//         setCaliperDetail(undefined)
//         setCaliperMeasure(undefined)
//         return setSelectedCattle(undefined)
//     }

//     useEffect(() => {
//         const loadOfflineData = async () => {
//             const indexDBTasks = await db.tasks.toArray();
//             setPendingTasks(indexDBTasks);

//             const indexDBEvents = await db.events.toArray();
//             setPendingEvents(indexDBEvents);
//         };
//         loadOfflineData();
//     }, []);

//     return (
//         <>
//             <div className='py-default'>
//                 <h1 className="semititle">
//                     Tareas
//                 </h1>

//                 {pendingTasks.length >= 1 ? (
//                     <ul className='flex flex-col gap-2'>
//                         {pendingTasks.map((task) => {
//                             const { _id: taskId, cattleIds, expirationDate, measuredCattles } = task;
//                             const pendingToMeasureCattles = cattleIds?.filter((cattle) => !measuredCattles.includes(cattle.caravan));
//                             return pendingToMeasureCattles?.map((cattle, cattleIndex) => {
//                                 const alreadyChargedAsPendingEvent = pendingEvents.find((event) => (event.cattleId === cattle._id && task._id === event.taskId && event.eventDate === task.expirationDate))?.measure

//                                 return (
//                                     <li key={`${taskId}-${cattleIndex}`}>
//                                         <div className="space-y-2 py-3 card px-3">
//                                             <CattleResume withoutHeader={true} cattle={cattle} withoutClasses={true} />


//                                             <div className="flex-between">
//                                                 <div className="flex gap-2">
//                                                     <p className='text-sm'>
//                                                         Vencimiento
//                                                     </p>
//                                                     <p className='input_instructions'>
//                                                         {new Date(expirationDate).toLocaleDateString()}
//                                                     </p>
//                                                 </div>

//                                                 <button
//                                                     type='button'
//                                                     onClick={() => handleSelectCattle({ cattle, task })}>
//                                                     {alreadyChargedAsPendingEvent ?
//                                                         <CheckIcon className='fill-cgreen dark:fill-clime !w-8 !h-8' />
//                                                         :
//                                                         <div className={`!w-8 !h-8 rounded-full bg-white dark:bg-clightgray border-2 border-slate-300 dark:border-cgray/50 overflow-hidden flex items-center justify-start opacity-100`}>
//                                                             <ArrowsIcon direction='!w-8 !h-8 -rotate-90' />
//                                                         </div>
//                                                     }
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </li>
//                                 )
//                             })
//                         })}
//                     </ul>
//                 ) : (
//                     <InfoMessage
//                         type='info'
//                         title='Sin resultados'
//                         subtitle='No hemos encontrado mediciones pre-cargadas.'
//                     />
//                 )}
//             </div>

//             <Modal isOpen={Boolean(selectedCattle && selectedTask)} handleClose={handleClose}>
//                 <div className='card_modal flex flex-col max-w-sm mx-auto w-full'>
//                     <div className="header_container">
//                         <p className="dark:text-gray-300 text-2xl font-medium">
//                             {selectedCattle?.caravan}
//                         </p>
//                     </div>

//                     <div className='flex flex-col overflow-auto px-3'>
//                         {selectedCattle &&
//                             <CaliperMeasure
//                                 setMeasure={({ measure: measureValue, eventDetail }) => {
//                                     setCaliperDetail(eventDetail)
//                                     setCaliperMeasure(measureValue)
//                                 }}
//                                 measure={caliperMeasure}
//                                 disabled={isLoading}
//                                 min={Number(selectedCattle?.geneticId.bodyRanges?.[0])}
//                                 max={Number(selectedCattle?.geneticId.bodyRanges?.[1])}
//                             />
//                         }
//                     </div>

//                     <div className="buttons_container">
//                         <button
//                             className='rounded_btn bg-white dark:bg-clightgray'
//                             type='button'
//                             onClick={() => handleClose()}
//                         >
//                             <p>Cancelar</p>
//                         </button>

//                         <button
//                             className='rounded_btn bg-cgreen dark:bg-clime'
//                             disabled={isLoading || !caliperMeasure}
//                             type={'button'}
//                             onClick={() => handleSaveEventInIndexDB()}
//                         >
//                             <p className='text-white dark:text-cgray'>
//                                 Pre-guardar
//                             </p>
//                         </button>
//                     </div>
//                 </div>
//             </Modal >
//         </>
//     );
// };

// export default OfflinePage;
