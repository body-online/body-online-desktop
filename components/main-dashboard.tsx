'use client'

import React, { useEffect } from 'react'
import EventsDataTable from './event/table'
import Link from 'next/link'
import OperatorsTablePage from './operator/operators-table-page'
import LocationsDataTable from './location/table'
import GeneticsTablePage from './genetic/genetics-table-page'
import useOnlineStatus from '@/hooks/useOnlineStatus'
import { useSession } from 'next-auth/react'
import OfflinePage from './offline-page'

const MainDashboard = ({ hasAnyCattle }: { hasAnyCattle?: boolean }) => {
    const { data: session } = useSession();
    const isOnline = useOnlineStatus();

    return (
        <div className='px-default py-default'>
            {!isOnline ? (
                <OfflinePage />
            ) : (
                <div className="w-full flex flex-col gap-6 overflow-hidden">
                    <div className='space-y-2'>
                        <div className="py-2">
                            <p className='text-cgreen dark:text-white font-semibold text-xl'>
                                {session?.user?.farmName}
                            </p>
                            <h2 className='text-slate-400 dark:text-slate-300 text-base'>
                                Bienvenido <span className='font-medium'>{session?.user?.name}</span>
                            </h2>
                        </div>


                        {!hasAnyCattle ? (
                            <div className='gradient_card'>
                                <h2 className='text-lg font-medium mb-5'>Primeros pasos</h2>
                                <p className="text-base font-medium text-slate-600 dark:text-slate-300">
                                    En esta sección podrás gestionar las <b>ubicaciones</b>, <b>genéticas</b>, <b>usuarios</b> y <b>eventos</b> de tu organización.
                                </p>

                                <p className="text-base font-medium text-slate-600 dark:text-slate-300">
                                    Podrás visualizar <b>tareas</b> y <b>eventos</b> al <span className='hover:opacity-50 transition-all underline underline-offset-2'><Link href={'/individuos'}>crear un individuo</Link></span>.
                                </p>

                            </div>
                        ) : null}
                    </div>

                    {hasAnyCattle && <EventsDataTable />}
                    <div className="flex flex-col md:grid  md:grid-cols-2 gap-6 xl:grid-cols-3 w-full">
                        <div className="md:col-span-2 xl:col-span-1">
                            <OperatorsTablePage />
                        </div>
                        <LocationsDataTable />
                        <GeneticsTablePage />
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default MainDashboard