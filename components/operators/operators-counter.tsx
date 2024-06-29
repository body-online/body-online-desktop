
import { getOperators } from '@/data/operators'
import { ErrorIcon } from 'react-hot-toast'
import React from 'react'

const OperatorsCounter = async () => {
    const { data, error } = await getOperators({ page: 1, limit: 1 })

    return (
        <div className='custom-gradient border custom-border rounded-xl px-2 py-2'>
            <div>
                {error ? <ErrorIcon /> :
                    <h3 className='text-xl md:text-2xl font-bold text-cblack dark:text-white text-center'>
                        {data?.totalUsers ?? 0}
                    </h3>
                }
                <p className='text-xs md:text-sm font-medium text-center text-cgray dark:text-slate-300'>Operarios</p>
            </div>
        </div>
    )
}

export default OperatorsCounter