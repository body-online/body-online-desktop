// 'use client'

// import { useRouter } from 'next/navigation'
// import React, { useState } from 'react'
// import { motion } from 'framer-motion'
// import toast from 'react-hot-toast'

// import { LoadingIcon, TrashIcon } from '../ui/icons'
// import { deleteLocation } from '@/actions/location'
// import { enterModal } from '@/lib/constants'
// import BlackOutModal from '../ui/blackout-modal'
// import Card from '../ui/card'
// import { useSession } from 'next-auth/react'

// const DeleteLocationBtn = ({ id, name }: { id: string, name: string }) => {
//     const { data, status } = useSession()
//     const [isLoading, setIsLoading] = useState<boolean>(false)
//     const [isOpen, setIsOpen] = useState<boolean>(false)
//     const router = useRouter()

//     const handleOpen = () => {
//         document.body.style.overflow = "hidden";
//         setIsOpen(true)
//     }
//     const handleClose = () => {
//         document.body.style.overflow = "auto";
//         setIsOpen(false)
//     }

//     const handleDelete = async () => {
//         // const toastDeletingLocation = toast.loading('Eliminando...');
//         setIsLoading(true)
//         try {
//             await deleteLocation(id);
//             handleClose()
//             toast.success(`Ubicación eliminada`);
//             return router.refresh();
//         } catch (error) {
//             toast.error('Ha ocurrido un error al eliminar la ubicación')
//         } finally {
//             // toast.dismiss(toastDeletingLocation)
//             setIsLoading(false)
//         }
//     }

//     if (status === 'loading') return <LoadingIcon />
//     if (data?.user?.type != 'owner') return null;
//     return (
//         <>
//             <button
//                 className='rounded-full ring-0 md:hover:opacity-70 active:opacity-50 transition-all'
//                 onClick={handleOpen}
//             >
//                 <TrashIcon fill='fill-cgray dark:fill-white' />
//             </button>

//             <BlackOutModal isOpen={isOpen} handleClose={handleClose}>
//                 <motion.div
//                     onClick={(e) => e.stopPropagation()}
//                     variants={enterModal}
//                     initial="hidden"
//                     animate="visible"
//                     exit="exit"
//                     className='m-auto max-w-lg'
//                 >
//                     <Card headerLabel='Eliminar ubicación'>

//                         <div className="mt-6">
//                             <p>¿Realmente desea eliminar <b>{name}</b> de su lista de ubicaciones?</p>
//                             <p>Esta acción es <b>irreversible</b>.</p>
//                         </div>

//                         <div className="mt-6 flex-end gap-3">
//                             <button
//                                 type="button"
//                                 className="btn red"
//                                 disabled={isLoading}
//                                 onClick={handleDelete}
//                             >
//                                 {isLoading ? (
//                                     <LoadingIcon />
//                                 ) :
//                                     <>
//                                         <p>Eliminar</p>
//                                         <TrashIcon />
//                                     </>
//                                 }
//                             </button>
//                         </div>
//                     </Card>
//                 </motion.div>
//             </BlackOutModal>
//         </>
//     )
// }

// export default DeleteLocationBtn
'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import { LoadingIcon, TrashIcon } from '../ui/icons'
import { deleteLocation } from '@/actions/location'
import { useSession } from 'next-auth/react'
import CardModal from '../ui/card-modal'

const DeleteLocationBtn = ({ id, name }: { id: string, name: string }) => {
    const { data, status } = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await deleteLocation(id);

            toast.success(`Ubicación eliminada`);
            return router.refresh();
        } catch (error) {
            toast.error('Ha ocurrido un error al eliminar la ubicación')
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading') return <LoadingIcon />
    if (data?.user?.type != 'owner') return null;

    return (
        <CardModal
            cardLabel={'Eliminar ubicación'}
            isSubmitting={isLoading}
            buttonIcon={<TrashIcon />}
            buttonBg={'bg-red-600 dark:bg-red-500'}
        >
            <div className='m-auto max-w-lg px-default pb-3 md:pb-6'>
                <div>
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
        </CardModal>
    )
}

export default DeleteLocationBtn
