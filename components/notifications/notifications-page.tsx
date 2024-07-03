import React from 'react'
import { getNotifications } from '@/data/notifications'

import { SerializedSearchParamsProps } from '@/app/(main)/page'
import { PendingMeasureProps } from '@/lib/types'

import CardHeader from '../ui/card-header'
import Pagination from '../ui/pagination'
import InfoMessage from '../ui/info'
import Card from '../ui/card'
import { dateDiffInDays } from '@/lib/utils'

export default async function NotificationsPage({ params }: { params: SerializedSearchParamsProps }) {
    // get the list of notifications existents to this farm
    const { data, error } = await getNotifications({ page: params.pageNotifications, limit: 10 });

    return (
        <Card paddings='py-4 md:py-6 w-full flex flex-col overflow-hidden h-min'>
            <div className="px-3 md:px-5 pb-4 md:pb-6 border-b custom-border flex-between">
                <CardHeader label='Notificaciones' />
            </div>

            {!error && data ? (
                <div className='w-full flex flex-col h-full max-h-96'>
                    {data?.notifications && data?.notifications?.length > 0 ? (
                        <div className="w-full overflow-auto h-full">
                            <table className='relative'>
                                <thead className='sticky top-0'>
                                    <tr>
                                        <th>Caravana</th>
                                        <th>Vencimiento</th>
                                        <th>Fecha de medición sugerida</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data?.notifications?.map(
                                        (notification: PendingMeasureProps, index: number) => {
                                            const expireDate = new Date(notification?.expiresAt)
                                            const diffDays = dateDiffInDays(new Date(), expireDate)

                                            if (!expireDate) return (
                                                <p className='chip bg-orange-200 dark:bg-orange-500/10' key={index}>
                                                    Error al calacular
                                                </p>
                                            )

                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <p className='font-semibold text-black dark:text-white test-sm'>
                                                            {notification?.caravan}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className={`chip ${notification?.isExpired ? 'chip_red' : 'chip_green'}`}>
                                                            {notification?.isExpired ? 'Hace ' : 'En '}
                                                            {Math.abs(diffDays)} días
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className='font-semibold text-black dark:text-white test-sm'>
                                                            {new Date(notification?.expiresAt)?.toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </p>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : <InfoMessage type='censored' title='No hemos encontrado notificaciones' />
                    }

                    {data?.totalNotifications && data?.totalPages ?
                        <div className="px-3 md:px-5">
                            <Pagination
                                paramName="pageNotifications"
                                page={params.pageNotifications}
                                totalPages={data?.totalPages ?? 1}
                            />
                        </div> : null
                    }

                </div>
            ) : <InfoMessage type='warning' title='Lista de notificaciones inaccesible' subtitle={error} />
            }

        </Card>
    )
}