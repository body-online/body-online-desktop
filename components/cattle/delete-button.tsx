'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Modal from '../ui/modal'

import { LoadingIcon, TrashIcon } from '../ui/icons'
import { deleteCattle } from '@/actions/cattle'
import { enterModal } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import Card from '../ui/card'

const DeleteCattleBtn = ({ id, name }: { id: string, name: string }) => {
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
        const toastDeletingCattle = toast.loading('Eliminando...');
        setIsLoading(true)
        try {
            await deleteCattle(id);

            handleClose()
            router.refresh()
            toast.success(`Individuo eliminado exitosamente!`);
        } catch (error) {
            toast.error('Ha ocurrido un error al eliminar el individuo')
        } finally {
            toast.dismiss(toastDeletingCattle)
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
                    <Card headerLabel='Eliminar individuo'>
                        <div className="mt-6">
                            <p>¿Realmente desea eliminar <b>{name}</b> de su lista de individuos?</p>
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

export default DeleteCattleBtn