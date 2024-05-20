'use client';

import React, { useState } from 'react'
import { motion } from 'framer-motion';

import { enterModal } from '@/lib/constants';
import { LocationProps } from '@/lib/types';
import { InfoIcon } from '../ui/icons'
import Modal from '../ui/modal';
import Card from '../ui/card';


const DescriptionBtn = ({ location }: { location: LocationProps }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOpen = () => {
        return setIsOpen(true);
    }
    const handleClose = () => {
        return setIsOpen(false);
    }

    return (
        <>
            <button
                className='rounded_btn'
                disabled={!location?.description}
                onClick={handleOpen}
            >
                <InfoIcon fill='fill-black' />
            </button>

            <Modal isOpen={isOpen} handleClose={handleClose}>
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-xl"
                    variants={enterModal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Card headerLabel={`Descripción ${location.name}`}>
                        <div className="mt-4">
                            <p>{location.description}</p>
                        </div>

                        <div className="mt-6 grid grid-cols-2">
                            <button
                                type='button'
                                onClick={handleClose}
                                className='btn slate'
                            >
                                <p>Cerrar</p>
                            </button>
                        </div>
                    </Card>
                </motion.div>
            </Modal>
        </>
    )
}

export default DescriptionBtn