import { getGenetics } from '@/data/genetic'
import { getLocations } from '@/data/location'
import React from 'react'

export default async function Tutorial() {
    const { error: errorL, data: dataL } = await getLocations({ page: 1, limit: 1 })
    const { error, data } = await getGenetics()

    return (
        <>
            {
                (!error && !errorL) && (data?.length == 0 && dataL?.totalLocations == 0) ? (
                    <div className='w-full rounded-xl bg-black dark:bg-white px-default py-default max-w-1/2'>
                        a
                    </div>
                ) : null
            }
        </>
    )
}