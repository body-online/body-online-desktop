import { GeneticProps } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import BlackOutModal from '../ui/blackout-modal'
import { LoadingIcon, SearchIcon } from '../ui/icons'
import InfoMessage from '../ui/info'
import { enterModal } from '@/lib/constants'
import { motion } from 'framer-motion'
import Card from '../ui/card'

const SelectInputSearchGenetic = ({ handleSelectGenetic, isOpen, setIsOpen, error, isSubmitting }:
    { handleSelectGenetic: Function; isOpen: boolean; setIsOpen: Function; error?: string; isSubmitting?: boolean }) => {
    // genetics
    const [selectedGenetic, setSelectedGenetics] = useState<GeneticProps>()
    const [genetics, setGenetics] = useState<GeneticProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const handleOpen = () => {
        return setIsOpen(true)
    }
    const handleClose = () => {
        return setIsOpen(false)
    }

    const searchGenetics = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.get(`api/genetics`)
            if (data) setGenetics(data)

        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        searchGenetics()
    }, [])

    return (
        <div>
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
                    <Card headerLabel='Seleccionar genética'>
                        <div className="relative max-h-[74vh] flex flex-col overflow-auto pr-1 mt-3">
                            {/* search */}
                            <div className='w-full sticky top-0 z-30'>
                                <div className="backdrop-blur-md pb-2 rounded-lg border custom-border overflow-hidden h-max mb-3 bg-slate-200/50 dark:bg-clightgray/50">
                                    <p className='text-sm mx-2 mt-2 flex gap-1 text-slate-600 dark:text-slate-400'>
                                        {isLoading ? <LoadingIcon /> : genetics?.length ?? 0} resultados
                                    </p>
                                </div>
                            </div>

                            {/* results */}
                            <div className="h-full">
                                {isLoading ?
                                    <div className='flex-center gap-2 py-default'>
                                        <LoadingIcon />
                                        <p className='text-base font-medium font-slate-300'>Buscando resultados</p>
                                    </div>
                                    : genetics?.length > 0 ?
                                        <ul className='w-full overflow-auto space-y-2'>
                                            {genetics.map((genetic, index) => {
                                                return (
                                                    <li key={index}>
                                                        <button
                                                            type='button'
                                                            onClick={() => {
                                                                setSelectedGenetics(genetic);
                                                                handleSelectGenetic(genetic._id);
                                                                handleClose();
                                                            }}
                                                            className='border custom-border md:hover:bg-salte-100 dark:md:hover:bg-clightgray rounded w-full px-3 py-3'
                                                        >
                                                            <div className='text-start w-full'>
                                                                <p className='text-sm opacity-50'>Nombre</p>
                                                                <p className="text-xl">
                                                                    {genetic.name}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        : <InfoMessage type='censored' title='Sin resultados' subtitle='No hemos encontrado genéticas' />
                                }
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </BlackOutModal >

        </div >
    )
}

export default SelectInputSearchGenetic