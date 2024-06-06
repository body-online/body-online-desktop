import { CattleProps } from '@/lib/types'
import React from 'react'
import ChipBodyCondition from './chip-body-condition'
import ChipState from './chip-state'

const CattleResume = ({ cattle }: { cattle: CattleProps }) => {
    return (
        <div className="w-full flex relative overflow-auto pb-2">

            <div className='sticky left-0 bg-gradient-to-r from-white via-white to-transparent pr-12 w-max'>
                <div className="flex flex-col h-full justify-between">
                    <span className='text-xs text-slate-400'>Caravana</span>
                    <p className='text-xl mt-auto font-semibold mb-1'>{cattle.caravan}</p>
                </div>
            </div>

            <div className="w-max -ml-3">
                <div className="flex gap-9 rounded-full w-max h-full">
                    <div className='flex flex-col h-full justify-between'>
                        <span className='text-xs text-slate-400'>Condición Corporal</span>
                        <ChipBodyCondition bodyRanges={[10, 11]} measure={Number(cattle.bodyCondition)} />
                    </div>
                    <div className='flex flex-col h-full justify-between'>
                        <span className='text-xs text-slate-400'>Estado</span>
                        <ChipState state={cattle.state} />
                    </div>
                    <div className='flex flex-col h-full justify-between'>
                        <span className='text-xs text-slate-400'>Ubicación</span>
                        <p className='text-base font-medium pb-1'>
                            {cattle.locationName}
                        </p>
                    </div>
                    <div className='flex flex-col h-full justify-between'>
                        <span className='text-xs text-slate-400'>Genética</span>
                        <p className='text-base font-medium pb-1'>{cattle.geneticName}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CattleResume