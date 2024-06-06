import { GeneticProps } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import BlackOutModal from '../ui/blackout-modal'
import { LoadingIcon, SearchIcon } from '../ui/icons'
import InfoMessage from '../ui/info'
import { enterModal } from '@/lib/constants'
import { motion } from 'framer-motion'

const SelectInputSearchGenetic = ({ handleSelectGenetic, isOpen, setIsOpen, error, isSubmitting }: {
    handleSelectGenetic: Function; isOpen: boolean; setIsOpen: Function; error?: string; isSubmitting?: boolean
}) => {
    // genetics
    const [selectedGenetic, setSelectedGenetics] = useState<GeneticProps>()
    const [genetics, setGenetics] = useState<GeneticProps[]>([])
    const [filteredResults, setFilteredResults] = useState<GeneticProps[] | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState<string>()

    const handleOpen = () => {
        return setIsOpen(true)
    }
    const handleClose = () => {
        return setIsOpen(false)
    }

    const getGenetics = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.get(`api/genetics`)
            if (Array.isArray(data)) {
                setGenetics(data)
            }

        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getGenetics()
    }, [])

    // debounce input filter
    useEffect(() => {
        if (searchTerm) {
            const filter = genetics.filter((genetic) => genetic?.name?.toLowerCase()?.indexOf(searchTerm.toLowerCase()) >= 0)

            return setFilteredResults(filter)
        }
        setFilteredResults(genetics)
    }, [searchTerm, genetics]);

    return (
        <div className='w-full'>
            <p className='input_label'>
                Genética
            </p>
            <button
                type='button'
                className='input text-start w-full disabled:opacity-50'
                onClick={handleOpen}
                disabled={isSubmitting}
            >
                <div className="flex-between gap-2">
                    <p className='w-full truncate'>
                        {selectedGenetic ? selectedGenetic?.name : 'Seleccionar genética'}
                    </p>
                    <SearchIcon />
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
                            bg-gradient-to-b from-white via-white/90 to-transparent"
                        >
                            <div className="flex-between gap-3 mb-2">
                                <h1 className="semititle">Seleccionar genética</h1>
                                <p className='text-slate-400 text-sm'>
                                    {isLoading ? 'buscando' : genetics?.length ?? 0} resultados
                                </p>
                            </div>

                            <label>
                                <div className="flex input gap-3 items-center w-full backdrop-blur-sm bg-white/50">
                                    {isLoading ? <LoadingIcon /> :
                                        <SearchIcon fill={`fill-slate-400`} />
                                    }
                                    <input
                                        className={`text-base h-12 border-none bg-transparent focus:outline-none w-full placeholder:text-slate-400 placeholder:font-normal disabled:opacity-50`}
                                        disabled={!genetics}
                                        placeholder="Escriba el nombre de la caravana..."
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
                        ) : filteredResults ? (
                            <ul className='w-full flex flex-col gap-2 overflow-auto'>
                                {genetics.map((genetic, index) => {
                                    return (
                                        <li key={index}>
                                            <button
                                                type='button'
                                                className='w-full py-4 px-4 transition-all rounded-xl border
                                            md:opacity-70 md:hover:opacity-100 md:hover:bg-white md:bg-slate-100'
                                                onClick={() => {
                                                    setSelectedGenetics(genetic);
                                                    handleSelectGenetic(genetic._id);
                                                    handleClose();
                                                }}
                                            >
                                                <div className="flex-between">
                                                    <p className='text-start font-medium text-lg'>
                                                        {genetic.name}
                                                    </p>

                                                    <div className="text-base font-medium w-20 chip chip_green">
                                                        {genetic?.bodyRanges?.[0]} - {genetic?.bodyRanges?.[1]}
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : <InfoMessage type='censored' title='Sin resultados' subtitle='No hemos encontrado genéticas' />
                        }
                        < div
                            className="w-full sticky bottom-0 h-12 z-20
                        bg-gradient-to-t from-white via-white/90 to-transparent "
                        />

                    </div>
                </motion.div>
            </BlackOutModal>

        </div>
    )
}

export default SelectInputSearchGenetic