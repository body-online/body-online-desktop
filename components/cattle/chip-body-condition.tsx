import { CattleProps } from '@/lib/types'
import React from 'react'

const ChipBodyCondition = ({ measure }: { measure?: number }) => {
    const bodyCondition = !measure || measure == 0 ? undefined : measure > 21 ? 'fat' : measure > 10 ? 'ideal' : "skinny"

    if (bodyCondition == "fat") {
        return (
            <div>
                <p className='chip chip_orange'>Gorda {`(${measure})`}</p>
            </div>
        )
    }
    if (bodyCondition == "skinny") {
        return (
            <div>
                <p className='chip chip_yellow'>Flaca {`(${measure})`}</p>
            </div>
        )
    }
    if (bodyCondition == "ideal") {
        return (
            <div>
                <p className='chip chip_green'>Ideal {`(${measure})`}</p>
            </div>
        )
    }
    return (
        <div>
            <p className='chip chip_gray'>Sin mediciones</p>
        </div>
    )
}

export default ChipBodyCondition