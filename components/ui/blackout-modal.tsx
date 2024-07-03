// Resources
import { enterModal, modalBackground } from '@/lib/constants';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { CloseIcon } from './icons';
import { ModalProps } from '@/lib/types';

{/* children props required! =>
    onClick={(e) => e.stopPropagation()}
    variants={enterModal}
    initial="hidden"
    animate="visible"
    exit="exit"
*/}

const BlackOutModal = ({ handleClose, children, isOpen }: ModalProps) => {

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && handleClose) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        } else {
            document.removeEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, handleClose]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isOpen]);

    return (
        <AnimatePresence
            initial={false}
            mode='wait'
        >
            {isOpen && (
                <motion.div
                    variants={modalBackground}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed h-screen w-screen inset-0 top-0 z-50 bg-cblack/35 dark:bg-cgray/35 backdrop-blur flex-center overflow-hidden px-2"
                    onClick={(e) => { return e.stopPropagation() }}
                >
                    {/* close indicator */}
                    {handleClose ?
                        <div className="flex gap-2">
                            <div className="absolute top-4 right-4 z-20">
                                <div className="flex-center gap-2">
                                    <p className='text-[10px] sm:text-[12px] font-bold text-white hidden md:block dark:text-white animate-pulse'>
                                        Pulse ESC para cerrar
                                    </p>
                                    <motion.button
                                        variants={enterModal}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        type='button'
                                        onClick={() => handleClose()}
                                        className="px-1 py-1 rounded-md bg-slate-200 dark:bg-cblack border custom-border">
                                        <CloseIcon fill='fill-cgray dark:fill-white' />
                                    </motion.button>
                                </div>

                            </div>
                        </div>
                        : null
                    }
                    <div className="relative w-full">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BlackOutModal;

