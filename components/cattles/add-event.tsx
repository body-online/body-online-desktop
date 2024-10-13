'use client'

import { useState } from 'react';

import { EventIcon } from '../ui/icons';
import CreateEventForm from '../create-event-form';
import Modal from '../ui/modal';
import { CattleProps } from '@/lib/types';
import CloseBtn from '../ui/close-btn';

export function AddEventBtn({ defaultCattle, handleRefresh }: { defaultCattle?: CattleProps, handleRefresh?: () => void }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
        return setIsOpen(false)
    }
    const handleOpen = () => {
        setIsOpen(true);
    }

    return (
        <>
            <Modal isOpen={isOpen} handleClose={handleClose}>
                <div className='card_modal'>
                    {/* <div className="header_container">
                        <h2 className='semititle'></h2>
                        <CloseBtn handleClose={handleClose} />
                    </div> */}

                    <CreateEventForm
                        handleByCattle={defaultCattle}
                        handleClose={handleClose}
                        handleRefresh={() => {
                            if (handleRefresh) handleRefresh()
                            handleClose()
                        }}
                    />
                </div>
            </Modal>


            <button
                type='button'
                onClick={handleOpen}
                className='h-max w-max rounded_btn bg-csemigreen dark:bg-clime flex-center px-3 gap-1'
            >
                <p className={`text-white dark:text-cblack font-medium`}>Evento</p>
                <EventIcon stroke='stroke-clime dark:stroke-cblack' />
            </button>

        </>
    )
}

export default AddEventBtn