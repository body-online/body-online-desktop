'use client'

import toast from 'react-hot-toast'
import { useState } from 'react'

import { deleteCattle } from '@/actions/cattle'

import { LoadingIcon, TrashIcon } from '../ui/icons'
import CloseBtn from '../ui/close-btn'
import Modal from '../ui/modal'

const DeleteCattleBtn = ({ id, name, handleRefresh }: { id: string, name: string; handleRefresh: () => void }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            const { error } = await deleteCattle(id);
            if (error) {
                return toast.error(error ?? 'Error al borrar el individuo')
            }
            toast.success(`Individuo eliminado`);
            if (handleRefresh)
                handleRefresh()
        } catch (error) {
            toast.error('Ha ocurrido un error al eliminar el individuo')
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
                            Eliminar individuo
                        </p>
                        <CloseBtn handleClose={() => setIsOpen(false)} />
                    </div>
                    <p>
                        ¿Realmente desea eliminar la caravana <b>{name}</b> de su lista de individuos?
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

export default DeleteCattleBtn
