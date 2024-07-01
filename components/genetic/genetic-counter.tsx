import { getGenetics } from '@/data/genetic'
import React from 'react'
import { ErrorIcon } from 'react-hot-toast'

const GeneticCounter = async () => {
    const { data, error } = await getGenetics()

    return (
        <div className='px-2'>
            <div>
                {error ? <ErrorIcon /> :
                    <h3 className='text-xl md:text-2xl font-bold text-cblack dark:text-white text-center'>
                        {data?.length ?? 0}
                    </h3>
                }
                <p className='text-xs md:text-sm font-medium text-center text-cgray dark:text-slate-300'>Genéticas</p>
            </div>
        </div>
    )
}

export default GeneticCounter