import { LocationProps } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import BlackOutModal from '../ui/blackout-modal'
import { LoadingIcon, SearchIcon } from '../ui/icons'
import InfoMessage from '../ui/info'
import { enterModal } from '@/lib/constants'
import { motion } from 'framer-motion'

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
            const { data } = await axios.get(`api/locations`, { params: { page: 1, limit: 20, name: searchTerm } })
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
        <div className='w-full'>
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
                    <p className='w-full truncate'>
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

                >
                    <div className='w-[90vw] h-[80vh] relative pr-1 max-w-sm overflow-auto'>
                        {/* header */}
                        <div
                            className="w-full sticky top-0 z-30 mb-3 h-20
                            bg-gradient-to-b custom-gradient"
                        >
                            <div className="flex-between gap-3 mb-2">
                                <h1 className="semititle">Seleccionar ubicación</h1>
                                <p className='text-slate-400 text-sm'>
                                    {isLoading ? 'buscando' : locations?.length ?? 0} resultados
                                </p>
                            </div>

                            <label>
                                <div className="flex-center px-3 gap-2 text-sm md:text-base transition rounded-lg border hover:border-gray-400 focus:outline-0 focus:ring-[1px] ring-slate-300 dark:ring-slate-600 w-full disabled:opacity-50 bg-white dark:bg-clightgray dark:border-gray-800 dark:md:hover:border-slate-700">
                                    {isLoading ? <LoadingIcon /> :
                                        <SearchIcon fill='fill-cblack dark:fill-white' />
                                    }
                                    <input
                                        className={`text-base h-12 border-none bg-transparent focus:outline-none w-full placeholder:text-slate-400 placeholder:font-normal disabled:opacity-50`}
                                        disabled={!locations}
                                        placeholder="Escriba el nombre de la ubicación..."
                                        value={searchTerm ?? ''}
                                        onChange={({ target }) => { return setSearchTerm(target.value) }}
                                    />
                                </div>
                            </label>
                        </div>



                        {isLoading ? (
                            <div className='flex-center gap-2 py-default'>
                                <LoadingIcon />
                                <p className='text-base font-medium font-slate-300'>Buscando resultados</p>
                            </div>
                        ) : locations?.length > 0 ? (
                            <ul className='w-full flex flex-col gap-2 overflow-auto'>
                                {locations.map((location, index) => {
                                    return (
                                        <li key={index}>
                                            <button
                                                type='button'
                                                className='w-full border custom-border rounded-md bg-slate-100 dark:bg-cgray'
                                                onClick={() => {
                                                    setSelectedLocations(location);
                                                    handleSelectLocation(location._id);
                                                    handleClose();
                                                }}
                                            >
                                                <div className="flex h-9 gap-4 mb-2">
                                                    <div className='flex flex-col h-full items-start justify-between'>
                                                        <p className='text-xs font-medium'>Nombre</p>
                                                        <b className="text-center w-full">
                                                            {location.name}
                                                        </b>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : <InfoMessage type='censored' title='Sin resultados' subtitle='No hemos encontrado ubicaciones' />
                        }
                    </div>
                    < div
                        className="w-full sticky bottom-0 h-12 z-20
                        bg-gradient-to-t custom-gradient"
                    />
                </motion.div>
            </BlackOutModal>

        </div >
    )
}

export default SelectInputSearchLocation