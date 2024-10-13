'use client'

import { LocationProps } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import BlackOutModal from '../ui/blackout-modal'
import { LoadingIcon, SearchIcon } from '../ui/icons'
import InfoMessage from '../ui/info'
import { enterModal } from '@/lib/constants'
import { motion } from 'framer-motion'
import Card from '../ui/card'
import { getLocations } from '@/data/location'

const SelectInputSearchLocation = ({ handleSelectLocation, isOpen, setIsOpen, error, isSubmitting }:
    { handleSelectLocation: Function; isOpen: boolean; setIsOpen: Function; error?: string; isSubmitting?: boolean }) => {
    // locations
    const [selectedLocation, setSelectedLocations] = useState<LocationProps>()
    const [locations, setLocations] = useState<LocationProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState<string>()

    const handleOpen = () => {
        return setIsOpen(true)
    }
    const handleClose = () => {
        return setIsOpen(false)
    }

    const searchLocations = async () => {
        setIsLoading(true)
        try {
            const { data } = await getLocations({ page: 1, limit: 20, name: searchTerm })
            if (data?.locations) setLocations(data.locations)

        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        searchLocations()
    }, [])

    // debounce input filter
    useEffect(() => {
        const handler = setTimeout(() => {
            searchLocations();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    return (
        <div>
            <p className='input_label'>
                Ubicación
            </p>
            <button
                type='button'
                className='input text-start w-full disabled:opacity-50'
                onClick={handleOpen}
                disabled={isSubmitting}
            >
                <div className="flex-between gap-2">
                    <p className='w-full truncate opacity-50'>
                        {selectedLocation ? selectedLocation?.name : 'Seleccionar ubicación'}
                    </p>
                    <SearchIcon fill='fill-cblack dark:fill-white' />
                </div>
            </button>
            <div className="input_error">
                {error && (<p>{`${error}`}</p>)}
            </div>

            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='m-auto max-w-xl'
                >
                    <Card headerLabel='Seleccionar ubicación'>
                        <div className="relative max-h-[74vh] flex flex-col overflow-auto pr-1 mt-3">
                            {/* search */}
                            <div className='w-full sticky top-0 z-30'>
                                <div className="backdrop-blur-md pb-2 rounded-lg border custom-border overflow-hidden h-max mb-3 bg-slate-200/50 dark:bg-clightgray/50">
                                    <div className="flex-center px-3 gap-2 outline-0 ring-0 bg-white dark:bg-clightgray border-b custom-border">
                                        <SearchIcon fill='fill-cblack dark:fill-slate-200' />

                                        <input
                                            className={`text-base h-12 bg-transparent outline-0 ring-0 w-full disabled:opacity-50`}
                                            disabled={!locations}
                                            placeholder="Buscar ubicación..."
                                            value={searchTerm ?? ''}
                                            onChange={({ target }) => { return setSearchTerm(target.value) }}
                                        />
                                    </div>

                                    <p className='text-sm mx-2 mt-2 flex gap-1 text-slate-600 dark:text-slate-400'>
                                        {isLoading ? <LoadingIcon /> : locations?.length ?? 0} resultados
                                    </p>
                                </div>
                            </div>


                            {/* results */}
                            <div className="h-full">
                                {isLoading ?
                                    <div className='py-default'>
                                        <LoadingIcon />
                                    </div>
                                    : locations?.length > 0 ?
                                        <ul className='w-full overflow-auto space-y-2'>
                                            {locations.map((location, index) => {
                                                return (
                                                    <li key={index}>
                                                        <button
                                                            type='button'
                                                            onClick={() => {
                                                                setSelectedLocations(location);
                                                                handleSelectLocation(location._id);
                                                                handleClose();
                                                            }}
                                                            className='border custom-border md:hover:bg-salte-100 dark:md:hover:bg-clightgray rounded w-full px-3 py-3'
                                                        >
                                                            <div className='text-start w-full'>
                                                                <p className='text-sm opacity-50'>Nombre</p>
                                                                <p className="text-xl">
                                                                    {location.name}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        :
                                        <div className="p-4">
                                            <InfoMessage
                                                type='info'
                                                title='Sin resultados'
                                                subtitle='No se han registrado ubicaciones.'
                                            />
                                        </div>
                                }
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </BlackOutModal >

        </div >
    )
}

export default SelectInputSearchLocation