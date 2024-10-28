'use client'

import toast from 'react-hot-toast'
import { useState } from 'react'

import { deleteLocation } from '@/actions/location'

import { LoadingIcon, TrashIcon } from '../ui/icons'
import CloseBtn from '../ui/close-btn'
import Modal from '../ui/modal'

const DeleteLocationBtn = ({ id, name, searchLocations }: { id: string, name: string; searchLocations: () => void }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            const { error } = await deleteLocation(id);
            if (error) {
                return toast.error(error ?? 'Error al borrar la ubicación')
            }
            toast.success(`Ubicación eliminada`);
            if (searchLocations)
                searchLocations()
        } catch (error) {
            toast.error('Ha ocurrido un error al eliminar la ubicación')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button className='rounded_btn' onClick={() => setIsOpen(true)}>
                <TrashIcon fill='fill-cgray dark:fill-white' />
            </button>

            <Modal
                handleClose={() => setIsOpen(false)}
                isOpen={isOpen}

            >
                <div className='p-4 w-full card'>
                    <div className="flex-between mb-4">
                        <p className="semititle">
                            Eliminar ubicación
                        </p>
                        <CloseBtn handleClose={() => setIsOpen(false)} />
                    </div>
                    <p>
                        ¿Realmente desea eliminar <b>{name}</b> de su lista de ubicaciones?
                    </p>
                    <p>
                        Esta acción es <b>irreversible</b>.
                    </p>

                    <div className="mt-6 flex-end gap-3">
                        <button
                            type="button"
                            className="rounded_btn red"
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
            </Modal>
        </>
    )
}

export default DeleteLocationBtn
