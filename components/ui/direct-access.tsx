'use client'


import React, { useEffect, useState } from 'react'
import { CattleProps, PendingMeasureProps } from '@/lib/types'
import EventForm from '../event-form'
import PendingMeasuresDataTable from '../pending_measures/table'
import { columnsPendingMeasures } from '../pending_measures/columns'
import InfoMessage from './info'


type DirectAccessProps = { cattles: CattleProps[]; pendingMeasures?: PendingMeasureProps[]; error?: string; };

const DirectAccess = ({ cattles, pendingMeasures, error }: DirectAccessProps) => {

    return (
        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-6">
            <div className='card w-full h-max'>
                <div className="px-4 md:px-5 py-6">

                    <div className="flex items-center gap-1 mb-3 max-w-max">
                        {/* <BoltIcon fill='fill-clime' /> */}
                        <h2 className='semititle'>
                            Cargar eventos
                        </h2>
                    </div>

                    <EventForm cattles={cattles} />
                </div>
            </div>


            <div className='card w-full h-max'>
                <div className="px-4 md:px-5 py-6">
                    <h2 className='semititle'>
                        Mediciones pendientes
                    </h2>
                </div>

                {(pendingMeasures && Array.isArray(pendingMeasures) && !error) ?
                    <PendingMeasuresDataTable
                        pendingMeasures={pendingMeasures}
                        columns={columnsPendingMeasures}
                    /> :
                    <InfoMessage
                        type='warning'
                        title='Sección inaccesible'
                        subtitle='Hemos experimentado un contratiempo al obtener su listado de mediciones pendientes.'
                    />
                }

            </div>
        </div>

    )
}

export default DirectAccess