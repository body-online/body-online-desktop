import { CattleProps } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import BlackOutModal from '../ui/blackout-modal'
import { LoadingIcon, SearchIcon } from '../ui/icons'
import InfoMessage from '../ui/info'
import { enterModal } from '@/lib/constants'
import { motion } from 'framer-motion'
import ChipBodyCondition from './chip-body-condition'
import ChipState from './chip-state'

const SelectInputSearchCattle = ({ selectedCattle, handleSelectCattle, isOpen, setIsOpen, error, isSubmitting }:
    { selectedCattle?: CattleProps; defaultCattle?: CattleProps, handleSelectCattle: Function; isOpen: boolean; setIsOpen: Function; error?: string; isSubmitting?: boolean }) => {
    // cattles
    const [cattles, setCattles] = useState<CattleProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState<string>()

    const handleOpen = () => {
        if (isSubmitting) return null
        return setIsOpen(true)
    }
    const handleClose = () => {
        return setIsOpen(false)
    }

    const searchCattles = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.get(`api/cattles`, { params: { page: 1, limit: 10, name: searchTerm } })
            if (data?.cattles) setCattles(data.cattles)

        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        searchCattles()
    }, [])

    // debounce input filter
    useEffect(() => {
        const handler = setTimeout(() => {
            searchCattles();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    return (
        <div className='w-full'>
            <p className='input_label'>
                Caravana
            </p>
            <button
                type='button'
                className='input text-start w-full disabled:opacity-50'
                onClick={handleOpen}
                disabled={isSubmitting}
            >
                <div className="flex-between gap-2">
                    <p className='w-full truncate'>
                        {selectedCattle ? selectedCattle?.caravan : 'Seleccionar caravana'}
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
                                <h1 className="semititle">Seleccionar caravana</h1>
                                <p className='text-slate-400 text-sm'>
                                    {isLoading ? 'buscando' : cattles?.length ?? 0} resultados
                                </p>
                            </div>

                            <label>
                                <div className="flex input gap-3 items-center w-full backdrop-blur-sm bg-white/50">
                                    {isLoading ? <LoadingIcon /> :
                                        <SearchIcon fill={`fill-slate-400`} />
                                    }
                                    <input
                                        className={`text-base h-12 border-none bg-transparent focus:outline-none w-full placeholder:text-slate-400 placeholder:font-normal disabled:opacity-50`}
                                        disabled={!cattles}
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
                        ) : cattles?.length > 0 ? (
                            <ul className='w-full flex flex-col gap-2 overflow-auto'>
                                {cattles.map((cattle, index) => {
                                    return (
                                        <li key={index}>
                                            <button
                                                type='button'
                                                className='w-full py-4 px-4 transition-all rounded-xl border
                                                md:opacity-70 md:hover:opacity-100 md:hover:bg-white md:bg-slate-100'
                                                onClick={() => {
                                                    handleSelectCattle(cattle);
                                                    handleClose();
                                                }}
                                            >
                                                <div className="flex h-9 gap-4 mb-2">
                                                    <div className='flex flex-col h-full items-start justify-between'>
                                                        <p className='text-xs font-medium'>Caravana</p>
                                                        <b className="text-center text-lg w-full">
                                                            {cattle.caravan}
                                                        </b>
                                                    </div>
                                                    <div className='flex flex-col h-full items-start justify-between'>
                                                        <p className='text-xs font-medium'>Genetica</p>
                                                        <p>{cattle?.geneticName}</p>
                                                    </div>
                                                    <div className='flex flex-col h-full items-start justify-between'>
                                                        <p className='text-xs font-medium'>Ubicacion</p>
                                                        <p>
                                                            {cattle?.locationName}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="scale-[0.8] flex -ml-10 gap-3">
                                                    <ChipState state={cattle?.state} />
                                                    <ChipBodyCondition bodyRanges={cattle?.bodyRanges} measure={Number(cattle.bodyCondition)} />
                                                </div>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : <InfoMessage type='censored' title='Sin resultados' subtitle='No hemos encontrado ubicaciones' />
                        }

                        <div className="w-full sticky bottom-0 z-30 mt-3 h-12 bg-gradient-to-t from-white via-white/90 to-transparent"></div>
                    </div>
                </motion.div>
            </BlackOutModal>
        </div >
    )
}

export default SelectInputSearchCattle