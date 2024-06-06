'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Modal from '../ui/modal'

import { LoadingIcon, TrashIcon } from '../ui/icons'
import { deleteLocation } from '@/actions/location'
import { enterModal } from '@/lib/constants'
import Card from '../ui/card'
import BlackOutModal from '../ui/blackout-modal'

const DeleteLocationBtn = ({ id, name }: { id: string, name: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const router = useRouter()

    const handleOpen = () => {
        document.body.style.overflow = "hidden";
        setIsOpen(true)
    }
    const handleClose = () => {
        document.body.style.overflow = "auto";
        setIsOpen(false)
    }

    const handleDelete = async () => {
        const toastDeletingLocation = toast.loading('Eliminando...');
        setIsLoading(true)
        try {
            const { error, data: createdLocation } = await deleteLocation(id);
            if (error) return toast.error(error)
            handleClose()
            toast.success(`Ubicación eliminada`);
            return router.refresh();
        } catch (error) {
            toast.error('Ha ocurrido un error al eliminar la ubicación')
        } finally {
            toast.dismiss(toastDeletingLocation)
            setIsLoading(false)
        }
    }
    return (
        <>
            <button
                className='group transition-all'
                onClick={handleOpen}
            >
                <TrashIcon fill='fill-slate-500 md:group-hover:fill-slate-900 transition-all' />
            </button>

            <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"

                >
                    <div className='w-[90vw] h-[80vh] overflow-auto pr-1 max-w-md'>
                        {/* header */}
                        <div
                            className="w-full sticky top-0 z-10 mb-3
                            bg-gradient-to-b from-white via-white/80 to-transparent"
                        >
                            <div className="flex-between gap-3 mb-2">
                                <h1 className="semititle">Eliminar ubicación</h1>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p>¿Realmente desea eliminar <b>{name}</b> de su lista de ubicaciones?</p>
                            <p>Esta acción es <b>irreversible</b>.</p>
                        </div>

                        <div className="mt-6 flex-end gap-3">
                            <button
                                type="button"
                                className="btn red"
                                disabled={isLoading}
                                onClick={handleDelete}
                            >
                                {isLoading ? (
                                    <LoadingIcon />
                                ) :
                                    <>
                                        <p>Eliminar</p>
                                        <TrashIcon />
                                    </>
                                }
                            </button>
                        </div>
                    </div>
                </motion.div>
            </BlackOutModal>
        </>
    )
}

export default DeleteLocationBtn
