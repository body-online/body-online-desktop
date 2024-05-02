import { CattleProps } from '@/lib/types'
import React from 'react'

const ChipBodyCondition = ({ type }: { type?: CattleProps['bodyCondition'] }) => {
    if (type == "death") {
        return <div><p className='chip chip_red'>Muerta</p></div>
    }
    if (type == "fat") {
        return (<div><p className='chip chip_orange'>Gorda</p></div>)
    }
    if (type == "skinny") {
        return (<div><p className='chip chip_orange'>Flaca</p></div>)
    }
    if (type == "ideal") {
        return (<div><p className='chip chip_green'>Ideal</p></div>)
    }
    return (<div><p className='chip chip_gray'>Sin mediciones</p></div>)
}

export default ChipBodyCondition