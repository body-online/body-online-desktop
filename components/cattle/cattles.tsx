import React from 'react'
import InfoMessage from '../ui/info'
import CattlesDataTable from './table'
import AddCattleBtn from './add-button'
import { CattleProps, GeneticProps, LocationProps } from '@/lib/types'
import { columnsCattle } from './columns'
import ResizablePanel from '../ui/resizable-panel'
import { MiniExpandIcon } from '../ui/icons'

type CattlePageProps = {
    genetics?: GeneticProps[];
    locations?: LocationProps[];
    cattles?: CattleProps[];
    errorCattle?: string;
}

const Cattles = ({ genetics, locations, cattles, errorCattle }: CattlePageProps) => {

    return (
        <div className='card overflow-hidden'>
            {// verify that genetics & locations are not undefined and have data inside
                (genetics && Array.isArray(genetics) && genetics.length > 0) && (locations && Array.isArray(locations) && locations.length > 0) ? (
                    <>
                        {/* header */}
                        <div className="px-4 md:px-5 py-5 md:py-6">
                            <div className='flex items-center justify-between h-max'>
                                <h2 className='title'>
                                    Mi plantel
                                </h2>

                                <div className="flex-center gap-3">
                                    <div className='flex-center gap-2'>
                                        <p className='font-medium text-base sm:text-lg text-black pl-3'>{cattles?.length}</p>
                                        <AddCattleBtn data={{ genetics, locations }} />
                                    </div>

                                    {/* <button className="rounded_btn slate" >
                                        <MiniExpandIcon fill="fill-black" />
                                    </button> */}
                                </div>
                            </div>
                        </div>

                        {cattles && Array.isArray(cattles) && !errorCattle ?
                            <CattlesDataTable cattles={cattles} columns={columnsCattle} /> :
                            <InfoMessage
                                type='warning'
                                title='Sección inaccesible'
                                subtitle='Hemos experimentado un contratiempo al obtener su plantel.'
                            />
                        }
                    </>
                ) : (
                    <InfoMessage
                        type='censored'
                        title='Sección inaccesible'
                        subtitle='Para habilitar esta sección debes primero crear al menos 1 genética y ubicación.'
                    />
                )
            }
        </div>
    )
}

export default Cattles