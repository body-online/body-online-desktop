import { CattleProps } from '@/lib/types'
import React from 'react'

const ChipState = ({ state }: { state?: CattleProps['state'] }) => {

    if (state == "pregnant") {
        return (<div><p className='chip chip_violet'>Gestante</p></div>)
    }
    if (state == "death") {
        return (<div><p className='chip chip_red'>Muerta</p></div>)
    }
    return (<div><p className='chip chip_gray'>No gestante</p></div>)
}

export default ChipState