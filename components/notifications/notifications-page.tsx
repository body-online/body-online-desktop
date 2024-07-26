import React from 'react'
import { getNotifications } from '@/data/notifications'

import { SerializedSearchParamsProps } from '@/app/page'
import { PendingMeasureProps } from '@/lib/types'
import { dateDiffInDays } from '@/lib/utils'

import Pagination from '../ui/pagination'
import InfoMessage from '../ui/info'
import Card from '../ui/card'
import CreateMeasureButton from '../events/create-measure-btn'

export default async function NotificationsPage({ params }: { params: SerializedSearchParamsProps }) {
    // get the list of notifications existents to this farm
    const { data, error } = await getNotifications({ page: params.pageNotifications, limit: 10 });

    return (
        <Card paddings='py-4 md:py-6 w-full flex flex-col overflow-hidden h-min'>
            <div className="px-3 md:px-5 pb-4 md:pb-6 flex-between border-b custom-border">
                <h2 className="semititle">
                    Notificaciones
                </h2>
            </div>

            {!error && data ? (
                <div className='w-full flex flex-col h-full'>
                    {data?.notifications && data?.notifications?.length > 0 ? (
                        <div className="w-full overflow-auto h-full">
                            {data?.notifications?.map(
                                (notification: PendingMeasureProps, index: number) => {
                                    const measureDate = new Date(notification?.expiresAt)?.toLocaleDateString("es-AR", { day: 'numeric', month: 'long' })
                                    const expireDate = new Date(notification?.expiresAt);
                                    const diffDays = dateDiffInDays(new Date(), expireDate);

                                    if (!expireDate) return (
                                        <p className='chip bg-orange-200 dark:bg-orange-500/10' key={index}>
                                            Error al calacular
                                        </p>
                                    )

                                    return (
                                        <div
                                            className='grid grid-cols-3 min-w-max py-3 w-full border-b custom-border px-3 md:px-5'
                                            key={index}
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`rounded-lg p-1 w-max
                                                        ${!notification?.isExpired ?
                                                            'bg-green-500 dark:bg-green-500' :
                                                            'bg-red-500 dark:bg-red-500'
                                                        }`
                                                    }>
                                                        <CalendarIcon />
                                                    </div>
                                                    <p className='font-medium text-white dark:text-white'>
                                                        {notification?.isExpired ? 'Hace ' : 'En '}
                                                        {Math.abs(diffDays)} días
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='pl-3 md:pl-5'>
                                                <p className='semititle'>
                                                    {notification?.caravan}
                                                </p>
                                            </div>

                                            <CreateMeasureButton notification={notification} />
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    ) : <InfoMessage type='censored' title='No hemos encontrado notificaciones' />
                    }

                    {
                        data?.totalNotifications && data?.totalPages ?
                            <div className="px-3 md:px-5 mt-3">
                                <Pagination
                                    paramName="pageNotifications"
                                    page={params.pageNotifications}
                                    totalPages={data?.totalPages ?? 1}
                                />
                            </div> : null
                    }

                </div >
            ) : <InfoMessage type='warning' title='Lista de notificaciones inaccesible' subtitle={error} />
            }

        </Card >
    )
}

const CalendarIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/5000/svg" viewBox="0 0 20 20" className="dark:fill-white w-4 h-4">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
            </svg>
        </div>
    )
}