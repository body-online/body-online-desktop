'use client';

import { CattleProps } from '@/lib/types';

const CaravansResume = ({ cattles, truncateAt }: { cattles: CattleProps[]; truncateAt?: number }) => {
    const truncate: number = truncateAt ?? cattles?.length
    const leftAssigned = (cattles?.length) - truncate
    const showOnly = cattles?.slice(0, truncate)


    if (!showOnly?.length) return <p className='input_instructions'>-</p>
    return (
        <div>
            <div className="w-max flex items-center select-none">
                <div className="bg-white dark:bg-clightgray flex-center gap-2 rounded-full px-3 h-8">
                    {showOnly.map((caravan, index) => {
                        return (
                            <div
                                className='flex'
                                key={index}
                            >
                                <p className='font-medium text-lg'>
                                    {caravan.caravan}
                                    {showOnly.length != (index + 1) ? ',' : ''}
                                </p>
                            </div>
                        )
                    })}
                </div>
                {
                    leftAssigned >= 1 ?
                        <p className='ml-1 font-medium text-sm text-slate-500 dark:text-slate-400'>
                            {leftAssigned} más
                        </p> : null
                }
            </div>
        </div>
    )
}

export default CaravansResume