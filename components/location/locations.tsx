import React from 'react'
import InfoMessage from '../ui/info'
import AddLocationBtn from './add-button'
import { columnsLocation } from './columns'
import { LocationProps } from '@/lib/types'
import LocationsDataTable from './table'

type LocationPageProps = { error?: string; locations?: LocationProps[]; }

const Locations = ({ locations, error }: LocationPageProps) => {

    return (
        <div className='card h-min'>
            {// verify that locations are not undefined and have data inside
                <>
                    {/* header */}
                    <div className="px-4 md:px-5 pt-6">
                        <div className='flex items-center justify-between h-max'>
                            <h2 className='title'>
                                Ubicaciones
                            </h2>
                            <div className="flex-center gap-3">
                                <div className='flex-center gap-3 border rounded-full p-1'>
                                    <p className='font-medium text-base text-black pl-4'>{locations?.length}</p>
                                    <AddLocationBtn />
                                </div>

                                {/* <button className="rounded_btn slate" >
                                        <MiniExpandIcon fill="fill-black" />
                                    </button> */}
                            </div>
                        </div>
                    </div>

                    {(locations && Array.isArray(locations) && !error) ?
                        <LocationsDataTable locations={locations} columns={columnsLocation} /> :
                        <InfoMessage
                            type='warning'
                            title='Sección inaccesible'
                            subtitle='Hemos experimentado un contratiempo al obtener su listado de ubicaciones.'
                        />
                    }
                </>
            }
        </div>
    )
}

export default Locations