import { CattleProps } from '@/lib/types'
import React from 'react'
import ChipState from '../cattles/chip-state'
import ChipBodyCondition from '../cattles/chip-body-condition'

const CattleResume = ({ cattle, withoutClasses }: { cattle: CattleProps; withoutClasses?: boolean }) => {
    const lastMeditionHour = cattle?.bodyConditionDate ? new Date(cattle.bodyConditionDate)
        .toLocaleTimeString("es-AR", { hour: 'numeric', minute: 'numeric' }) : '-'

    const lastStateHour = cattle?.stateDate ? new Date(cattle.stateDate)
        .toLocaleTimeString("es-AR", { hour: 'numeric', minute: 'numeric' }) : '-'


    const lastMedition = cattle?.bodyConditionDate ?
        new Date(cattle.bodyConditionDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

    const lastState = cattle?.stateDate ?
        new Date(cattle.stateDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

    return (
        <div className={withoutClasses ? '' : 'p-4 w-full border custom-border rounded-xl dark:bg-clightgray bg-gray-50 overflow-auto'}>
            <div className="flex gap-6 w-full min-w-max">
                <div className='min-w-[50px]'>
                    {/* <p className='input_instructions mb-2 text-sm'>Caravana</p> */}
                    <p className='font-bold text-2xl text-center'>
                        {cattle?.caravan}
                    </p>
                </div>

                <div>
                    {/* <p className='input_instructions mb-2 text-sm'>Estado</p> */}
                    <div className='flex gap-2'>
                        <ChipState state={cattle.state} />
                        <div>
                            <p className="input_instructions text-sm -mb-1 text-start">
                                {lastState}
                            </p>
                            <p className="input_instructions text-xs text-start">
                                {lastMeditionHour}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    {/* <p className='input_instructions mb-2 text-sm'>Cond. Corporal</p> */}
                    <div className='flex gap-2'>
                        <ChipBodyCondition measure={Number(cattle.bodyCondition)} bodyRanges={cattle.bodyRanges} />
                        <div>
                            <p className="input_instructions text-sm -mb-1 text-start">
                                {lastMedition}
                            </p>
                            <p className="input_instructions text-xs text-start">
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