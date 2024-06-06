'use client'


import React, { useEffect, useState } from 'react'
import { CattleProps, PendingMeasureProps } from '@/lib/types'
import EventForm from '../event-form'
import PendingMeasuresDataTable from '../pending_measures/table'
import { columnsPendingMeasures } from '../pending_measures/columns'
import InfoMessage from './info'
import { SelectOptionProps } from './select-input'
import Card from './card'


type DirectAccessProps = { cattles: CattleProps[]; pendingMeasures?: PendingMeasureProps[]; error?: string; };

const DirectAccess = ({ cattles, pendingMeasures, error }: DirectAccessProps) => {

    return (
        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-6 mt-6">

            <Card headerLabel='Crear evento'>
                <></>
                {/* <EventForm /> */}
            </Card>


            <Card headerLabel='Mediciones pendientes'>
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
            </Card>
        </div>

    )
}

export default DirectAccess