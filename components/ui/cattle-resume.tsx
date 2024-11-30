import { CattleProps } from '@/lib/types'
import React from 'react'
import ChipState from '../cattles/chip-state'
import ChipBodyCondition from '../cattles/chip-body-condition'

const CattleResume = ({ cattle, withoutClasses, withoutHeader, customHeader }: {
    customHeader?: any;
    cattle: CattleProps;
    withoutClasses?: boolean;
    withoutHeader?: boolean;
}) => {

    const lastMeditionHour = cattle?.bodyConditionDate ? new Date(cattle.bodyConditionDate)
        .toLocaleTimeString("es-AR", { hour: 'numeric', minute: 'numeric' }) : ''

    const lastStateHour = cattle?.stateDate ? new Date(cattle.stateDate)
        .toLocaleTimeString("es-AR", { hour: 'numeric', minute: 'numeric' }) : ''


    const lastMedition = cattle?.bodyConditionDate ?
        new Date(cattle.bodyConditionDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'short', year: 'numeric' }) : ''

    const lastState = cattle?.stateDate ?
        new Date(cattle.stateDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'short', year: 'numeric' }) : ''

    return (
        <div className={withoutClasses ? 'w-full overflow-x-auto pb-1 px-2' : 'py-2 w-full border custom-border rounded-xl dark:bg-clightgray/50 bg-gray-50/50 overflow-x-auto h-max'}>
            {withoutHeader ? null :
                <p className="font-medium sticky left-0 pb-2 w-full border-b custom-border px-2 mb-2 text-gray-600 dark:text-gray-400">
                    {customHeader ?? `Resumen`}
                </p>
            }

            <div className="flex gap-5 px-2 w-max">
                <div className='min-w-[50px] text-start'>
                    <p className='text-gray-600 dark:text-gray-400 text-start mb-1 text-[11px] tracking-wide font-medium uppercase'>Caravana</p>
                    <p className='font-bold text-2xl'>
                        {cattle?.caravan}
                    </p>
                </div>

                <div className='min-w-[50px] text-start h-[53px] flex flex-col justify-between'>
                    <p className='text-gray-600 dark:text-gray-400 text-start mb-1 text-[11px] tracking-wide font-medium uppercase'>Ubicación</p>
                    <p className='font-normal text-base md:text-lg flex items-end'>
                        {cattle?.locationId?.name}
                    </p>
                </div>

                <div className='min-w-[50px] text-start'>
                    <p className='text-gray-600 dark:text-gray-400 text-start mb-1 text-[11px] tracking-wide font-medium uppercase'>Condición Corporal</p>

                    <div className="flex gap-2">
                        <ChipBodyCondition measure={Number(cattle.bodyCondition)} bodyRanges={cattle.bodyRanges} />

                        <div className='-space-y-1.5'>
                            <p className="input_instructions text-start text-sm">
                                {lastMedition}
                            </p>
                            <p className="input_instructions text-start text-xs">
                                {lastMeditionHour}
                            </p>
                        </div>
                    </div>
                </div >

                <div className='min-w-[105px] text-start'>
                    <p className='text-gray-600 dark:text-gray-400 text-start mb-1 text-[11px] tracking-wide font-medium uppercase'>Estado</p>

                    <div className="flex gap-2">
                        <ChipState state={cattle.state} />
                        <div className='-space-y-1.5'>
                            <p className="input_instructions text-start text-sm">
                                {lastState}
                            </p>
                            <p className="input_instructions text-start text-xs">
                                {lastStateHour}
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default CattleResume