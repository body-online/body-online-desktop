import { getLocations } from '@/data/location'
import React from 'react'
import { ErrorIcon } from 'react-hot-toast'

const LocationCounter = async () => {
    const { data, error } = await getLocations({ limit: '1' })

    return (
        <div className='px-2'>
            <div>
                {error ? <ErrorIcon /> :
                    <h3 className='text-xl md:text-2xl font-bold text-cblack dark:text-white text-center'>
                        {data?.totalLocations ?? 0}
                    </h3>
                }
                <p className='text-xs md:text-sm font-medium text-center text-cgray dark:text-slate-300'>Ubicaciones</p>
            </div>
        </div>
    )
}

export default LocationCounter