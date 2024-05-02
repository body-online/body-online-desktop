import React from 'react'
import InfoMessage from '../ui/info'
import AddGeneticBtn from './add-button'
import { columnsGenetic } from './columns'
import { GeneticProps } from '@/lib/types'
import GeneticsDataTable from './table'

type GeneticPageProps = { error?: string; genetics?: GeneticProps[]; }

const Genetics = ({ genetics, error }: GeneticPageProps) => {

    return (
        <div className='card h-min'>
            {// verify that genetics are not undefined and have data inside
                <>
                    {/* header */}
                    <div className="px-4 md:px-5 py-5 md:py-6">
                        <div className='flex items-center justify-between h-max'>
                            <h2 className='title'>
                                Genéticas
                            </h2>
                            <div className='flex-center gap-3'>
                                <p className='font-medium text-base sm:text-lg text-black pl-3'>{genetics?.length}</p>
                                <AddGeneticBtn />
                            </div>
                        </div>
                    </div>

                    {(genetics && Array.isArray(genetics) && !error) ?
                        <GeneticsDataTable genetics={genetics} columns={columnsGenetic} /> :
                        <InfoMessage
                            type='warning'
                            title='Sección inaccesible'
                            subtitle='Hemos experimentado un contratiempo al obtener su listado de genéticas.'
                        />
                    }
                </>
            }
        </div>
    )
}

export default Genetics