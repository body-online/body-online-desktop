import { getCattles } from '@/data/cattle'
import React from 'react'
import { ErrorIcon } from 'react-hot-toast'

const CattleCounter = async () => {
    const { data, error } = await getCattles({ limit: '1' })

    return (
        <div>
            {error ? <ErrorIcon /> :
                <h3 className='text-3xl font-bold text-cgreen'>{data?.totalCattles ?? '-'}</h3>
            }
        </div>
    )
}

export default CattleCounter