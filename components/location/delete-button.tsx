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

const DeleteLocationBtn = ({ id, name }: { id: string, name: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const router = useRouter()

    const handleOpen = () => {
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }

    const handleDelete = async () => {
        const toastDeletingLocation = toast.loading('Eliminando...');
        setIsLoading(true)
        try {
            const { error, data: createdLocation } = await deleteLocation(id);
            if (error) return toast.error(error)
            handleClose()
            router.refresh()
            toast.success(`Ubicación eliminada exitosamente!`);
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
                className='rounded_btn cgreen'
                onClick={handleOpen}
            >
                <TrashIcon fill='fill-clime' />
            </button>

            <Modal handleClose={handleClose} isOpen={isOpen}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-xl"
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Card headerLabel='Eliminar ubicación'>
                        <div className="mt-6">
                            <p>¿Realmente desea eliminar <b>{name}</b> de su lista de ubicaciones?</p>
                            <p>Esta acción es <b>irreversible</b>.</p>
                        </div>

                        <div className="mt-6 flex-end gap-3">
                            <button
                                type='button'
                                onClick={handleClose}
                                className='btn slate'
                                disabled={isLoading}
                            >
                                <p>Cancelar</p>
                            </button>
                            <button
                                type="button"
                                className="btn black"
                                disabled={isLoading}
                                onClick={handleDelete}
                            >
                                {isLoading ? (
                                    <LoadingIcon />
                                ) :
                                    <>
                                        <p>Eliminar</p>
                                        {/* <TrashIcon /> */}
                                    </>
                                }
                            </button>
                        </div>
                    </Card>
                </motion.div>
            </Modal>
        </>
    )
}

export default DeleteLocationBtn

const Icon = () => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
            >
                <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                    clipRule="evenodd"
                />
            </svg>
        </div>

    )
}