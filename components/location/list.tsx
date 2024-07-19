'use client'

import React from 'react'

import DeleteLocationBtn from './delete-button'
import AddLocationBtn from './add-button'
import ResizablePanel from '../ui/resizable-panel'
import { LocationProps } from '@/lib/types'
import InfoMessage from '../ui/info'

const Locations = ({ locations, error }: { error?: string; locations?: LocationProps[]; }) => {

    return (

        <div className='rounded-2xl custom-gradient border custom-border w-full overflow-hidden'>
            {/* header */}
            <div className="px-4 md:px-5 py-6">
                <div className='flex items-center justify-between h-8'>
                    <h2 className='text-xl font-bold leading-5'>
                        Ubicaciones <span className='opacity-20 ml-1'>{locations?.length ?? 0}</span>
                    </h2>
                    <AddLocationBtn />
                </div>
            </div>



            <ResizablePanel>
                {error || !locations ? (
                    <InfoMessage type='warning' title='Ha ocurrido un error al obtener las ubicaciones' subtitle={error} />
                ) : locations.length == 0 ? (
                    <InfoMessage type='info' title='No hemos encontrado ubicaciones' />
                ) : (

                    <div className='max-h-60 relative w-full overflow-x-auto'>
                        <table>
                            <thead>
                                <tr className='sticky top-0 z-10 h-max bg-white dark:bg-slate-950'>
                                    <th><p>Nombre</p></th>
                                    <th><p>Fecha de creación</p></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations?.map((location, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <p className='font-medium text-base sm:text-lg'>{location.name}</p>
                                            </td>
                                            <td>
                                                {new Date(location.createdAt)
                                                    .toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className='flex-end ml-auto gap-2'>
                                                {/* <DescriptionBtn location={location} /> */}
                                                <DeleteLocationBtn id={location._id} name={location.name} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </ResizablePanel>

        </div >
    )
}

export default Locations