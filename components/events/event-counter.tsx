import { getEvents } from '@/data/events'
import React from 'react'
import { ErrorIcon } from 'react-hot-toast'

const EventCounter = async () => {
    const { data, error } = await getEvents({ limit: 100, page: 1 })

    return (
        <div className='custom-gradient border custom-border rounded-xl px-2 py-2'>
            <div>
                {error ? <ErrorIcon /> :
                    <h3 className='text-xl md:text-2xl font-bold text-cblack dark:text-white text-center'>
                        {data?.length ?? 0}
                    </h3>
                }
                <p className='text-xs md:text-sm font-medium text-center text-cgray dark:text-slate-300'>Eventos (beta)</p>
            </div>
        </div>
    )
}

export default EventCounter