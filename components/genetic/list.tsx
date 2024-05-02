'use client'

import React from 'react'

import DescriptionBtn from './description-button'
import DeleteGeneticBtn from './delete-button'
import AddGeneticBtn from './add-button'
import ResizablePanel from '../ui/resizable-panel'
import { GeneticProps } from '@/lib/types'
import InfoMessage from '../ui/info'

const Genetics = ({ genetics, error }: { error?: string; genetics?: GeneticProps[]; }) => {

    return (

        <div className='card overflow-hidden'>
            {/* header */}
            <div className="px-4 md:px-5 py-5 md:py-6">
                <div className='flex items-center justify-between h-8'>
                    <h2 className='text-xl font-bold leading-5'>
                        Genéticas <span className='opacity-20 ml-1'>{genetics?.length ?? 0}</span>
                    </h2>
                    <AddGeneticBtn />
                </div>
            </div>



            <ResizablePanel>
                {error || !genetics ? (
                    <InfoMessage type='warning' title='Ha ocurrido un error al obtener las genéticas' subtitle={error} />
                ) : genetics.length == 0 ? (
                    <InfoMessage type='info' title='No hemos encontrado genéticas' />
                ) : (
                    <div className='max-h-60 relative w-full overflow-x-auto'>
                        <table>
                            <thead>
                                <tr className='sticky top-0 z-10 h-max bg-white'>
                                    <th><p>Nombre</p></th>
                                    <th><p>Fecha de creación</p></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {genetics?.map((genetic, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <p className='font-medium text-base sm:text-lg'>{genetic.name}</p>
                                            </td>
                                            <td>
                                                {new Date(genetic.createdAt)
                                                    .toLocaleDateString("es-MX", { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className='flex-end ml-auto gap-2'>
                                                <DescriptionBtn genetic={genetic} />
                                                <DeleteGeneticBtn id={genetic._id} name={genetic.name} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )
                }
            </ResizablePanel>

        </div >
    )
}

export default Genetics