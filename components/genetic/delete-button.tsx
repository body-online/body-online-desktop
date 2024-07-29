'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { LoadingIcon, TrashIcon } from '../ui/icons'
import { deleteGenetic } from '@/actions/genetic'
import { useSession } from 'next-auth/react'
import CardModal from '../ui/card-modal'

const DeleteGeneticBtn = ({ id, name }: { id: string, name: string }) => {
    const { data, status } = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            const { error } = await deleteGenetic(id);
            if (error) { return toast.error(error) }

            toast.success(`Genética eliminada`);
            return router.refresh();
        } catch (error) {
            toast.error('Ha ocurrido un error al eliminar la genética')
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading') return <LoadingIcon />
    if (data?.user?.type != 'owner') return null;

    return (
        <CardModal
            cardLabel={'Eliminar genética'}
            isSubmitting={isLoading}
            buttonIcon={<TrashIcon />}
            buttonBg={'bg-red-600 dark:bg-red-500'}
        >
            <div className='m-auto max-w-lg px-default pb-3 md:pb-6'>
                <div>
                    <p>¿Realmente desea eliminar <b>{name}</b> de su lista de genéticas?</p>
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
        </CardModal>
    )
}

export default DeleteGeneticBtn
